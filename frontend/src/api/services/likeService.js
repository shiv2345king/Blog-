
import apiCall from "../apiConfig";

export const likeService = {
    likeBlog: (blogId) => apiCall(`/likes/blog/${blogId}/like`,{
        method: 'POST',
    }),
    unlikeBlog: (blogId) => apiCall(`/likes/blog/${blogId}/like`,{
        method: 'DELETE',
    }),
    getLikesForBlog: (blogId) => apiCall(`/likes/blog/${blogId}/likes`),
    getLikedBlogsForUser: () => apiCall('/likes/blog/liked'),
    getLikeCountForBlog: (blogId) => apiCall(`/likes/blog/${blogId}/like-count`),
    likeComment: (commentId) => apiCall(`/likes/comment/${commentId}/like`,{
        method: 'POST',
    }),
    unlikeComment: (commentId) => apiCall(`/likes/comment/${commentId}/like`,{
        method: 'DELETE',
    }),
    getLikedCommentsForUser: () => apiCall('/likes/comment/liked'),
    getLikeCountForComment: (commentId) => apiCall(`/likes/comment/${commentId}/like-count`),

};