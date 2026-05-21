import Comment from "../models/comments.model.js"; // ✅ Add .js extension
import Blog from "../models/blog.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Like from "../models/likes.model.js";

// =========================
// GET USER DASHBOARD DATA
// =========================
export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user info
  const user = await User.findById(userId).select("-password -refreshToken");
  
  if (!user) {
    throw new ApiErrors(404, "User not found");
  }

  // Get all user's blogs
  const blogs = await Blog.find({ owner: userId }) // ✅ Changed 'author' to 'owner'
    .select("title slug createdAt")
    .sort({ createdAt: -1 });

  const totalBlogs = blogs.length;

  // Get blog IDs for aggregation
  const blogIds = blogs.map(blog => blog._id);

  // Count likes and comments on user's blogs
  const totalLikes = await Like.countDocuments({ 
    blog: { $in: blogIds } 
  });

  const totalComments = await Comment.countDocuments({ 
    blog: { $in: blogIds } 
  });

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      stats: {
        totalBlogs,
        totalLikes,
        totalComments,
      },
      recentBlogs: blogs.slice(0, 5)
    }, "Dashboard data fetched successfully")
  );
});