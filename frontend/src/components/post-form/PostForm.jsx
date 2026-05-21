import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { blogService } from "../../api/services/blogService.js";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        image: data.image?.[0], // file
        status: data.status,
      };

      let res;

      if (post) {
        res = await blogService.updateBlog(post._id, payload);
      } else {
        res = await blogService.createBlog(payload);
      }

      const saved = res?.data ?? res;

      if (!saved?._id) throw new Error("Save failed");

      navigate(`/posts/${saved._id}`);
    } catch (err) {
      console.error("POST SAVE ERROR:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* TITLE */}
      <Input label="Title" {...register("title")} />

      {/* CONTENT */}
      <RTE control={control} name="content" />

      {/* IMAGE INPUT (IMPORTANT FIX) */}
      <Input type="file" accept="image/*" {...register("image")} />

      {/* EXISTING IMAGE PREVIEW */}
      {post?.image && (
        <img
          src={post.image}
          alt="preview"
          className="w-full h-60 object-cover rounded"
        />
      )}

      {/* STATUS */}
      <Select options={["active", "inactive"]} {...register("status")} />

      <Button type="submit">
        {post ? "Update" : "Publish"}
      </Button>
    </form>
  );
}