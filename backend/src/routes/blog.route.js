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

/* ================= PROTECTED READ ROUTES ================= */
router.get("/my", verifyJwt, getMyBlogs);        // ✅ Must come first
router.get("/liked", verifyJwt, getLikedBlogs);  // ✅ Must come first

/* ================= STATS / FEEDBACK ================= */
router.get("/:id/stats", getBlogStats);
router.get("/:id/feedback", getBlogFeedback);

/* ================= CATCH-ALL ID ROUTE (LAST) ================= */
router.get("/:id", getBlogById);                 // ✅ Must be last

/* ================= MUTATIONS ================= */
router.post("/", verifyJwt, upload.single("image"), createBlog);

router.put(
  "/:id",
  verifyJwt,
  upload.single("image"),
  updateBlog
);

router.delete("/:id", verifyJwt, deleteBlog);

export default router;