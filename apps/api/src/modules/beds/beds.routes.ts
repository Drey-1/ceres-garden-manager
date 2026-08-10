import { Router } from "express";
import {
	createBedController,
	deleteBedController,
	getAllBeds,
	getBed,
	updateBedController,
} from "./beds.controller.js";

const router = Router();

router.get("/", getAllBeds);

router.post("/", createBedController);

router.get("/:id", getBed);

router.patch("/:id", updateBedController);

router.delete("/:id", deleteBedController);

export { router };
