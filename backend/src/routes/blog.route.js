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

/* ================= PUBLIC ROUTES ================= */

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/:id/stats", getBlogStats);
router.get("/:id/feedback", getBlogFeedback);

/* ================= PROTECTED ROUTES ================= */

router.use(verifyJwt);

router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  createBlog
);

router.get("/liked", getLikedBlogs);

router.put(
  "/:id",
  upload.single("image"),
  updateBlog
);

router.delete("/:id", deleteBlog);

export default router;