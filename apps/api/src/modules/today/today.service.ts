import { prisma } from "../../prisma.js";
import type { PendingCareType } from "../../types/PendingCareType.js";
import { toDateOnly } from "../../utils/toDateOnly.js";

export function calculateNextCareDate(lastCareDate: Date, frequencyDays: number) {
	const lastCareDateMs = lastCareDate.getTime();
	const frequencyDaysMs = frequencyDays * 24 * 60 * 60 * 1000;
	const nextCareDate = new Date(lastCareDateMs + frequencyDaysMs);

	return nextCareDate;
}

export function getLastCareDate(
	planting: {
		plantedAt: Date;
		careLogs: { type: string; createdAt: Date }[];
	},
	careType: "WATER" | "FERTILIZE",
): Date {
	const searchedCareLogs = planting.careLogs.filter(
		(log) => log.type === careType,
	);
	if (searchedCareLogs.length === 0) return planting.plantedAt;
	const latestCareLog = searchedCareLogs.reduce((max, item) => {
		return item.createdAt > max.createdAt ? item : max;
	});
	return latestCareLog.createdAt;
}

export function isCarePending(
	planting: {
		plantedAt: Date;
		careLogs: { type: string; createdAt: Date }[];
	},
	careType: "WATER" | "FERTILIZE",
	frequencyDays: number,
): boolean {
	const lastCareDate = getLastCareDate(planting, careType);
	const nextCareDate = calculateNextCareDate(lastCareDate, frequencyDays);
	const nowDate = new Date();
	return toDateOnly(nextCareDate) <= toDateOnly(nowDate);
}

export function isHarvestReady(planting: {
	plantedAt: Date;
	estimatedDaysToHarvest: number;
}) {
	const estimatedDateToHarvest = calculateNextCareDate(
		planting.plantedAt,
		planting.estimatedDaysToHarvest,
	);

	const nowDate = new Date();
	return toDateOnly(estimatedDateToHarvest) <= toDateOnly(nowDate);
}

export function getPendingActions(planting: {
	plantedAt: Date;
	estimatedDaysToHarvest: number;
	wateringFrequencyDays: number;
	fertilizingFrequencyDays: number;
	careLogs: { type: string; createdAt: Date }[];
}): PendingCareType[] {
	const pendingActions: PendingCareType[] = [];
	if (isCarePending(planting, "WATER", planting.wateringFrequencyDays)) {
		pendingActions.push("WATER");
	}
	if (isCarePending(planting, "FERTILIZE", planting.fertilizingFrequencyDays)) {
		pendingActions.push("FERTILIZE");
	}
	if (isHarvestReady(planting)) pendingActions.push("HARVEST");
	return pendingActions;
}

export async function getTodayOverview(userId: string) {
	const activedPlantings = await prisma.planting.findMany({
		where: { status: "ACTIVE", bed: { userId } },
		include: { careLogs: true, bed: true },
	});
	const plantingsWithActions = activedPlantings
		.map((planting) => {
			return {
				...planting,
				pendingActions: getPendingActions(planting),
			};
		})
		.filter((planting) => planting.pendingActions.length > 0);
	return plantingsWithActions;
}
