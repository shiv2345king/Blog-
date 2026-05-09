import { Router } from "express";
import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    getBlogStats,
    getLikedBlogs,
    getBlogFeedback
} from "../controllers/blog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJwt);

// Create + Get all
router.route("/")
    .post(upload.fields([{ name: "image", maxCount: 1 }]), createBlog)
    .get(getAllBlogs);

// SLUG-based routes
router.route("/:slug")
    .get(getBlogBySlug)
    .put(upload.single("image"), updateBlog)
    .delete(deleteBlog);

// Stats & feedback
router.route("/:slug/stats").get(getBlogStats);
router.route("/:slug/feedback").get(getBlogFeedback);

// liked blogs (no slug)
router.route("/liked").get(getLikedBlogs);

export default router;