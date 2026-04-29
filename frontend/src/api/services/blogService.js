import apiCall from "../api";

export const blogService = {
  // Get all blogs
  getAllBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/blogs${queryString ? `?${queryString}` : ''}`);
  },

  // Get blog by ID
  getBlogById: (id) => apiCall(`/blogs/${id}`),

  // Create blog with image
  createBlog: (formData) => apiCall('/blogs', {
    method: 'POST',
    body: formData,
    headers: {}, // Don't set Content-Type for FormData
  }),

  // Update blog
  updateBlog: (id, formData) => apiCall(`/blogs/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {},
  }),

  // Delete blog
  deleteBlog: (id) => apiCall(`/blogs/${id}`, {
    method: 'DELETE',
  }),

  // Get blog stats
  getBlogStats: (id) => apiCall(`/blogs/${id}/stats`),

  // Get liked blogs
  getLikedBlogs: () => apiCall('/blogs/liked'),

  // Get blog feedback
  getBlogFeedback: (id) => apiCall(`/blogs/${id}/feedback`),
};