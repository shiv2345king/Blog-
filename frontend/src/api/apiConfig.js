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

/* ================= MAIN API CALL ================= */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: options.method || "GET",
    credentials: "include", // REQUIRED for cookies
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

    const isRefreshEndpoint = endpoint.includes("/refresh-token");
    const isLoginOrRegister =
      endpoint.includes("/login") || endpoint.includes("/register");

    // =========================
    // HANDLE 401 (ONLY FOR PROTECTED ROUTES)
    // =========================
    if (response.status === 401 && !isRefreshEndpoint && !isLoginOrRegister) {
      
      // If already refreshing → queue request
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
          throw new Error("Refresh token invalid");
        }

        processQueue(null);
        isRefreshing = false;

        // retry original request
        return apiCall(endpoint, options);
      } catch (error) {
        processQueue(error);
        isRefreshing = false;

        // IMPORTANT: user is effectively logged out
        return { error: "SESSION_EXPIRED" };
      }
    }

    const data = await safeJson(response);

    if (!response.ok) {
      return {
        error: data?.message || "REQUEST_FAILED",
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);

    return {
      error: "NETWORK_ERROR",
    };
  }
};

export default apiCall;