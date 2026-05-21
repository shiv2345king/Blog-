import apiCall from "../apiConfig";

const unwrap = (res) => {
  return res?.data ?? res ?? null;
};

export const commentService = {
  /* ================= GET COMMENTS ================= */
  getComments: async (blogId) => {
    if (!blogId) throw new Error("blogId required");

    const res = await apiCall(`/comments/blog/${blogId}`);

    const data = unwrap(res);

    return Array.isArray(data) ? data : [];
  },

  /* ================= ADD COMMENT ================= */
  addComment: async (blogId, content) => {
    if (!blogId || !content) return null;

    const res = await apiCall(`/comments/blog/${blogId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return unwrap(res);
  },

  /* ================= UPDATE COMMENT ================= */
  updateComment: async (commentId, content) => {
    if (!commentId || !content) return null;

    const res = await apiCall(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return unwrap(res);
  },

  /* ================= DELETE COMMENT ================= */
  deleteComment: async (commentId) => {
    if (!commentId) return null;

    const res = await apiCall(`/comments/${commentId}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },
};