import apiCall from "../apiConfig";

export const aiService = {
  reviewBlog: async (content) => {
    if (!content) throw new Error("Content required");

    const safeContent =
      typeof content === "string"
        ? content
        : JSON.stringify(content);

    const res = await apiCall("/ai/review", {
      method: "POST",
      body: JSON.stringify({ content: safeContent }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ FIX: return ONLY usable data
    return res?.data;
  },
};