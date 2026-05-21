import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { blogService } from "../../api/services/blogService";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: post || {
      title: "",
      content: "",
      status: "active",
    },
  });

  const navigate = useNavigate();

  const submit = async (data) => {
    const payload = {
      title: data.title,
      content: data.content,
      image: data.image?.[0],
      status: data.status,
    };

    let res;

    if (post?._id) {
      res = await blogService.updateBlog(post._id, payload);
    } else {
      res = await blogService.createBlog(payload);
    }

    const saved = res?.data;

    if (!saved?._id) throw new Error("Save failed");

    navigate(`/posts/${saved._id}`);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">

      <Input label="Title" {...register("title")} />

      <RTE name="content" control={control} />

      <Input type="file" {...register("image")} />

      {post?.image && (
        <img src={post.image} className="w-full rounded" />
      )}

      <Select options={["active", "inactive"]} {...register("status")} />

      <Button type="submit">
        {post ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}