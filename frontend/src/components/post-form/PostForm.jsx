import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { blogService } from "../../api/services/blogService";
import { aiService } from "../../api/services/aiService";
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

  // ================= AI REVIEW =================
  const reviewContent = async (content) => {
    try {
      setAiLoading(true);

      const response = await aiService.reviewBlog({ content });
      const feedback = response?.data ?? response;

      setAiFeedback(feedback);
      return feedback;
    } catch (error) {
      console.error("AI Review Error:", error);
      setAiFeedback(null);
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiReview = async () => {
    const content = getValues("content");

    const plainText =
      typeof content === "string"
        ? content
        : content?.blocks
        ? content.blocks.map((b) => b.text || "").join("\n")
        : String(content || "");

    const cleaned = plainText.replace(/<[^>]*>/g, "").trim();

    if (!cleaned) return alert("Write content first");

    await reviewContent(cleaned);
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
      <Input
        label="Title"
        {...register("title", { required: true })}
      />

      {/* CONTENT EDITOR */}
      <div className="w-full font-medium text-gray-900">
        <RTE label="Content" name="content" control={control} />
      </div>

      {/* AI REVIEW */}
      <Button
        type="button"
        onClick={handleAiReview}
        bgColor="bg-purple-600"
        className="font-semibold tracking-wide"
      >
        AI Review
      </Button>

      {/* IMAGE */}
      <Input
        type="file"
        accept="image/*"
        {...register("image")}
      />

      {/* EXISTING IMAGE */}
      {post?.image && (
        <img
          src={post.image}
          className="rounded-lg max-h-72 w-full object-cover"
        />
      )}

      {/* STATUS */}
      <Select
        options={["active", "inactive"]}
        {...register("status")}
      />

      {/* SUBMIT */}
      <Button
        type="submit"
        bgColor={post ? "bg-green-500" : "bg-blue-500"}
        className="font-semibold tracking-wide"
      >
        {post ? "Update Post" : "Publish"}
      </Button>

      {/* AI STATUS */}
      {aiLoading && (
        <p className="text-sm text-gray-500 font-medium">
          AI analyzing...
        </p>
      )}

      {/* AI FEEDBACK (optional debug) */}
      {aiFeedback && (
        <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto font-medium">
          {JSON.stringify(aiFeedback, null, 2)}
        </pre>
      )}
    </form>
  );
}