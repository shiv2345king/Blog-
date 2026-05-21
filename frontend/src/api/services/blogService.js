import apiCall from "../apiConfig.js";

const unwrap = (res) => res?.data ?? res ?? null;

export const blogService = {
  /* ================= GET ALL BLOGS ================= */
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  /* ================= GET SINGLE BLOG ================= */
  getBlog: async (id) => {
    if (!id) return null;

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
  if (!id) return null;

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const res = await apiCall(`/blogs/${id}`, {
    method: "PUT",
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

    return unwrap(res);
  },

  /* ================= BLOG STATS ================= */
  getBlogStats: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/stats`);
    return unwrap(res);
  },

  /* ================= MY BLOGS ================= */
  getMyBlogs: async () => {
    const res = await apiCall("/blogs/my");
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  /* ================= LIKED BLOGS ================= */
  getLikedBlogs: async () => {
    const res = await apiCall("/blogs/liked");
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  /* ================= BLOG FEEDBACK ================= */
  getBlogFeedback: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/feedback`);
    return unwrap(res);
  },
};