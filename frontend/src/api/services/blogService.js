import apiCall from "../apiConfig.js";

/* ================= SAFE UNWRAP ================= */
const unwrap = (res) => {
  if (!res) return null;
  return res.data ?? res;
};

export const blogService = {
  /* ================= GET ALL BLOGS ================= */
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  /* ================= GET SINGLE BLOG ================= */
  getBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`);
    return unwrap(res);
  },

  /* ================= CREATE BLOG ================= */
  createBlog: async (payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const res = await apiCall("/blogs", {
      method: "POST",
      body: formData,
    });

    return unwrap(res);
  },

  /* ================= UPDATE BLOG ================= */
  updateBlog: async (id, payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const res = await apiCall(`/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });

    return unwrap(res);
  },

  /* ================= DELETE BLOG ================= */
  deleteBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },

  /* ================= MY BLOGS (FIXED - MAIN BUG) ================= */
  getMyBlogs: async () => {
    const res = await apiCall("/blogs/my");
    const data = unwrap(res);

    return Array.isArray(data) ? data : [];
  },

  /* ================= BLOG STATS ================= */
  getBlogStats: async (id) => {
    const res = await apiCall(`/blogs/${id}/stats`);
    return unwrap(res);
  },

  /* ================= LIKED BLOGS ================= */
  getLikedBlogs: async () => {
    const res = await apiCall("/blogs/liked");
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  /* ================= FEEDBACK ================= */
  getBlogFeedback: async (id) => {
    const res = await apiCall(`/blogs/${id}/feedback`);
    return unwrap(res);
  },
};