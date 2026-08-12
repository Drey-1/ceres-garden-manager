import type { Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client.js";
import { NotFoundError } from "../../errors.js";
import {
	createPlanting,
	deletePlanting,
	getPlantingById,
	listPlantings,
	updatePlanting,
} from "./plantings.service.js";

export async function createPlantingController(req: Request, res: Response) {
	const data = req.body;
	const userId = req.userId;
	const bedId = String(req.params.id);

	if (!data) return res.status(400).json({ error: "No data provided." });
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId)
		return res.status(400).json({ error: "No bed ID provided." });

	try {
		const planting = await createPlanting(userId, bedId, data);
		return res.status(201).json({ planting });
	} catch (err: any) {
		if (err instanceof NotFoundError) {
			return res.status(404).json({ error: err.message });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getAllPlantings(req: Request, res: Response) {
	const userId = req.userId;
	const bedId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId)
		return res.status(400).json({ error: "No bed ID provided." });

	try {
		const plantings = await listPlantings(userId, bedId);
		return res.status(200).json({ plantings });
	} catch (err: any) {
		if (err instanceof NotFoundError) {
			return res.status(404).json({ error: err.message });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getPlanting(req: Request, res: Response) {
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}

	try {
		const planting = await getPlantingById(userId, plantingId);
		if (!planting)
			return res.status(404).json({ error: "Planting not found." });
		return res.status(200).json({ planting });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function updatePlantingController(req: Request, res: Response) {
	const data = req.body;
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!data) return res.status(400).json({ error: "No alterations provided." });
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId)
		return res.status(400).json({ error: "No planting ID provided." });

	try {
		const planting = await updatePlanting(userId, plantingId, data);
		return res.status(200).json({ planting });
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025")
				return res.status(404).json({ error: "Planting not found." });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function deletePlantingController(req: Request, res: Response) {
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}

	try {
		await deletePlanting(userId, plantingId);
		return res.status(204).send();
	} catch (err: any) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025")
				return res.status(404).json({ error: "Planting not found." });
		}
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
