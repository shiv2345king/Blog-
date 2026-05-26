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

const getErrorMessage = (data, status) => {
  if (status === 401) return "Invalid email or password";
  if (status === 409) return data?.message || "Email or username already exists";
  if (status === 400) return data?.message || "Invalid request";

  return (
    data?.message ||
    data?.error ||
    data?.data?.message ||
    data?.errors?.[0]?.message ||
    `Request failed with status ${status}`
  );
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

    const isAuthEndpoint =
      endpoint.includes("/login") ||
      endpoint.includes("/register") ||
      endpoint.includes("/refresh-token");

    if (response.status === 401 && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiCall(endpoint, options));
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/users/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        processQueue(null);
        isRefreshing = false;

        return apiCall(endpoint, options);
      } catch (err) {
        processQueue(err);
        isRefreshing = false;

        return {
          success: false,
          error: "Session expired. Please login again.",
          status: 401,
        };
      }
    }

    const data = await safeJson(response);

    if (!response.ok) {
      return {
        success: false,
        error: getErrorMessage(data, response.status),
        status: response.status,
      };
    }

    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message,
      status: response.status,
    };
  } catch (error) {
    console.error("API Error:", error);

    return {
      success: false,
      error: "Network error. Please try again.",
      status: 0,
    };
  }
};

export default apiCall;