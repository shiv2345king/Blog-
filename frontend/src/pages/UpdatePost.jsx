import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../api/services/blogService";
import PostForm from "../components/Post/PostForm";

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await blogService.getBlog(id);

        const blog = res?.data;

        if (!blog?._id) return navigate("/");

        setPost(blog);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Not found</div>;

  return <PostForm post={post} />;
}

export default UpdatePost;