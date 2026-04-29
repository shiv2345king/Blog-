import {Router} from 'express';
import {likeBlog,
    unlikeBlog,
    getLikesForBlog,
    getLikedBlogsForUser,
    getLikeCountForBlog,
    likeComment,
    unlikeComment,
    getLikeCountForComment,
    getLikedCommentsForUser} from '../controllers/like.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJwt);

router.route("/blog/:id/like")
.post(likeBlog)
.delete(unlikeBlog);

router.route("/blog/:id/likes")
.get(getLikesForBlog);

router.route("/blog/liked").get(getLikedBlogsForUser);

router.route("/blog/:id/like-count").get(getLikeCountForBlog);

router.route("/comment/:id/like")
.post(likeComment)
.delete(unlikeComment);

router.route("/comment/:id/likes")
.get(getLikedCommentsForUser);

router.route("/comment/:id/like-count").get(getLikeCountForComment);
export default router;