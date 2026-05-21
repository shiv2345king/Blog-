import apiCall from "../apiConfig";

export const commentService = {
  // =========================
  // GET COMMENTS
  // =========================
  getComments: async (blogId) => {
    const res = await apiCall(`/comments/blog/${blogId}`);

    return res?.data || [];
  },

  // =========================
  // ADD COMMENT
  // =========================
  addComment: async (blogId, content) => {
    const res = await apiCall(`/comments/blog/${blogId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res?.data || null;
  },

  // =========================
  // UPDATE COMMENT
  // =========================
  updateComment: async (commentId, content) => {
    const res = await apiCall(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res?.data || null;
  },

  // =========================
  // DELETE COMMENT
  // =========================
  deleteComment: async (commentId) => {
    const res = await apiCall(`/comments/${commentId}`, {
      method: "DELETE",
    });

    return res?.data || null;
  },
};