type CreatePlantingPayload = {
	species: string;
	plantedAt: Date;
	wateringFrequencyDays: number;
	fertilizingFrequencyDays: number;
	estimatedDaysToHarvest: number;
};

export type { CreatePlantingPayload };
