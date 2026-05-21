import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export const reviewBlogContent =
  async (content) => {
    try {
      const model =
        genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

      const prompt = `
You are a professional grammar editor.

Analyze the blog content.

Return ONLY valid JSON.

Format:

{
  "errors": [
    {
      "original": "wrong text",
      "suggestion": "correct text",
      "issue": "grammar/spelling/punctuation"
    }
  ],
  "correctedText": "full corrected blog"
}

IMPORTANT:
- If there are NO mistakes:
  - return empty errors array
  - correctedText should still contain the full content
- Do NOT wrap JSON in markdown

Blog Content:
${content}
`;

      const result =
        await model.generateContent(
          prompt
        );

      let text =
        result.response.text();

      console.log(
        "RAW GEMINI:",
        text
      );

      // remove markdown if added
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed =
        JSON.parse(text);

      return parsed;
    } catch (error) {
      console.error(
        "Gemini Service Error:",
        error.message
      );

      // IMPORTANT FIX
      return {
        correctedText: content,
        errors: [
          {
            original:
              "AI Service Error",
            suggestion:
              "Please try again",
            issue:
              error.message,
          },
        ],
      };
    }
  };