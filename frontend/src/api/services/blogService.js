import apiCall from "../apiConfig.js";

export const blogService = {
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    return res?.data ?? res ?? [];
  },

  getBlog: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}`);
    return res?.data ?? res ?? null;
  },

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

  deleteBlog: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });

    return res?.data ?? res;
  },

  getBlogStats: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/stats`);
    return res?.data ?? res;
  },

  getLikedBlogs: async () => {
    const res = await apiCall("/blogs/liked");
    return res?.data ?? [];
  },

  getBlogFeedback: async (id) => {
    if (!id) return null;

    const res = await apiCall(`/blogs/${id}/feedback`);
    return res?.data ?? res;
  },
};