import express from "express";
import requireAuth from "./modules/auth/auth.middleware.js";
import { router as authRoutes } from "./modules/auth/auth.routes.js";
import { router as bedsRoutes } from "./modules/beds/beds.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/beds", requireAuth, bedsRoutes);

export { app };
