import { Router } from "express";
import {
	createPlantingController,
	deletePlantingController,
	getAllPlantings,
	getPlanting,
	updatePlantingController,
} from "./plantings.controller.js";

const bedPlantingsRouter = Router();
const plantingRouter = Router();

bedPlantingsRouter.get("/:id/plantings", getAllPlantings);
bedPlantingsRouter.post("/:id/plantings", createPlantingController);

plantingRouter.get("/:id", getPlanting);
plantingRouter.patch("/:id", updatePlantingController);
plantingRouter.delete("/:id", deletePlantingController);

export { bedPlantingsRouter, plantingRouter };
