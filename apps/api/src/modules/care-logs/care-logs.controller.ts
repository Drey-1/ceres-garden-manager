import type { Request, Response } from "express";
import { NotFoundError } from "../../errors.js";
import { createCareLog, listCareLogs } from "./care-logs.service.js";

export async function createCareLogController(req: Request, res: Response) {
	const { type, quantity } = req.body;
	const plantingId = String(req.params.id);
	const userId = req.userId;

	if (!type) return res.status(400).json({ error: "Invalid type provided." });
	if (quantity < 0 || Number.isNaN(quantity)) {
		return res.status(400).json({ error: "Invalid quantity provided." });
	}
	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}
	if (!userId) return res.status(400).json({ error: "No user ID provided." });

	try {
		const careLog = await createCareLog(userId, plantingId, {
			type,
			quantity,
		});
		return res.status(201).json({ careLog });
	} catch (err: any) {
		if (err instanceof NotFoundError) {
			return res.status(404).json({ error: err.message });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function listCareLogsController(req: Request, res: Response) {
	const plantingId = String(req.params.id);
	const userId = req.userId;
	const { page, pageSize } = req.query;

	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}
	if (!userId) return res.status(400).json({ error: "No user ID provided." });

	const rawPage = Number(page) || 1;
	const rawPageSize = Number(pageSize) || 3;

	const paginationParams = {
		page: Math.max(1, rawPage),
		pageSize: Math.min(Math.max(1, rawPageSize), 25),
	};

	try {
		const { careLogs, totalOfLogs } = await listCareLogs(
			userId,
			plantingId,
			paginationParams,
		);
		return res.status(200).json({ careLogs, totalOfLogs, paginationParams });
	} catch (err: any) {
		if (err instanceof NotFoundError) {
			return res.status(404).json({ error: err.message });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
