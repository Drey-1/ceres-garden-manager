import type { Request, Response } from "express";
import { getTodayOverview } from "./today.service.js";

export async function getTodayController(req: Request, res: Response) {
	const userId = req.userId;
	if (!userId) return res.status(400).json({ error: "No user ID provided." });

	try {
		const todayOverview = await getTodayOverview(userId);
		return res.status(200).json({ todayOverview });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
