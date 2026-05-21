// ==============================
// aiService.js
// ==============================

import apiCall from "../apiConfig";

export const aiService = {
  reviewBlog: async (
    content
  ) => {
    if (!content) {
      throw new Error(
        "Content required"
      );
    }

    // ✅ FORCE STRING
    const safeContent =
      typeof content ===
      "string"
        ? content
        : JSON.stringify(
            content
          );

    const response =
      await apiCall(
        `/ai/review`,
        {
          method: "POST",
          body: JSON.stringify({
            content:
              safeContent,
          }),
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    return response;
  },
};