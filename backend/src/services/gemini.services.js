import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const reviewBlogContent = async (content) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });

    const prompt = `
You are a professional grammar editor.

Analyze the following blog content and return ONLY JSON in this format:

{
  "errors": [
    {
      "original": "wrong sentence",
      "suggestion": "correct sentence",
      "issue": "grammar/spelling/punctuation"
    }
  ],
  "correctedText": "fully corrected version of the blog"
}

Content:
"""${content}"""
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("Parsing error:", text);
        throw new Error("Invalid AI response format");
    }
};