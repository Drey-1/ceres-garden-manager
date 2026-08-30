type PendingCareType = "WATER" | "FERTILIZE" | "HARVEST";

type TodayOverviewType = {
	pendingActions: PendingCareType[];
	bed: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		name: string;
		location: string | null;
		userId: string;
	};
	careLogs: {
		id: string;
		createdAt: Date;
		type: PendingCareType;
		quantity: number | null;
		plantingId: string;
	}[];
	id: string;
	species: string;
	plantedAt: Date;
	wateringFrequencyDays: number;
	fertilizingFrequencyDays: number;
	estimatedDaysToHarvest: number;
	status: "ACTIVE" | "FINISHED";
	bedId: string;
	createdAt: Date;
	updatedAt: Date;
}[];

export type { PendingCareType, TodayOverviewType };
