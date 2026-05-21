import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../../components/index.js";
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

  const submit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        image: data.image?.[0],
        status: data.status,
      };

      let res = post
        ? await blogService.updateBlog(post._id, payload)
        : await blogService.createBlog(payload);

      // 🔥 FIX: correct unwrap (CRITICAL)
      const saved = res?.data?.data ?? res?.data ?? res;

      const id = saved?._id || saved?._id?._id;

      if (!id) {
        console.log("DEBUG SAVE RESPONSE:", res);
        throw new Error("Blog ID missing");
      }

      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">

      <Input label="Title" {...register("title")} />

      <RTE control={control} name="content" />

      <input type="file" accept="image/*" {...register("image")} />

      {post?.image && (
        <img
          src={post.image}
          className="w-full h-60 object-cover rounded"
        />
      )}

      <Select options={["active", "inactive"]} {...register("status")} />

      <Button type="submit">
        {post ? "Update Post" : "Publish"}
      </Button>
    </form>
  );
}