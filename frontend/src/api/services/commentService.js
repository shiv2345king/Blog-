import apiCall from "../apiConfig";

export const commentService = {
  // =========================
  // GET COMMENTS
  // =========================
  getComments: async (blogId) => {
    if (!blogId) throw new Error("blogId required");

    const res = await apiCall(`/comments/blog/${blogId}`);

    // ✅ ApiResponse structure: { statusCode, data, message, success }
    // The actual comments array is in res.data
    if (Array.isArray(res?.data)) {
      return res.data;
    }

    return [];
  },

  // =========================
  // ADD COMMENT
  // =========================
  addComment: async (blogId, content) => {
    if (!blogId) throw new Error("blogId required");
    if (!content?.trim()) throw new Error("content required");

    const res = await apiCall(`/comments/blog/${blogId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Return the comment object from res.data
    return res?.data || null;
  },

  // =========================
  // UPDATE COMMENT
  // =========================
  updateComment: async (commentId, content) => {
    if (!commentId) throw new Error("commentId required");

    const res = await apiCall(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Return the updated comment object from res.data
    return res?.data || null;
  },

  // =========================
  // DELETE COMMENT
  // =========================
  deleteComment: async (commentId) => {
    if (!commentId) throw new Error("commentId required");

    const res = await apiCall(`/comments/${commentId}`, {
      method: "DELETE",
    });

    // ✅ Return the delete confirmation from res.data
    return res?.data || null;
  },
};