import Blog from "../models/blog.model.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comments.model.js";
import { Rating } from "../models/rating.model.js";

import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/* =========================
   CREATE BLOG
========================= */
export const createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiErrors(400, "Title and Content are required");
    }

    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
        throw new ApiErrors(400, "Image is required");
    }

    const imageUpload = await uploadOnCloudinary(imageLocalPath);

    if (!imageUpload) {
        throw new ApiErrors(500, "Image upload failed");
    }

    const blog = await Blog.create({
        title,
        content,
        image: imageUpload.secure_url,
        owner: req.user._id,
    });

    return res.status(201).json({
        success: true,
        data: blog,
    });
});


/* =========================
   GET ALL BLOGS
========================= */
export const getAllBlogs = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const blogs = await Blog.find()
        .populate("owner", "username email");

    // Get all likes for all blogs
    const allLikes = await Like.find({});

    // Build like count map
    const likeCountMap = {};
    const likedByUserSet = new Set();

    allLikes.forEach(like => {
        const blogId = like.blog.toString();

        // count
        likeCountMap[blogId] = (likeCountMap[blogId] || 0) + 1;

        // user-specific
        if (userId && like.user.toString() === userId.toString()) {
            likedByUserSet.add(blogId);
        }
    });

    const enrichedBlogs = blogs.map(blog => ({
        ...blog.toObject(),
        likeCount: likeCountMap[blog._id.toString()] || 0,
        isLikedByMe: likedByUserSet.has(blog._id.toString()),
    }));

    return res.status(200).json({
        success: true,
        data: enrichedBlogs,
    });
});

/* =========================
   GET BLOG BY ID
========================= */
export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate("owner", "username email");

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    return res.status(200).json({
        success: true,
        data: blog,
    });
});

export const getMyBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ owner: req.user._id })
        .populate("owner", "username email");

    return res.status(200).json({
        success: true,
        data: blogs,
    });
});
/* =========================
   UPDATE BLOG
========================= */
export const updateBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "Forbidden: Not owner");
    }

    if (title) blog.title = title;
    if (content) blog.content = content;

    if (req.file) {
        const imageUpload = await uploadOnCloudinary(req.file.path);
        if (!imageUpload) {
            throw new ApiErrors(500, "Image upload failed");
        }
        blog.image = imageUpload.secure_url;
    }

    await blog.save();

    return res.status(200).json({
        success: true,
        data: blog,
    });
});


/* =========================
   DELETE BLOG
========================= */
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "Forbidden: Not owner");
    }

    await blog.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
    });
});


/* =========================
   BLOG STATS
========================= */
export const getBlogStats = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const likes = await Like.countDocuments({ blog: blog._id });
    const comments = await Comment.countDocuments({ blog: blog._id });

    const ratings = await Rating.find({ blog: blog._id });

    const averageRating =
        ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
            : 0;

    return res.status(200).json({
        success: true,
        data: {
            likes,
            comments,
            averageRating,
        },
    });
});


/* =========================
   GET LIKED BLOGS
========================= */
export const getLikedBlogs = asyncHandler(async (req, res) => {
    const likedBlogs = await Like.find({ user: req.user._id })
        .populate("blog");

    return res.status(200).json({
        success: true,
        data: likedBlogs.map((l) => l.blog),
    });
});


/* =========================
   BLOG FEEDBACK
========================= */
export const getBlogFeedback = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const comments = await Comment.find({ blog: blog._id })
        .populate("user", "username");

    const ratings = await Rating.find({ blog: blog._id })
        .populate("user", "username");

    return res.status(200).json({
        success: true,
        data: {
            comments,
            ratings,
        },
    });
});