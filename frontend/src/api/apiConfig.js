const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('accessToken');

  let config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  };

  // Remove content-type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    let response = await fetch(url, config);

    // 🔁 HANDLE TOKEN EXPIRY
    if (response.status === 401 && !endpoint.includes('/refresh-token')) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(async (newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          const res = await fetch(url, config);

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          return data.data || data;
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token failed');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token received');
        }

        // Save new token
        localStorage.setItem('accessToken', newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry original request
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        const retryResponse = await fetch(url, config);

        let retryData = null;
        try {
          retryData = await retryResponse.json();
        } catch {
          retryData = null;
        }

        if (!retryResponse.ok) {
          throw new Error(retryData?.message || 'Retry failed');
        }

        return retryData?.data || retryData;

      } catch (error) {
        processQueue(error, null);
        isRefreshing = false;

        // Clear session ONLY (no redirect here)
        localStorage.removeItem('accessToken');

        // ❗ IMPORTANT: DO NOT redirect here
        throw error;
      }
    }

    // ✅ NORMAL RESPONSE
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP Error ${response.status}`);
    }

    return data?.data || data;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiCall;