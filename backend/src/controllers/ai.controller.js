import { reviewBlogContent } from "../services/gemini.services.js";
console.log("ENV KEY:", process.env.GEMINI_API_KEY);

export const reviewBlog = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const result = await reviewBlogContent(content);

        // 🔍 DEBUG: See what result actually contains
        console.log("GEMINI RESULT:", JSON.stringify(result, null, 2));
        console.log("RESULT KEYS:", Object.keys(result));
        console.log("correctedText type:", typeof result?.correctedText);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("FULL AI ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
};