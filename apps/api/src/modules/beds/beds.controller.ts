import type { Request, Response } from "express";
import {
	createBed,
	deleteBed,
	getBedById,
	listBeds,
	updateBed,
} from "./beds.service.js";

export async function createBedController(req: Request, res: Response) {
	const { name, location } = req.body;
	const userId = req.userId;
	if (!name) return res.status(400).json({ error: "No name provided." });
	if (!userId) return res.status(400).json({ error: "No user ID provided." });

	const bed = await createBed(userId, { name, location });
	return res.status(201).json({ bed });
}

export async function getAllBeds(req: Request, res: Response) {
	const userId = req.userId;
	if (!userId) return res.status(400).json({ error: "No user ID provided." });

	const beds = await listBeds(userId);
	return res.status(200).json({ beds });
}

export async function getBed(req: Request, res: Response) {
	const bedId = String(req.params.id);
	const userId = req.userId;
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId) return res.status(400).json({ error: "No bed ID provided." });

	const bed = await getBedById(userId, bedId);
	if (!bed) return res.status(404).json({ error: "Bed not found." });
	return res.status(200).json({ bed });
}

export async function updateBedController(req: Request, res: Response) {
	const { name, location } = req.body;
	const bedId = String(req.params.id);
	const userId = req.userId;
	if (!name && !location) {
		return res.status(400).json({ error: "No alterations provided." });
	}
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId) return res.status(400).json({ error: "No bed ID provided." });

	const bed = await updateBed(userId, bedId, { name, location });
	return res.status(200).json({ bed });
}

export async function deleteBedController(req: Request, res: Response) {
	const bedId = String(req.params.id);
	const userId = req.userId;
	if (!userId) return res.status(400).json({ error: "No user ID provided." });
	if (!bedId) return res.status(400).json({ error: "No bed ID provided." });

	await deleteBed(userId, bedId);
	return res.status(204).send();
}
