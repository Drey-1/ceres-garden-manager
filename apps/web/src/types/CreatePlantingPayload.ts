type CreatePlantingPayload = {
	species: string;
	plantedAt: string;
	wateringFrequencyDays: number;
	fertilizingFrequencyDays: number;
	estimatedDaysToHarvest: number;
};

export type { CreatePlantingPayload };
