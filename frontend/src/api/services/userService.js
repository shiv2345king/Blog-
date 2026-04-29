import apiCall from "../apiConfig";

export const userService = {
  // Register new user (requires avatar file)
  register: (formData) => {
    // formData should contain: fullName, email, username, password, avatar (file)
    return apiCall('/users/register', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Login user
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Logout user
  logout: () => apiCall('/users/logout', {
    method: 'POST',
  }),

  // Refresh access token
  refreshAccessToken: () => apiCall('/users/refresh-token', {
    method: 'POST',
  }),

  // Change current password
  changePassword: (passwordData) => apiCall('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),

  // Get current user
  getCurrentUser: () => apiCall('/users/me'),

  // Update account details (fullName, email)
  updateAccountDetails: (accountData) => apiCall('/users/update', {
    method: 'PUT',
    body: JSON.stringify(accountData),
  }),

  // Update user avatar
  updateUserAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return apiCall('/users/avatar', {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Delete user account
  deleteAccount: () => apiCall('/users/delete', {
    method: 'DELETE',
  }),

  // Get user profile by username
  getUserProfile: (username) => apiCall(`/users/${username}/profile`),
};