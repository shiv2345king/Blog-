import Comment from "../models/comments.model.js";
import Blog from "../models/blog.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// =========================
// ADD COMMENT
// =========================
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiErrors(400, "Content is required");
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiErrors(404, "Blog not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    user: req.user._id,
    blog: blog._id,
  });

  const populated = await Comment.findById(comment._id).populate(
    "user",
    "username"
  );

  return res.status(201).json(
    new ApiResponse(201, populated, "Comment created successfully")
  );
});


// =========================
// UPDATE COMMENT
// =========================
export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiErrors(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiErrors(403, "Not allowed to edit this comment");
  }

  comment.content = content?.trim() || comment.content;

  await comment.save();

  const updated = await Comment.findById(comment._id).populate(
    "user",
    "username"
  );

  return res.status(200).json(
    new ApiResponse(200, updated, "Comment updated successfully")
  );
});


// =========================
// DELETE COMMENT
// =========================
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    throw new ApiErrors(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiErrors(403, "Not allowed to delete this comment");
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  return res.status(200).json(
    new ApiResponse(200, { _id: req.params.commentId }, "Comment deleted successfully")
  );
});


// =========================
// GET COMMENTS FOR BLOG
// =========================
export const getCommentsForBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiErrors(404, "Blog not found");
  }

  const comments = await Comment.find({ blog: blog._id })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, comments, "Comments fetched successfully")
  );
});


// =========================
// GET SINGLE COMMENT
// =========================
export const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate(
    "user",
    "username"
  );

  if (!comment) {
    throw new ApiErrors(404, "Comment not found");
  }

  return res.status(200).json(
    new ApiResponse(200, comment, "Comment fetched successfully")
  );
});