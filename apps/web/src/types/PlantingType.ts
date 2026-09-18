type PlantingType = {
	id: string;
	species: string;
	plantedAt: string;
	wateringFrequencyDays: number;
	fertilizingFrequencyDays: number;
	estimatedDaysToHarvest: number;
	status: "ACTIVE" | "FINISHED";
	bedId: string;
	createdAt: string;
	updatedAt: string;
};

export type { PlantingType };
