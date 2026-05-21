import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService } from "../api/services/blogService.js";
import PostForm from "../components/Post/PostForm.js";

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const res = await blogService.getBlog(id);
        const blog = res?.data ?? res;

        if (!blog?._id) {
          navigate("/");
          return;
        }

        setPost(blog);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="py-8">
      <PostForm post={post} />
    </div>
  );
}

export default UpdatePost;