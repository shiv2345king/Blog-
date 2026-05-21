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
} from "../controllers/blog.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* =========================
   PUBLIC ROUTES (NO LOGIN)
========================= */

// Get all blogs (PUBLIC)
router.route("/").get(getAllBlogs);

// Get single blog (PUBLIC)
router.route("/:id").get(getBlogById);

// Blog stats (optional public)
router.route("/:id/stats").get(getBlogStats);

// Feedback (optional public)
router.route("/:id/feedback").get(getBlogFeedback);

/* =========================
   PROTECTED ROUTES (LOGIN REQUIRED)
========================= */

// Apply auth ONLY BELOW THIS LINE
router.use(verifyJwt);

// Create blog
router.route("/").post(
  upload.fields([{ name: "image", maxCount: 1 }]),
  createBlog
);

// Liked blogs
router.route("/liked").get(getLikedBlogs);

// Update + Delete blog
router
  .route("/:id")
  .put(upload.single("image"), updateBlog)
  .delete(deleteBlog);

export default router;