import apiCall from "../apiConfig";

export const aiService = {
    reviewBlog: (blogId) => apiCall(`/ai/review`, {
        method: 'POST',
        body: JSON.stringify({ blogId }),
    }),
}