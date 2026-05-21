import apiCall from "../apiConfig";

export const likeService = {

  // ================= BLOG =================
  likeBlog: (blogId) => {
    if (!blogId) throw new Error("blogId required");
    return apiCall(`/likes/blog/${blogId}`, { method: "POST" });
  },

  unlikeBlog: (blogId) => {
    if (!blogId) throw new Error("blogId required");
    return apiCall(`/likes/blog/${blogId}`, { method: "DELETE" });
  },

  getBlogLikes: (blogId) => {
    if (!blogId) throw new Error("blogId required");
    return apiCall(`/likes/blog/${blogId}/likes`);
  },

  getLikedBlogs: () => apiCall(`/likes/blog/liked`),

  getBlogLikeCount: (blogId) => {
    if (!blogId) throw new Error("blogId required");
    return apiCall(`/likes/blog/${blogId}/count`);
  },

  // ================= COMMENT =================
  likeComment: (commentId) => {
    if (!commentId) throw new Error("commentId required");
    return apiCall(`/likes/comment/${commentId}`, { method: "POST" });
  },

  unlikeComment: (commentId) => {
    if (!commentId) throw new Error("commentId required");
    return apiCall(`/likes/comment/${commentId}`, { method: "DELETE" });
  },

  getCommentLikes: (commentId) => {
    if (!commentId) throw new Error("commentId required");
    return apiCall(`/likes/comment/${commentId}/likes`);
  },

  getLikedComments: () => apiCall(`/likes/comment/liked`),

  getCommentLikeCount: (commentId) => {
    if (!commentId) throw new Error("commentId required");
    return apiCall(`/likes/comment/${commentId}/count`);
  },
};