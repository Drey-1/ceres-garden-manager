import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const authorization = req.headers.authorization;
	if (!authorization) {
		return res.status(401).json({ error: "No authorization provided." });
	}
	const token = authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({ error: "No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
		if (decoded === undefined || decoded.sub === undefined) {
			return res.status(401).json({ error: "Invalid Payload." });
		}
		req.userId = decoded.sub as string;
		next();
	} catch (err: any) {
		if (err) return res.status(401).json({ error: "Invalid Token." });
	}
}
