import { Router } from "express";
import { login, logout, refresh, register } from "./auth.controller.js";
import requireAuth from "./auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", requireAuth, logout);

export { router };
