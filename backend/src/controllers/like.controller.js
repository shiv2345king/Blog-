import mongoose from "mongoose";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Blog from "../models/blog.model.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comments.model.js";

export const likeBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiErrors(400, "Invalid blog id");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const existingLike = await Like.findOne({
        blog: blog._id,
        user: req.user._id,
    });

    if (existingLike) {
        return res.status(200).json({
            success: true,
            message: "Blog already liked",
            liked: true,
        });
    }

    const like = await Like.create({
        blog: blog._id,
        user: req.user._id,
        likedBy: req.user.username,
    });

    return res.status(201).json({
        success: true,
        liked: true,
        data: like,
    });
});

export const unlikeBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiErrors(400, "Invalid blog id");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const existingLike = await Like.findOne({
        blog: blog._id,
        user: req.user._id,
    });

    if (!existingLike) {
        return res.status(200).json({
            success: true,
            message: "Blog already unliked",
            liked: false,
        });
    }

    await existingLike.deleteOne();

    return res.status(200).json({
        success: true,
        liked: false,
        message: "Blog unliked successfully",
    });
});

export const getLikesForBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiErrors(400, "Invalid blog id");
    }

    const likes = await Like.find({ 
        blog: new mongoose.Types.ObjectId(id) 
    }).populate("user", "username email");

    return res.status(200).json({
        success: true,
        data: likes,
    });
});

export const getLikedBlogsForUser = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        user: req.user._id,
        blog: { $exists: true, $ne: null },
    }).populate("blog", "_id");

    return res.status(200).json({
        success: true,
        data: likes,
    });
});

export const getLikeCountForBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiErrors(400, "Invalid blog id");
    }

    const likeCount = await Like.countDocuments({
        blog: new mongoose.Types.ObjectId(id),
    });

    return res.status(200).json({
        success: true,
        data: { likeCount },
    });
});

export const likeComment = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ApiErrors(400, "Invalid comment id");
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        throw new ApiErrors(404, "Comment Not Found");
    }

    const existingLike = await Like.findOne({
        comment: comment._id,
        user: req.user._id,
    });

    if (existingLike) {
        return res.status(200).json({
            success: true,
            liked: true,
            message: "Comment already liked",
        });
    }

    const like = await Like.create({
        comment: comment._id,
        user: req.user._id,
        likedBy: req.user.username,
    });

    return res.status(201).json({
        success: true,
        liked: true,
        data: like,
    });
});

export const unlikeComment = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ApiErrors(400, "Invalid comment id");
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        throw new ApiErrors(404, "Comment Not Found");
    }

    const existingLike = await Like.findOne({
        comment: comment._id,
        user: req.user._id,
    });

    if (!existingLike) {
        return res.status(200).json({
            success: true,
            liked: false,
            message: "Comment already unliked",
        });
    }

    await existingLike.deleteOne();

    return res.status(200).json({
        success: true,
        liked: false,
        message: "Comment unliked successfully",
    });
});

export const getLikeCountForComment = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ApiErrors(400, "Invalid comment id");
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        throw new ApiErrors(404, "Comment Not Found");
    }

    const likeCount = await Like.countDocuments({
        comment: new mongoose.Types.ObjectId(comment._id),
    });

    return res.status(200).json({
        success: true,
        data: { likeCount },
    });
});

export const getLikedCommentsForUser = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        user: req.user._id,
        comment: { $exists: true },
    }).populate("comment", "content");

    return res.status(200).json({
        success: true,
        data: likes,
    });
});