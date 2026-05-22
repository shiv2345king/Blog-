import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

const prompt = (content) => `
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

export const reviewBlogContent = async (content) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt(content));

      let text = result.response.text();
      console.log(`RAW GEMINI RESPONSE (${modelName}):`, text);

      // Strip markdown wrappers if present
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsed = JSON.parse(text);
        return {
          correctedText: parsed.correctedText || content,
          errors: parsed.errors || [],
        };
      } catch (parseError) {
        console.error("JSON Parse Failed:", parseError);
        // Gemini returned plain text — use it directly
        return {
          correctedText: text || content,
          errors: [],
        };
      }
    } catch (error) {
      console.error(`Model ${modelName} failed:`, error.message);

      const is503 =
        error.message?.includes("503") ||
        error.message?.includes("Service Unavailable") ||
        error.message?.includes("high demand");

      if (is503) {
        console.warn(`${modelName} overloaded, trying next model...`);
        lastError = error;
        continue; // try next model
      }

      // Non-503 error — throw immediately
      throw error;
    }
  }

  // All models failed
  throw new Error(
    lastError?.message || "All Gemini models are currently unavailable"
  );
};