import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { blogService } from "../api/services/blogService.js";

import {
  Container,
} from "../components/index.js";

import PostContent from "../components/Post/PostContent.jsx";
import PostActions from "../components/Post/PostActions.jsx";
import CommentSection from "../components/Post/CommentSection.jsx";
import AIReviewPanel from "../components/Post/AIReviewPanel.jsx";

function Post() {
  const { id } = useParams();

  const navigate = useNavigate();

  const reduxUser = useSelector(
    (state) => state.user.user
  );

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= SAFE USER ID ================= */
  const getUserId = (user) => {
    if (!user) return null;

    return (
      user?._id ||
      user?.id ||
      user?.data?._id ||
      user?.user?._id ||
      null
    );
  };

  /* ================= CURRENT USER ================= */
  const currentUserId = getUserId(reduxUser);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // ✅ your service already returns clean blog object
        const data = await blogService.getBlogById(id);

        console.log("POST DATA:", data);

        setPost(data || null);
      } catch (err) {
        console.error("Fetch post failed:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await blogService.deleteBlog(post._id);

      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading post...
      </div>
    );
  }

  /* ================= NO POST ================= */
  if (!post?._id) {
    return (
      <Container>
        <div className="py-20 text-center text-gray-500 text-lg">
          Post not found
        </div>
      </Container>
    );
  }

  /* ================= OWNER ID ================= */
  const ownerId =
    typeof post?.owner === "object"
      ? getUserId(post.owner)
      : post?.owner;

  /* ================= AUTHOR CHECK ================= */
  const isAuthor =
    currentUserId &&
    ownerId &&
    String(currentUserId) === String(ownerId);

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-10">

        {/* POST WRAPPER */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

          {/* IMAGE */}
          {post?.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[450px] object-cover"
            />
          )}

          {/* CONTENT */}
          <div className="p-8">

            {/* AUTHOR ACTIONS */}
            {isAuthor && (
              <div className="flex justify-end gap-4 mb-6">

                <Link
                  to={`/posts/${post._id}/edit`}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Edit Post
                </Link>

                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete Post
                </button>

              </div>
            )}

            {/* POST CONTENT */}
            <PostContent post={post} />

            {/* POST ACTIONS */}
            <PostActions postId={post._id} />

            {/* AI REVIEW */}
            <AIReviewPanel
              content={
                post?.content
                  ?.replace(/<[^>]*>/g, "") || ""
              }
            />

            {/* COMMENTS */}
            <CommentSection
              blogId={post._id}
              currentUser={reduxUser}
            />

          </div>
        </div>
      </div>
    </Container>
  );
}

export default Post;