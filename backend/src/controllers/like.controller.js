import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Blog from "../models/blog.model.js";
import Like from "../models/likes.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";

export const likeBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const existingLike = await Like.findOne({ blog: blog._id, user: req.user._id });
    if(existingLike) {
        throw new ApiErrors(400,"You have already liked this blog")
    }
    const like = await Like.create({
        blog: blog._id,
        user: req.user._id,
        likedBy: req.user.username
    });
    res.status(201).json({
        success: true,
        data: like
    });
});

export const unlikeBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const existingLike = await Like.findOne({ blog: blog._id, user: req.user._id });
    if(!existingLike) {
        throw new ApiErrors(400,"You have not liked this blog")
    }
    await existingLike.remove();
    res.status(200).json({
        success: true,
        message: "Blog unliked successfully"
    });
});

export const getLikesForBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const likes = await Like.find({ blog: blog._id }).populate("user", "username email");
    res.status(200).json({
        success: true,
        data: likes
    });
});

export const getLikedBlogsForUser = asyncHandler(async (req, res) => {
    const likes = await Like.find({ user: req.user._id }).populate("blog", "title content");
    res.status(200).json({
        success: true,
        data: likes
    });
});

export const getLikeCountForBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const likeCount = await Like.countDocuments({ blog: blog._id });
    res.status(200).json({
        success: true,
        data: { likeCount }
    });
});

export const likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    const existingLike = await Like.findOne({ comment: comment._id, user: req.user._id });
    if(existingLike) {
        throw new ApiErrors(400,"You have already liked this comment")
    }
    const like = await Like.create({
        comment: comment._id,
        user: req.user._id,
        likedBy: req.user.username
    });
    res.status(201).json({
        success: true,
        data: like
    });
});

export const unlikeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    const existingLike = await Like.findOne({ comment: comment._id, user: req.user._id });
    if(!existingLike) {
        throw new ApiErrors(400,"You have not liked this comment")
    }
    await existingLike.remove();
    res.status(200).json({
        success: true,
        message: "Comment unliked successfully"
    });
});


export const getLikeCountForComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if(!comment) {
        throw new ApiErrors(404,"Comment Not Found")
    }
    const likeCount = await Like.countDocuments({ comment: comment._id });
    res.status(200).json({
        success: true,
        data: { likeCount }
    });
});

export const getLikedCommentsForUser = asyncHandler(async (req, res) => {
    const likes = await Like.find({ user: req.user._id, comment: { $exists: true } }).populate("comment", "content");
    res.status(200).json({
        success: true,
        data: likes
    });
});

