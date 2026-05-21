import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { blogService } from "../api/services/blogService.js";
import { aiService } from "../api/services/aiService.js";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const { register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();

  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ================= COPY =================
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // ================= DIFF HIGHLIGHT =================
  const highlightDiff = (original = "", corrected = "") => {
    const origWords = original.split(" ");
    const corrWords = corrected.split(" ");

    return corrWords.map((word, i) => {
      const isDifferent = word !== origWords[i];

      return (
        <span
          key={i}
          className={isDifferent ? "bg-green-200 px-1 rounded" : ""}
        >
          {word + " "}
        </span>
      );
    });
  };

  // ================= AI REVIEW =================
  const handleAiReview = async () => {
    try {
      setAiLoading(true);

      const content = getValues("content");

      const plainText =
        typeof content === "string"
          ? content
          : content?.blocks
          ? content.blocks.map((b) => b.text || "").join("\n")
          : "";

      const cleaned = plainText.replace(/<[^>]*>/g, "").trim();

      if (!cleaned) {
        alert("Write content first");
        return;
      }

      const result = await aiService.reviewBlog(cleaned);

      setAiFeedback({
        correctedText: result?.correctedText || "",
        errors: result?.errors || [],
      });
    } catch (error) {
      console.error("AI Review Error:", error);
      setAiFeedback(null);
    } finally {
      setAiLoading(false);
    }
  };

  // ================= SUBMIT =================
  const submit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        image: data.image?.[0],
        status: data.status,
      };

      let response;

      if (post) {
        response = await blogService.updateBlog(post._id, payload);
      } else {
        response = await blogService.createBlog(payload);
      }

      const saved = response?.data ?? response;

      if (!saved?._id) throw new Error("Blog save failed");

      navigate(`/posts/${saved._id}`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-6 font-semibold text-gray-900"
    >
      {/* TITLE */}
      <Input label="Title" {...register("title", { required: true })} />

      {/* CONTENT */}
      <div className="w-full font-medium text-gray-900">
        <RTE label="Content" name="content" control={control} />
      </div>

      {/* AI BUTTON */}
      <Button
        type="button"
        onClick={handleAiReview}
        bgColor="bg-purple-600"
      >
        AI Review
      </Button>

      {/* LOADING */}
      {aiLoading && (
        <p className="text-sm text-gray-500">AI analyzing...</p>
      )}

      {/* AI RESULT */}
      {aiFeedback?.correctedText && (
        <div className="bg-gray-100 p-4 rounded-md space-y-3">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold">AI Suggested Version</h3>

            <button
              type="button"
              onClick={() =>
                copyToClipboard(aiFeedback.correctedText)
              }
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Copy
            </button>
          </div>

          {/* HIGHLIGHT DIFF */}
          <div className="text-sm leading-6">
            {highlightDiff(
              getValues("content"),
              aiFeedback.correctedText
            )}
          </div>

          {/* ERRORS */}
          {aiFeedback.errors?.length > 0 && (
            <div className="text-xs text-red-600">
              Issues: {aiFeedback.errors.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* IMAGE */}
      <Input type="file" accept="image/*" {...register("image")} />

      {/* EXISTING IMAGE */}
      {post?.image && (
        <img
          src={post.image}
          className="rounded-lg max-h-72 w-full object-cover"
        />
      )}

      {/* STATUS */}
      <Select options={["active", "inactive"]} {...register("status")} />

      {/* SUBMIT */}
      <Button
        type="submit"
        bgColor={post ? "bg-green-500" : "bg-blue-500"}
      >
        {post ? "Update Post" : "Publish"}
      </Button>
    </form>
  );
}