import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export const reviewBlogContent = async (content) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a professional grammar editor.

Analyze the blog content and return ONLY VALID JSON.

Required format:

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

Rules:
- Return ONLY raw JSON
- No markdown
- No explanation text
- correctedText must ALWAYS exist
- errors must ALWAYS exist

Blog Content:
${content}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    console.log("RAW GEMINI RESPONSE:", text);

    // remove markdown wrappers if Gemini adds them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(text);

      return {
        correctedText:
          parsed.correctedText || content,
        errors: parsed.errors || [],
      };
    } catch (parseError) {
      console.error(
        "JSON Parse Failed:",
        parseError
      );

      // fallback if Gemini sends plain text
      return {
        correctedText: text || content,
        errors: [],
      };
    }
  } catch (error) {
    console.error(
      "Gemini Service Error:",
      error
    );

    return {
      correctedText: content,
      errors: [
        {
          original: "AI Service Error",
          suggestion: "Please try again",
          issue: error.message,
        },
      ],
    };
  }
};