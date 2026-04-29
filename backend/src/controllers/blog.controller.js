import Blog from "../models/blog.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comments.model.js";
import {Rating} from "../models/rating.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBlog = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    if(!title || !content)
    {
        throw new ApiErrors(400,"Title and Content are required")
    }
    const blog = await Blog.create({
        title,
        content,
        owner: req.user._id
    });
    res.status(201).json({
        success: true,
        data: blog
    });

});
 
export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate("owner", "username email");
    res.status(200).json({
        success: true,
        data: blogs
    });
});

export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    res.status(200).json({
        success: true,
        data: blog
    });
});

export const updateBlog = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    if(blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403,"Forbidden: You are not the owner of this blog")
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.status(200).json({
        success: true,
        data: blog
    });
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    if(blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403,"Forbidden: You are not the owner of this blog")
    }
    await blog.remove();
    res.status(200).json({
        success: true,
        message: "Blog deleted successfully"
    });
});

export const getBlogStats = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const likes = await Like.countDocuments({blog: req.params.id});
    const comments = await Comment.countDocuments({blog: req.params.id});
    const ratings = await Rating.find({blog: req.params.id});
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length : 0;

    res.status(200).json({
        success: true,
        data: {
            likes,
            comments,
            averageRating
        }
    });
});

export const getLikedBlogs = asyncHandler(async (req, res) => {
    const likedBlogs = await Like.find({user: req.user._id}).populate("blog");
    res.status(200).json({
        success: true,
        data: likedBlogs.map(like => like.blog)
    });
});

export const getBlogFeedback = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) {
        throw new ApiErrors(404,"Blog Not Found")
    }
    const comments = await Comment.find({blog: req.params.id}).populate("user", "username");
    const ratings = await Rating.find({blog: req.params.id}).populate("user", "username");

    res.status(200).json({
        success: true,
        data: {
            comments,
            ratings
        }
    });
});

