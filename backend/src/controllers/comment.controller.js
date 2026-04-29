import User from '../models/user.model.js';
import Comment from '../models/comments.model.js';
import { ApiErrors } from '../utils/ApiErrors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Blog from '../models/blog.model.js';
import Like from '../models/likes.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';


export const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if(!content) {
        throw new ApiErrors(400,"Content is required")
    }
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const comment = await Comment.create({
        content,
        user: req.user._id,
        blog: blog._id
    });
    res.status(201).json(new ApiResponse(true, "Comment created successfully", comment));
});

export const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    if(comment.user.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403,"Forbidden: You are not the owner of this comment")
    }
    comment.content = content || comment.content;
    await comment.save();
    res.status(200).json(new ApiResponse(true, "Comment updated successfully", comment));
});

export const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    await comment.remove();
    res.status(200).json(new ApiResponse(true, "Comment deleted successfully", comment));
});


export const getCommentsForBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const comments = await Comment.find({ blog: blog._id }).populate("user", "username email");
    res.status(200).json(new ApiResponse(true, "Comments retrieved successfully", comments));
});

export const getCommentById = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId).populate("user", "username email");
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    res.status(200).json(new ApiResponse(true, "Comment retrieved successfully", comment));
});