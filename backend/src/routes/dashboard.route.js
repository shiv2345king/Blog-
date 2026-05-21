import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJwt, getDashboardData);

export default router;