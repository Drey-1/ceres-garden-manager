import express, { type Request, type Response } from "express";
import requireAuth from "./modules/auth/auth.middleware.js";
import { router as authRoutes } from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/protected", requireAuth, (req: Request, res: Response) => {
	res.status(200).json({ userId: req.userId });
});

export { app };
