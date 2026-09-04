type PlantingType = {
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
};

export type { PlantingType };
