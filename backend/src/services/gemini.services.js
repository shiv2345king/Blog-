import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const reviewBlogContent = async (content) => {
    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const prompt = `
You are a professional grammar editor.

Analyze the following blog content and return ONLY valid raw JSON.

Do NOT wrap the JSON in markdown.
Do NOT use \`\`\`json.
Do NOT add explanations.

Return format:

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

        let text = result.response.text();

        console.log("RAW GEMINI RESPONSE:", text);

        // 🔥 Remove markdown wrapping if Gemini still adds it
        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
};