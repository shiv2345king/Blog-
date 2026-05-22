import React from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button, Input, RTE, Select } from "../../components/index.js";
import AIReviewPanel from "../Post/AIReviewPanel.jsx";
import { blogService } from "../../api/services/blogService.js";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();

  /* ================= FIX: proper RHF subscription ================= */
  const content = useWatch({
    control,
    name: "content",
  });

  /* ================= SUBMIT ================= */
  const submit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        image: data.image?.[0],
        status: data.status,
      };

      const saved = post
        ? await blogService.updateBlog(post._id, payload)
        : await blogService.createBlog(payload);

      if (!saved?._id) {
        console.log("DEBUG:", saved);
        throw new Error("Blog ID missing");
      }

      navigate(`/posts/${saved._id}`);
    } catch (err) {
      console.error("POST ERROR:", err);
      alert(err.message || "Failed to save blog");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            {post ? "✏️ Update Post" : "🚀 Create New Post"}
          </h1>
          <p className="text-blue-100 mt-2">
            Share your ideas with the world
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(submit)} className="p-8 space-y-8">

          {/* TITLE */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Title
            </label>

            <Input
              placeholder="Enter an engaging title..."
              {...register("title", { required: true })}
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Content
            </label>

            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
              <RTE control={control} name="content" />
            </div>
          </div>

          {/* AI REVIEW */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              AI Content Review
            </label>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">

              <p className="text-sm text-gray-600 mb-4">
                Analyze your content using AI before publishing.
              </p>

              <AIReviewPanel content={content || ""} />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Upload Featured Image
            </label>

            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50 hover:bg-blue-100 transition">

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full text-gray-700 cursor-pointer"
              />

              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, JPEG supported
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Status
            </label>

            <Select
              options={["active", "inactive"]}
              {...register("status")}
            />
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-4 text-lg font-bold rounded-2xl"
            >
              {post ? "✅ Update Post" : "📢 Publish Post"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}