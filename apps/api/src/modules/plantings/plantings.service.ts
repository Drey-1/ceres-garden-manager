import { NotFoundError } from "../../errors.js";
import { prisma } from "../../prisma.js";
import type { CreatePlantingPayload } from "../../types/CreatePlantingPayload.js";
import type { UpdatePlantingPayload } from "../../types/UpdatePlantingPayload.js";
import { getBedById } from "../beds/beds.service.js";

async function confirmHolderBed(userId: string, bedId: string) {
	const bedHolder = await getBedById(userId, bedId);
	if (!bedHolder) throw new NotFoundError("Bed not found.");
}

export async function createPlanting(
	userId: string,
	bedId: string,
	data: CreatePlantingPayload,
) {
	await confirmHolderBed(userId, bedId);
	return await prisma.planting.create({
		data: {
			bedId,
			...data,
		},
	});
}

export async function listPlantings(userId: string, bedId: string) {
	await confirmHolderBed(userId, bedId);
	return await prisma.planting.findMany({ where: { bedId } });
}

export async function getPlantingById(userId: string, plantingId: string) {
	return await prisma.planting.findUnique({
		where: { id: plantingId, bed: { userId } },
	});
}

export async function updatePlanting(
	userId: string,
	plantingId: string,
	data: UpdatePlantingPayload,
) {
	return await prisma.planting.update({
		where: { id: plantingId, bed: { userId } },
		data,
	});
}

export async function deletePlanting(userId: string, plantingId: string) {
	return await prisma.planting.delete({
		where: { id: plantingId, bed: { userId } },
	});
}
