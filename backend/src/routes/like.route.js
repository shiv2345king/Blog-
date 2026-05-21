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

/* =========================
   PUBLIC ROUTES
========================= */

// BLOG COUNTS (PUBLIC)
router.get("/blog/:id/count", getLikeCountForBlog);

// COMMENT COUNTS (PUBLIC)
router.get("/comment/:id/count", getLikeCountForComment);


/* =========================
   PROTECTED ROUTES
========================= */

router.use(verifyJwt);

/* BLOG LIKES */
router.post("/blog/:id", likeBlog);
router.delete("/blog/:id", unlikeBlog);

router.get("/blog/:id/likes", getLikesForBlog);
router.get("/blog/liked", getLikedBlogsForUser);

/* COMMENT LIKES */
router.post("/comment/:id", likeComment);
router.delete("/comment/:id", unlikeComment);

router.get("/comment/liked", getLikedCommentsForUser);

export default router;