import apiCall from "../apiConfig.js";

export const blogService = {
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    return res?.data ?? res ?? [];
  },

  /* ================= SINGLE BLOG ================= */
  getBlog: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}`);
    return res?.data ?? res ?? null;
  },

  /* ================= CREATE BLOG ================= */
  createBlog: async (payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([k, v]) => {
      if (v) formData.append(k, v);
    });

    const res = await apiCall("/blogs", {
      method: "POST",
      body: formData,
    });

    return res?.data ?? res;
  },

  /* ================= DELETE BLOG ================= */
  deleteBlog: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });

    return res?.data ?? res;
  },

  /* ================= BLOG STATS ================= */
  getBlogStats: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/stats`);
    return res?.data ?? res;
  },

  /* ================= LIKED BLOGS ================= */
  getLikedBlogs: async () => {
    const res = await apiCall("/blogs/liked");
    return res?.data ?? [];
  },

  /* ================= BLOG FEEDBACK ================= */
  getBlogFeedback: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/feedback`);
    return res?.data ?? res;
  },

  /* ================= ⭐ NEW: MY BLOGS ================= */
  getMyBlogs: async () => {
    const res = await apiCall("/blogs/my", {
      credentials: "include",
    });

    return res?.data ?? res ?? [];
  },
};