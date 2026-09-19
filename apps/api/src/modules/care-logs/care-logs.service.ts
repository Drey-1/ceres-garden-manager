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
			quantity: data.quantity ?? 1,
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

export async function getCareLogsSummary(userId: string, plantingId: string) {
	await confirmHolderPlanting(userId, plantingId);
	const summary = await prisma.careLog.groupBy({
		by: ["type"],
		where: { plantingId },
		_sum: { quantity: true },
	});
	const completeSummary = ["WATER", "FERTILIZE", "HARVEST"].map((type) => {
		const already = summary.find((sumOfType) => sumOfType.type === type);
		if (!already) {
			return { type, _sum: { quantity: 0 } };
		}

		return already;
	});
	return completeSummary.reduce<Record<string, { quantity: number | null }>>(
		(object, item) => {
			object[item.type.toLowerCase()] = { quantity: item._sum.quantity };
			return object;
		},
		{},
	);
}
