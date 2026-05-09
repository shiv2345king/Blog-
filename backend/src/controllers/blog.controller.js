import Blog from "../models/blog.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comments.model.js";
import { Rating } from "../models/rating.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// 🔹 SLUG GENERATOR
const generateSlug = (value) => {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};


// ✅ CREATE BLOG (with image)
export const createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiErrors(400, "Title and Content are required");
    }

    // 🔥 IMAGE REQUIRED
    const imageLocalPath = req.files?.image?.[0]?.path;

    if (!imageLocalPath) {
        throw new ApiErrors(400, "Image is required");
    }

    const imageUpload = await uploadOnCloudinary(imageLocalPath);

    if (!imageUpload) {
        throw new ApiErrors(500, "Image upload failed");
    }

    // 🔹 SLUG LOGIC
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await Blog.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
    }

    const blog = await Blog.create({
        title,
        slug,
        content,
        image: imageUpload.secure_url,
        owner: req.user._id
    });

    res.status(201).json({
        success: true,
        data: blog
    });
});


// ✅ GET ALL BLOGS
export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate("owner", "username email");

    res.status(200).json({
        success: true,
        data: blogs
    });
});


// ✅ GET BLOG BY SLUG
export const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    res.status(200).json({
        success: true,
        data: blog
    });
});


// ✅ UPDATE BLOG (with optional image update)
export const updateBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "Forbidden: You are not the owner");
    }

    // 🔹 Update title + slug
    if (title && title !== blog.title) {
        let baseSlug = generateSlug(title);
        let newSlug = baseSlug;
        let counter = 1;

        while (await Blog.findOne({ slug: newSlug })) {
            newSlug = `${baseSlug}-${counter++}`;
        }

        blog.title = title;
        blog.slug = newSlug;
    }

    blog.content = content || blog.content;

    // 🔥 OPTIONAL IMAGE UPDATE
    if (req.file) {
        const imageUpload = await uploadOnCloudinary(req.file.path);

        if (!imageUpload) {
            throw new ApiErrors(500, "Image upload failed");
        }

        blog.image = imageUpload.secure_url;
    }

    await blog.save();

    res.status(200).json({
        success: true,
        data: blog
    });
});


// ✅ DELETE BLOG
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "Forbidden: You are not the owner");
    }

    await blog.deleteOne();

    res.status(200).json({
        success: true,
        message: "Blog deleted successfully"
    });
});


// ✅ BLOG STATS
export const getBlogStats = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const blogId = blog._id;

    const likes = await Like.countDocuments({ blog: blogId });
    const comments = await Comment.countDocuments({ blog: blogId });
    const ratings = await Rating.find({ blog: blogId });

    const averageRating =
        ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
            : 0;

    res.status(200).json({
        success: true,
        data: {
            likes,
            comments,
            averageRating
        }
    });
});


// ✅ GET LIKED BLOGS
export const getLikedBlogs = asyncHandler(async (req, res) => {
    const likedBlogs = await Like.find({ user: req.user._id }).populate("blog");

    res.status(200).json({
        success: true,
        data: likedBlogs.map(like => like.blog)
    });
});


// ✅ BLOG FEEDBACK
export const getBlogFeedback = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
        throw new ApiErrors(404, "Blog Not Found");
    }

    const blogId = blog._id;

    const comments = await Comment.find({ blog: blogId })
        .populate("user", "username");

    const ratings = await Rating.find({ blog: blogId })
        .populate("user", "username");

    res.status(200).json({
        success: true,
        data: {
            comments,
            ratings
        }
    });
});