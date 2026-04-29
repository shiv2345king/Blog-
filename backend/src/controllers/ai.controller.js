import { reviewBlogContent } from "../services/gemini.services.js";

export const reviewBlog = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const result = await reviewBlogContent(content);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze blog"
        });
    }
};