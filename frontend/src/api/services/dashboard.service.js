// api/services/dashboardService.js
import apiCall from "../apiConfig";

export const dashboardService = {
  // =========================
  // GET USER DASHBOARD DATA
  // =========================
  getDashboardData: async () => {
    const res = await apiCall("/dashboard");
    
    // ✅ ApiResponse structure: { statusCode, data, message, success }
    return res?.data || null;
  },
};