import type { Request, Response } from "express";
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
	if (!bedId) return res.status(400).json({ error: "No bed ID provided." });

	const planting = await createPlanting(userId, bedId, data);
	return res.status(201).json({ planting });
}

export async function getAllPlantings(req: Request, res: Response) {
	const userId = req.userId;
	const bedId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId) return res.status(400).json({ error: "No bed ID provided." });

	const plantings = await listPlantings(userId, bedId);
	return res.status(200).json({ plantings });
}

export async function getPlanting(req: Request, res: Response) {
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}

	const planting = await getPlantingById(userId, plantingId);
	if (!planting) return res.status(404).json({ error: "Planting not found." });
	return res.status(200).json({ planting });
}

export async function updatePlantingController(req: Request, res: Response) {
	const data = req.body;
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!data) return res.status(400).json({ error: "No alterations provided." });
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId)
		return res.status(400).json({ error: "No planting ID provided." });

	const planting = await updatePlanting(userId, plantingId, data);
	return res.status(200).json({ planting });
}

export async function deletePlantingController(req: Request, res: Response) {
	const userId = req.userId;
	const plantingId = String(req.params.id);

	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!plantingId) {
		return res.status(400).json({ error: "No planting ID provided." });
	}

	await deletePlanting(userId, plantingId);
	return res.status(204).send();
}
