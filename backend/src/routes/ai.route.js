import express from "express";
import { reviewBlog } from "../controllers/ai.controller.js";

const router = express.Router();

// Grammar check route
router.post("/review", reviewBlog);

export default router;