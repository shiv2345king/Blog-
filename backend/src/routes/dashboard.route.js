import { verifyJwt } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = Router();

// Dashboard route - protected
router.get("/", verifyJwt, getDashboardData);

export default router;