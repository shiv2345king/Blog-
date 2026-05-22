import React, { useState, useEffect } from "react";
import { aiService } from "../../api/services/aiService.js";

export default function AIReviewPanel({ content }) {
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= RESET ON CONTENT CHANGE ================= */
  useEffect(() => {
    setReview("");
    setErrors([]);
    setError("");
  }, [content]);

  /* ================= AI CALL ================= */
  const handleReview = async () => {
    if (!content?.trim()) {
      alert("Please write content first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setReview("");
      setErrors([]);

      const res = await aiService.reviewBlog(content);
      console.log("AI RESPONSE:", res);

      const aiText =
        res?.review?.correctedText || res?.correctedText || "";

      const aiErrors =
        res?.review?.errors || res?.errors || [];

      if (!aiText) {
        setError("No response from AI. Please try again.");
        return;
      }

      setReview(aiText);
      setErrors(aiErrors);
    } catch (err) {
      console.error("AI Review failed:", err);

      const msg = err.message || "";

      if (
        msg.includes("503") ||
        msg.includes("unavailable") ||
        msg.includes("high demand")
      ) {
        setError(
          "AI is experiencing high demand right now. Please try again in a moment."
        );
      } else if (msg.includes("GEMINI_API_KEY")) {
        setError("AI service is misconfigured. Contact support.");
      } else {
        setError("AI review failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* BUTTON */}
      <button
        onClick={handleReview}
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "🤖 AI Review"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 px-4 py-2 rounded">
          ⚠️ {error}
        </div>
      )}

      {/* GRAMMAR ERRORS */}
      {errors.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-sm text-gray-600">
            Issues Found ({errors.length})
          </h3>
          <ul className="space-y-2">
            {errors.map((e, i) => (
              <li
                key={i}
                className="text-sm bg-yellow-50 border border-yellow-200 rounded px-3 py-2"
              >
                <span className="line-through text-red-500 mr-2">
                  {e.original}
                </span>
                <span className="text-green-600 font-medium mr-2">
                  → {e.suggestion}
                </span>
                <span className="text-gray-400 text-xs">({e.issue})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CORRECTED TEXT */}
      {review && (
        <div className="bg-gray-100 p-4 rounded mt-4 border">
          <h3 className="font-semibold mb-2">✅ Corrected Text</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{review}</p>
        </div>
      )}
    </div>
  );
}