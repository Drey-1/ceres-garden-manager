import { Router } from "express";
import {
	createCareLogController,
	listCareLogsController,
} from "./care-logs.controller.js";

const router = Router();

router.post("/:id/care-logs", createCareLogController);

router.get("/:id/care-logs", listCareLogsController);

export { router };
