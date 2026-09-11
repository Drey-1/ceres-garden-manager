import { Router } from "express";
import {
	createCareLogController,
	getCareLogsSummaryController,
	listCareLogsController,
} from "./care-logs.controller.js";

const router = Router();

router.post("/:id/care-logs", createCareLogController);

router.get("/:id/care-logs", listCareLogsController);

router.get("/:id/care-logs/summary", getCareLogsSummaryController)

export { router };
