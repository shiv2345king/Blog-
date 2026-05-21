import apiCall from "../apiConfig";

export const userService = {
  // =========================
  // REGISTER
  // =========================
  register: async (formData) => {
    if (!formData) throw new Error("FormData is required");

    const res = await apiCall("/users/register", {
      method: "POST",
      body: formData,
      headers: {},
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // LOGIN
  // =========================
  login: async (credentials) => {
    if (!credentials) throw new Error("Credentials required");

    const res = await apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    return await apiCall("/users/logout", {
      method: "POST",
      credentials: "include",
    });
  },

  // =========================
  // REFRESH TOKEN (COOKIE BASED — FIXED)
  // =========================
  refreshAccessToken: async () => {
    return await apiCall("/users/refresh-token", {
      method: "POST",
      credentials: "include",
    });
  },

  // =========================
  // CHANGE PASSWORD (BACKEND MATCHED)
  // =========================
  changePassword: async (passwordData) => {
    if (!passwordData) throw new Error("Password data required");

    const res = await apiCall("/users/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // CURRENT USER
  // =========================
  getCurrentUser: async () => {
    const res = await apiCall("/users/me", {
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // UPDATE ACCOUNT (MATCH BACKEND)
  // =========================
  updateAccountDetails: async (accountData) => {
    if (!accountData) throw new Error("Account data required");

    const res = await apiCall("/users/update-account", {
      method: "PUT",
      body: JSON.stringify(accountData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // UPDATE AVATAR
  // =========================
  updateUserAvatar: async (avatarFile) => {
    if (!avatarFile) throw new Error("Avatar file required");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const res = await apiCall("/users/avatar", {
      method: "PUT",
      body: formData,
      headers: {},
      credentials: "include",
    });

    return res?.data;
  },

  // =========================
  // DELETE ACCOUNT (MATCH BACKEND)
  // =========================
  deleteAccount: async () => {
    return await apiCall("/users/delete", {
      method: "DELETE",
      credentials: "include",
    });
  },

  // =========================
  // USER PROFILE
  // =========================
  getUserProfile: async (username) => {
    if (!username) throw new Error("Username required");

    const res = await apiCall(`/users/${username}/profile`, {
      credentials: "include",
    });

    return res?.data;
  },
};