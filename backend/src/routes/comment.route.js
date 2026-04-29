import { Router } from "express";
import { addComment, deleteComment, getCommentsForBlog,updateComment,getCommentById} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJwt);
router.route("/:id/comments")
.post(addComment)
.get(getCommentsForBlog);

router.route("/comments/:commentId")
.get(getCommentById)
.put(updateComment)
.delete(deleteComment);
export default router;