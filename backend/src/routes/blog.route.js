import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  getBlogStats,
  getLikedBlogs,
  getBlogFeedback,
  getMyBlogs,
} from "../controllers/blog.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* ================= PUBLIC ROUTES ================= */
router.get("/", getAllBlogs);
router.get("/:id/stats", getBlogStats);
router.get("/:id/feedback", getBlogFeedback);
router.get("/:id", getBlogById);

/* ================= PROTECTED ROUTES ================= */
router.use(verifyJwt);

/* CREATE BLOG */
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createBlog
);

/* MY BLOGS */
router.get("/my", getMyBlogs);

/* LIKED BLOGS */
router.get("/liked", getLikedBlogs);

/* UPDATE BLOG */
router.put(
  "/:id",
  upload.single("image"),
  updateBlog
);

/* DELETE BLOG */
router.delete("/:id", deleteBlog);

export default router;