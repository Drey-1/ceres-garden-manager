import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../prisma.js";
import {
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
	hashPassword,
	storeRefreshToken,
} from "./auth.service.js";

export async function register(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email)
		return res.status(400).json({ error: "The email must not be nullable." });
	if (!password)
		return res
			.status(400)
			.json({ error: "The password must not be nullable." });

	try {
		const passwordHash = await hashPassword(password);
		await prisma.user.create({
			data: { email, passwordHash },
		});
		return res.status(201).json({ message: "User created." });
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2002") {
				const targetFields = err.meta?.target as string[] | undefined;

				return res.status(409).json({
					error: `The ${targetFields?.join(", ")} has already created.`,
				});
			}
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email)
		return res.status(400).json({ error: "The email must not be nullable." });
	if (!password)
		return res
			.status(400)
			.json({ error: "The password must not be nullable." });

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user)
			return res.status(401).json({ error: "Invalid data for login." });

		const samePassword = await comparePassword(password, user.passwordHash);
		if (!samePassword)
			return res.status(401).json({ error: "Invalid data for login." });

		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		await storeRefreshToken(user.id, refreshToken);

		res.status(200).json({ accessToken, refreshToken });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function refresh(req: Request, res: Response) {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(400).json({ error: "No refresh token provided." });
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
		if (decoded === undefined || decoded.sub === undefined) {
			return res.status(401).json({ error: "Invalid payload." });
		}

		const storedRefresh = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
		});
		if (!storedRefresh || storedRefresh.revoked) {
			return res.status(401).json({ error: "Invalid token." });
		}
		if (storedRefresh.expiresAt < new Date()) {
			return res.status(401).json({ error: "Expired token." });
		}

		const newAccessToken = generateAccessToken(decoded.sub as string);
		const newRefreshToken = generateRefreshToken(decoded.sub as string);

		await prisma.refreshToken.update({
			where: { token: refreshToken },
			data: { revoked: true },
		});

		await storeRefreshToken(decoded.sub as string, newRefreshToken);

		return res
			.status(200)
			.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (err: any) {
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "Invalid token." });
		}

		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Expired token." });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function logout(req: Request, res: Response) {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(400).json({ error: "No refresh token provided." });
	}

	try {
		const storedRefresh = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
		});
		if(storedRefresh?.userId !== req.userId) {
			return res.status(200).json({ message: "Token is logged out." });
		}
		if (!storedRefresh || storedRefresh.revoked) {
			return res.status(200).json({ message: "Token is logged out." });
		}
		if (storedRefresh.expiresAt < new Date()) {
			return res.status(200).json({ message: "Token is logged out." });
		}

		await prisma.refreshToken.update({
			where: { token: refreshToken },
			data: { revoked: true },
		});
		return res.status(200).json({ message: "Token is logged out." });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
