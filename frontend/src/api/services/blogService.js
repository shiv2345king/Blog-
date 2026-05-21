import apiCall from "../apiConfig.js";

const unwrap = (res) => res?.data ?? res ?? null;

export const blogService = {
  getAllBlogs: async () => {
    const res = await apiCall("/blogs");
    return unwrap(res)?.data ?? [];
  },

  getBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`);
    return unwrap(res)?.data ?? null;
  },

  createBlog: async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => v && formData.append(k, v));

    const res = await apiCall("/blogs", {
      method: "POST",
      body: formData,
    });

    return unwrap(res)?.data ?? null;
  },

  updateBlog: async (id, payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => v && formData.append(k, v));

    const res = await apiCall(`/blogs/${id}`, {
      method: "PUT",
      body: formData,
    });

    return unwrap(res)?.data ?? null;
  },

  deleteBlog: async (id) => {
    const res = await apiCall(`/blogs/${id}`, {
      method: "DELETE",
    });

    return unwrap(res);
  },

  getMyBlogs: async () => {
    const res = await apiCall("/blogs/my");
    return unwrap(res)?.data ?? [];
  },
};