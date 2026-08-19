import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import requireAuth from "./modules/auth/auth.middleware.js";
import { router as authRoutes } from "./modules/auth/auth.routes.js";
import { router as bedsRoutes } from "./modules/beds/beds.routes.js";
import { router as careLogsRouter } from "./modules/care-logs/care-logs.routes.js";
import {
	bedPlantingsRouter,
	plantingRouter,
} from "./modules/plantings/plantings.routes.js";
import { router as todayRouter } from "./modules/today/today.routes.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);

app.use("/auth", authRoutes);

app.use("/beds", requireAuth, bedsRoutes);

app.use("/beds", requireAuth, bedPlantingsRouter);

app.use("/plantings", requireAuth, plantingRouter);

app.use("/plantings", requireAuth, careLogsRouter);

app.use("/today", requireAuth, todayRouter);

export { app };
