import Blog from "../models/blog.model.js";
import Like from "../models/likes.model.js";
import Comment from "../models/comments.model.js";
import { Rating } from "../models/rating.model.js";

import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/* ================= CREATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;

    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.buffer);
      
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed"
        });
      }

      imageUrl = uploadResult.secure_url; // ✅ CRITICAL: Extract URL
    }

    const blog = await Blog.create({
      title,
      content,
      image: imageUrl,  // ✅ Save the URL, not the file object
      status,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const blogs = await Blog.find().populate("owner", "username email");
  const likes = await Like.find();

  const likeMap = {};
  const likedSet = new Set();

  likes.forEach((l) => {
    const id = l.blog.toString();
    likeMap[id] = (likeMap[id] || 0) + 1;

    if (userId && l.user.toString() === userId.toString()) {
      likedSet.add(id);
    }
  });

  const enriched = blogs.map((b) => ({
    ...b.toObject(),
    likeCount: likeMap[b._id.toString()] || 0,
    isLikedByMe: likedSet.has(b._id.toString()),
  }));

  return res.status(200).json({
    success: true,
    data: enriched,
  });
});

/* ================= GET BLOG BY ID ================= */
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "owner",
    "username email"
  );

  if (!blog) throw new ApiErrors(404, "Blog Not Found");

  return res.status(200).json({
    success: true,
    data: blog,
  });
});

/* ================= MY BLOGS ================= */
export const getMyBlogs = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiErrors(401, "Unauthorized");
  }

  const blogs = await Blog.find({ owner: req.user._id }).populate(
    "owner",
    "username email"
  );
 console.log("USER IN MYBLOGS:", req.user);
  return res.status(200).json({
    success: true,
    data: blogs,
  });
});
/* ================= UPDATE BLOG ================= */
export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new ApiErrors(404, "Blog Not Found");

  if (String(blog.owner) !== String(req.user._id)) {
    throw new ApiErrors(403, "Not allowed");
  }

  if (title) blog.title = title;
  if (content) blog.content = content;

 if (req.file) {
  const uploaded = await uploadOnCloudinary(req.file.buffer);

  if (!uploaded?.secure_url) {
    throw new ApiErrors(500, "Image upload failed");
  }

  blog.image = uploaded.secure_url;
}

  await blog.save();

  return res.status(200).json({
    success: true,
    data: blog,
  });
});

/* ================= DELETE BLOG ================= */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new ApiErrors(404, "Blog Not Found");

  if (String(blog.owner) !== String(req.user._id)) {
    throw new ApiErrors(403, "Not allowed");
  }

  await blog.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});

/* ================= BLOG STATS ================= */
export const getBlogStats = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new ApiErrors(404, "Blog Not Found");

  const likes = await Like.countDocuments({ blog: blog._id });
  const comments = await Comment.countDocuments({ blog: blog._id });

  const ratings = await Rating.find({ blog: blog._id });

  const avg =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length
      : 0;

  return res.status(200).json({
    success: true,
    data: {
      likes,
      comments,
      averageRating: avg,
    },
  });
});

/* ================= LIKED BLOGS ================= */
export const getLikedBlogs = asyncHandler(async (req, res) => {
  const liked = await Like.find({ user: req.user._id }).populate("blog");

  return res.status(200).json({
    success: true,
    data: liked.map((l) => l.blog),
  });
});

/* ================= BLOG FEEDBACK ================= */
export const getBlogFeedback = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.params.id }).populate(
    "user",
    "username"
  );

  const ratings = await Rating.find({ blog: req.params.id }).populate(
    "user",
    "username"
  );

  return res.status(200).json({
    success: true,
    data: { comments, ratings },
  });
});