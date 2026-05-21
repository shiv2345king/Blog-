import apiCall from "../apiConfig.js";

// normalize ALL backend responses
const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export const blogService = {
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    return unwrap(res) ?? [];
  },

  getBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`);
    return unwrap(res);
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

    return unwrap(res);
  },

  updateBlog: async (id, payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([k, v]) => {
      if (v) formData.append(k, v);
    });

    const res = await apiCall(`/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });

    return unwrap(res);
  },

  deleteBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },

  getLikedBlogs: async () => {
    const res = await apiCall("/blogs/liked");
    return unwrap(res) ?? [];
  },

  getBlogStats: async (id) => {
    const res = await apiCall(`/blogs/${id}/stats`);
    return unwrap(res);
  },

  getBlogFeedback: async (id) => {
    const res = await apiCall(`/blogs/${id}/feedback`);
    return unwrap(res);
  },

  getMyBlogs: async () => {
    const res = await apiCall("/blogs/my");
    return unwrap(res) ?? [];
  },
};