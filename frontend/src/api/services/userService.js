import apiCall from "../apiConfig";

export const userService = {
 //register
  register: async (formData) => {
    if (!formData) throw new Error("FormData is required");

    const res = await apiCall("/users/register", {
      method: "POST",
      body: formData,
      headers: {},
    });

    return res; // ✅ FIX: return full response
  },
//login
  login: async (credentials) => {
    if (!credentials) throw new Error("Credentials required");

    const res = await apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res; // ✅ FIX: return full response
  },
  //google login
  googleLogin:  () => {
    window.location.href =
    "https://blog-qifu.onrender.com/api/users/auth/google";
  }
,
  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    return await apiCall("/users/logout", {
      method: "POST",
    });
  },

  // =========================
  // REFRESH TOKEN
  // =========================
  refreshAccessToken: async () => {
    return await apiCall("/users/refresh-token", {
      method: "POST",
    });
  },

  // =========================
  // CHANGE PASSWORD
  // =========================
  changePassword: async (passwordData) => {
    if (!passwordData) throw new Error("Password data required");

    const res = await apiCall("/users/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  },

  // =========================
  // CURRENT USER
  // =========================
  getCurrentUser: async () => {
    return await apiCall("/users/me");
  },

  // =========================
  // UPDATE ACCOUNT (FIXED ROUTE)
  // =========================
  updateAccountDetails: async (accountData) => {
    if (!accountData) throw new Error("Account data required");

    return await apiCall("/users/update", {
      method: "PUT",
      body: JSON.stringify(accountData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // =========================
  // UPDATE AVATAR (FIXED ROUTE)
  // =========================
  updateUserAvatar: async (avatarFile) => {
    if (!avatarFile) throw new Error("Avatar file required");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    return await apiCall("/users/avatar", {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },

  // =========================
  // DELETE ACCOUNT
  // =========================
  deleteAccount: async () => {
    return await apiCall("/users/delete", {
      method: "DELETE",
    });
  },

  // =========================
  // PROFILE
  // =========================
  getUserProfile: async (username) => {
    if (!username) throw new Error("Username required");

    return await apiCall(`/users/${username}/profile`);
  },
};