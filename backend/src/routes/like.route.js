import { Router } from 'express';
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
} from '../controllers/like.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

// Blog like/unlike (same endpoint, different methods)
router.route("/blog/:id")
  .post(likeBlog)
  .delete(unlikeBlog);

// Get likes for a blog
router.route("/blog/:id/likes")
  .get(getLikesForBlog);

// Get liked blogs for current user
router.route("/blog/liked")
  .get(getLikedBlogsForUser);

// Get like count for a blog
router.route("/blog/:id/count")
  .get(getLikeCountForBlog);

// Comment like/unlike
router.route("/comment/:id")
  .post(likeComment)
  .delete(unlikeComment);

// Get liked comments for current user
router.route("/comment/:id/likes")
  .get(getLikedCommentsForUser);

// Get like count for a comment
router.route("/comment/:id/count")
  .get(getLikeCountForComment);

export default router;