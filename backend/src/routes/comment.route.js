import { Router } from "express";
import {
  addComment,
  deleteComment,
  getCommentsForBlog,
  updateComment,
  getCommentById
} from "../controllers/comment.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

/* PUBLIC READ */
router.get("/blog/:id", getCommentsForBlog);
router.get("/:commentId", getCommentById);

/* PROTECTED ACTIONS */
router.post("/blog/:id", verifyJwt, addComment);
router.put("/:commentId", verifyJwt, updateComment);
router.delete("/:commentId", verifyJwt, deleteComment);

export default router;