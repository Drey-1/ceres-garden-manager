import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}

export function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (res.headersSent) {
		return next(err);
	}

	if (err && typeof err === "object" && "name" in err) {
		if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "Invalid token." });
		}

		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Expired token." });
		}
	}

	if (err instanceof NotFoundError) {
		return res.status(404).json({ error: err.message });
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2025") {
			return res
				.status(404)
				.json({ error: `${err.meta?.modelName} not found.` });
		}
		if (err.code === "P2002") {
			const targetFields = err.meta?.target as string[] | undefined;
			return res.status(409).json({
				error: `The ${targetFields?.join(", ")} has already created.`,
			});
		}
	}

	console.error(err);
	res.status(500).json({ error: "Internal server error." });
}
