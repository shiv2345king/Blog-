import React from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  RTE,
  Select,
} from "../../components/index.js";

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

  // ================= SUBMIT =================
  const submit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        image: data.image?.[0],
        status: data.status,
      };

      let saved;

      if (post) {
        saved = await blogService.updateBlog(
          post._id,
          payload
        );
      } else {
        saved = await blogService.createBlog(
          payload
        );
      }

      console.log("SAVED BLOG:", saved);

      if (!saved?._id) {
        console.log("DEBUG SAVE RESPONSE:", saved);
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
        <form
          onSubmit={handleSubmit(submit)}
          className="p-8 space-y-8"
        >

          {/* TITLE */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Title
            </label>

            <Input
              placeholder="Enter an engaging title..."
              {...register("title", {
                required: true,
              })}
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Content
            </label>

            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
              <RTE
                control={control}
                name="content"
              />
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

          {/* EXISTING IMAGE */}
          {post?.image && (
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Current Image
              </label>

              <img
                src={post.image}
                alt="Post"
                className="w-full h-72 object-cover rounded-2xl shadow-md"
              />
            </div>
          )}

          {/* STATUS */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Post Status
            </label>

            <Select
              options={[
                "active",
                "inactive",
              ]}
              {...register("status")}
            />
          </div>

          {/* BUTTON */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-4 text-lg font-bold rounded-2xl transition-transform hover:scale-[1.02]"
            >
              {post
                ? "✅ Update Post"
                : "📢 Publish Post"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}