import type { CreatePlantingPayload } from "./CreatePlantingPayload.js";

type UpdatePlantingPayload = CreatePlantingPayload & {
	status: "ACTIVE" | "FINISHED";
};

export type { UpdatePlantingPayload };
