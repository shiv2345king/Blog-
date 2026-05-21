import React, { useState } from "react";
import { aiService } from "../../api/services/aiService.js";

export default function AIReviewPanel({
  content,
}) {
  const [review, setReview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleReview = async () => {
    if (!content?.trim()) {
      return alert(
        "Please write content first"
      );
    }

    try {
      setLoading(true);

      const res =
        await aiService.reviewBlog(
          content
        );

      setReview(
  res?.data?.review ||
  res?.review ||
  "No response from AI"
);
    } catch (err) {
      console.error(
        "AI Review failed:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleReview}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        {loading
          ? "Analyzing..."
          : "🤖 AI Review"}
      </button>

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