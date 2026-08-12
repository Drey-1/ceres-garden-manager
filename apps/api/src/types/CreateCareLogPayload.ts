type CreateCareLogPayload = {
	type: "WATER" | "FERTILIZE" | "HARVEST";
	quantity: number | undefined;
};

export type { CreateCareLogPayload };
