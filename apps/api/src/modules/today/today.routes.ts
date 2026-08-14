import { Router } from "express";
import { getTodayController } from "./today.controller.js";

const router = Router();

router.get("/", getTodayController);

export { router };
