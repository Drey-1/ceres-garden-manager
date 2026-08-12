import { NotFoundError } from "../../errors.js";
import { prisma } from "../../prisma.js";
import type { CreateCareLogPayload } from "../../types/CreateCareLogPayload.js";
import { getPlantingById } from "../plantings/plantings.service.js";

async function confirmHolderPlanting(userId: string, plantingId: string) {
	const plantingHolder = await getPlantingById(userId, plantingId);
	if (!plantingHolder) throw new NotFoundError("Planting not found.");
}

export async function createCareLog(
	userId: string,
	plantingId: string,
	data: CreateCareLogPayload,
) {
	await confirmHolderPlanting(userId, plantingId);
	return await prisma.careLog.create({
		data: {
			type: data.type,
			quantity: data.quantity ?? null,
			plantingId,
		},
	});
}

export async function listCareLogs(
	userId: string,
	plantingId: string,
	paginationParams: { page: number; pageSize: number },
) {
	await confirmHolderPlanting(userId, plantingId);
	const careLogs = await prisma.careLog.findMany({
		where: { plantingId },
		take: paginationParams.pageSize,
		skip: (paginationParams.page - 1) * paginationParams.pageSize,
		orderBy: { createdAt: "desc" },
	});
	const totalOfLogs = await prisma.careLog.count({ where: { plantingId } });
	return { careLogs, totalOfLogs };
}
