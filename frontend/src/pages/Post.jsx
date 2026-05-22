import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { blogService } from "../api/services/blogService.js";

import {
  Container,
} from "../components";

// ================= COMPONENTS =================
import PostContent from "../components/Post/PostContent.jsx";
import PostActions from "../components/Post/PostActions.jsx";
import CommentSection from "../components/Post/CommentSection.jsx";
import AIReviewPanel from "../components/Post/AIReviewPanel.jsx";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH POST =================
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const data = await blogService.getBlog(id);

        console.log("POST DATA:", data);

        if (!data?._id) {
          navigate("/");
          return;
        }

        setPost(data);
      } catch (error) {
        console.error("POST FETCH ERROR:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // ================= DELETE =================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await blogService.deleteBlog(post._id);

      navigate("/");
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading post...</p>
      </div>
    );
  }

  // ================= NO POST =================
  if (!post) {
    return (
      <Container>
        <p className="text-center py-10 text-red-500">
          Post not found
        </p>
      </Container>
    );
  }

  // ================= AUTHOR CHECK =================
  const isAuthor =
    currentUser?._id?.toString() ===
    (post.owner?._id?.toString() ||
      post.owner?.toString());

  // ================= PLAIN TEXT FOR AI =================
  const plainTextContent =
    typeof post.content === "string"
      ? post.content.replace(/<[^>]*>/g, "")
      : "";

  // ================= UI =================
  return (
    <Container>
      <div className="max-w-5xl mx-auto py-10">

        {/* POST CONTENT */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <PostContent post={post} />

          {/* AUTHOR */}
          <div className="mt-4 text-gray-600 text-sm">
            By{" "}
            <span className="font-semibold">
              {post.owner?.username || "Unknown"}
            </span>
          </div>

          {/* ACTIONS */}
          <PostActions postId={post._id} />

          {/* AUTHOR CONTROLS */}
          {isAuthor && (
            <div className="flex gap-4 mt-6">

              <Link
                to={`/posts/${post._id}/edit`}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Edit Post
              </Link>

              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete Post
              </button>

            </div>
          )}

        </div>

        {/* AI REVIEW */}
        <div className="mt-8">
          <AIReviewPanel content={plainTextContent} />
        </div>

        {/* COMMENTS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <CommentSection
            blogId={post._id}
            currentUser={currentUser}
          />
        </div>

      </div>
    </Container>
  );
}

export default Post;