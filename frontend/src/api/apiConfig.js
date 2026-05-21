const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://blog-qifu.onrender.com/api";

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
    credentials: "include", // REQUIRED for cookies/auth
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

    const isAuthEndpoint =
      endpoint.includes("/login") ||
      endpoint.includes("/register") ||
      endpoint.includes("/refresh-token");

    /* ================= 401 HANDLING ================= */
    if (response.status === 401 && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiCall(endpoint, options));
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(
          `${API_BASE_URL}/users/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        processQueue(null);
        isRefreshing = false;

        return apiCall(endpoint, options);
      } catch (err) {
        processQueue(err);
        isRefreshing = false;

        return { error: "SESSION_EXPIRED" };
      }
    }

    const data = await safeJson(response);

    /* ================= ERROR RESPONSE ================= */
    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "REQUEST_FAILED",
        status: response.status,
      };
    }

    /* ================= NORMALIZE RESPONSE =================
       ALWAYS RETURN:
       { success, data }
    ===================================================== */
    return {
      success: true,
      data: data?.data ?? data,
    };
  } catch (error) {
    console.error("API Error:", error);

    return {
      success: false,
      error: "NETWORK_ERROR",
    };
  }
};

export default apiCall;