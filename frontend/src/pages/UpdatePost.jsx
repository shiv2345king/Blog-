import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../api/services/blogService";
import {PostForm} from "../components/index.js";

function UpdatePost() {
  const { id } = useParams(); // ✅ ID based
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return navigate("/");

        setLoading(true);

        const res = await blogService.getBlog(id);
        const blog = res?.data || res;

        if (!blog?._id) return navigate("/");

        setPost(blog);
      } catch (err) {
        console.error("Failed to load post:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Post not found
      </div>
    );
  }

  return (
    <div className="py-8">
      <PostForm post={post} />
    </div>
  );
}

export default UpdatePost;