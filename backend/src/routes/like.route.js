import { Router } from "express";
import {
  likeBlog,
  unlikeBlog,
  getLikesForBlog,
  getLikedBlogsForUser,
  getLikeCountForBlog,
  likeComment,
  unlikeComment,
  getLikeCountForComment,
  getLikedCommentsForUser
} from "../controllers/like.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

/* ALL PROTECTED */
router.use(verifyJwt);

/* BLOG LIKES */
router.post("/blog/:id", likeBlog);
router.delete("/blog/:id", unlikeBlog);

router.get("/blog/:id/likes", getLikesForBlog);
router.get("/blog/liked", getLikedBlogsForUser);
router.get("/blog/:id/count", getLikeCountForBlog);

/* COMMENT LIKES */
router.post("/comment/:id", likeComment);
router.delete("/comment/:id", unlikeComment);

router.get("/comment/:id/likes", getLikedCommentsForUser);
router.get("/comment/:id/count", getLikeCountForComment);

export default router;