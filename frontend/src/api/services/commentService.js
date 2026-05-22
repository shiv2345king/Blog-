import apiCall from "../apiConfig";

const unwrap = (res) => {
  return res?.data ?? res ?? null;
};

export const commentService = {
  /* ================= GET COMMENTS ================= */
  getComments: async (blogId) => {
    if (!blogId) {
      throw new Error("blogId required");
    }

    const res = await apiCall(`/comments/blog/${blogId}`);

    const data = unwrap(res);

    return Array.isArray(data) ? data : [];
  },

  /* ================= GET SINGLE COMMENT ================= */
  getCommentById: async (commentId) => {
    if (!commentId) {
      throw new Error("commentId required");
    }

    const res = await apiCall(`/comments/${commentId}`);

    return unwrap(res);
  },

  /* ================= ADD COMMENT ================= */
  addComment: async (blogId, content) => {
    if (!blogId || !content?.trim()) {
      return null;
    }

    const res = await apiCall(`/comments/blog/${blogId}`, {
      method: "POST",
      body: JSON.stringify({
        content: content.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return unwrap(res);
  },

  /* ================= UPDATE COMMENT ================= */
  updateComment: async (commentId, content) => {
    if (!commentId || !content?.trim()) {
      return null;
    }

    const res = await apiCall(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({
        content: content.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return unwrap(res);
  },

  /* ================= DELETE COMMENT ================= */
  deleteComment: async (commentId) => {
    if (!commentId) {
      return null;
    }

    const res = await apiCall(`/comments/${commentId}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },

  /* ================= LIKE COMMENT ================= */
  likeComment: async (commentId) => {
    if (!commentId) {
      return null;
    }

    const res = await apiCall(`/likes/comment/${commentId}`, {
      method: "POST",
    });

    return unwrap(res);
  },

  /* ================= UNLIKE COMMENT ================= */
  unlikeComment: async (commentId) => {
    if (!commentId) {
      return null;
    }

    const res = await apiCall(`/likes/comment/${commentId}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },

  /* ================= COMMENT LIKE COUNT ================= */
  getCommentLikeCount: async (commentId) => {
    if (!commentId) {
      return null;
    }

    const res = await apiCall(
      `/likes/comment/${commentId}/count`
    );

    return unwrap(res);
  },

  /* ================= LIKED COMMENTS ================= */
  getLikedComments: async () => {
    const res = await apiCall(`/likes/comment/liked`);

    const data = unwrap(res);

    return Array.isArray(data) ? data : [];
  },
};