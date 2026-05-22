import React, { useState, useEffect } from "react";
import { aiService } from "../../api/services/aiService.js";

export default function AIReviewPanel({ content }) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= RESET ON CONTENT CHANGE ================= */
  useEffect(() => {
    setReview("");
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

      const res = await aiService.reviewBlog(content);
console.log("AI RESPONSE:", res);

const aiText =
  res?.review?.correctedText ||
  res?.correctedText ||
  "";
      if (!aiText) {
        setError("No response from AI");
        return;
      }

      setReview(aiText);
    } catch (err) {
      console.error("AI Review failed:", err);
      setError("AI review failed. Try again.");
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
        <div className="text-red-600 text-sm mt-3">
          {error}
        </div>
      )}

      {/* REVIEW */}
      {review && (
        <div className="bg-gray-100 p-4 rounded mt-4 border">
          <h3 className="font-semibold mb-2">
            AI Feedback
          </h3>

          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {review}
          </p>
        </div>
      )}
    </div>
  );
}