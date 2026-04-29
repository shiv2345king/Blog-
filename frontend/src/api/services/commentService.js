import apiCall from "../apiConfig";

export const commentService= {
    //Get comments for a blog
    getCommentsForBlog: (blogId) => apiCall(`/comments/${blogId}/comments`),

    //Add comment to a blog
    addComment: (blogId, content) => apiCall(`/comments/${blogId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    }),
    
    //Get comment by ID
    getCommentById: (commentId) => apiCall(`/comments/${commentId}`),

    //Update comment
    updateComment: (commentId, content) => apiCall(`/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
    }),

    //Delete comment
    deleteComment: (commentId) => apiCall(`/comments/${commentId}`, {
        method: 'DELETE',
        body: JSON.stringify({ commentId }),
    }),
        
};