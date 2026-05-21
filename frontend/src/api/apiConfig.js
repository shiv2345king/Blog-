const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://blog-qifu.onrender.com/api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: options.method || "GET",
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  };

  try {
    let response = await fetch(url, config);

    // =========================
    // DON'T AUTO-REFRESH FOR PUBLIC USERS
    // =========================
    const isAuthEndpoint =
      endpoint.includes("/users/me") ||
      endpoint.includes("/likes") ||
      endpoint.includes("/comments");

    if (response.status === 401 && !endpoint.includes("/refresh-token")) {
      // 🔥 If no refresh cookie exists → stop here (IMPORTANT FIX)
      if (!isAuthEndpoint) {
        return null;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiCall(endpoint, options));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/users/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshResponse.ok) {
          throw new Error("Refresh failed");
        }

        processQueue(null);
        isRefreshing = false;

        return apiCall(endpoint, options);
      } catch (error) {
        processQueue(error);
        isRefreshing = false;

        // 🔥 IMPORTANT: DO NOT THROW FOR PUBLIC APP FLOW
        return null;
      }
    }

    const data = await safeJson(response);

    if (!response.ok) {
      return null; // 🔥 don't crash UI
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export default apiCall;