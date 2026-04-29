import { Router } from 'express';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog,getBlogStats,  getLikedBlogs, getBlogFeedback } from '../controllers/blog.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {upload} from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJwt);

router.
route("/")
.post(upload.fields([
    {name: "image", maxCount: 1}
]), createBlog)
.get(getAllBlogs);

router.
route("/:id")
.get(getBlogById)
.put(upload.single("image"), updateBlog)
.delete(deleteBlog);

router.route("/:id/stats").get(getBlogStats);
router.route("/liked").get(getLikedBlogs);
router.route("/:id/feedback").get(getBlogFeedback);

export default router;

