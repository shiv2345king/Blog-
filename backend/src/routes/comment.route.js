import { Router } from "express";
import { 
  addComment, 
  deleteComment, 
  getCommentsForBlog,
  updateComment,
  getCommentById
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ REMOVE: router.use(verifyJwt);

// Blog comments routes
router.route("/blog/:id")
  .get(getCommentsForBlog)           // ✅ PUBLIC - no auth needed
  .post(verifyJwt, addComment);       // ✅ PROTECTED - auth required

// Individual comment routes  
router.route("/:commentId")
  .get(getCommentById)                // ✅ PUBLIC - no auth needed
  .put(verifyJwt, updateComment)      // ✅ PROTECTED - auth required
  .delete(verifyJwt, deleteComment);  // ✅ PROTECTED - auth required

export default router;