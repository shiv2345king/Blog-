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
router.get("/:id", getBlogById);
router.get("/:id/stats", getBlogStats);
router.get("/:id/feedback", getBlogFeedback);

/* ================= PROTECTED ROUTES ================= */
router.use(verifyJwt);

/* ================= BLOG CREATION ================= */
/*
  IMPORTANT:
  frontend sends FormData with "image"
  so we use upload.single("image")
*/
router.post(
  "/",
  upload.single("image"),
  createBlog
);

/* ================= MY BLOGS ================= */
router.get("/my", getMyBlogs);

/* ================= LIKED BLOGS ================= */
router.get("/liked", getLikedBlogs);

/* ================= UPDATE BLOG ================= */
router.put(
  "/:id",
  upload.single("image"),
  updateBlog
);

/* ================= DELETE BLOG ================= */
router.delete("/:id", deleteBlog);

export default router;