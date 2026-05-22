import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { blogService } from "../api/services/blogService.js";

import { Container } from "../components/index.js";

import PostContent from "../components/Post/PostContent.jsx";
import PostActions from "../components/Post/PostActions.jsx";
import CommentSection from "../components/Post/CommentSection.jsx";
import AIReviewPanel from "../components/Post/AIReviewPanel.jsx";

function Post() {
  const { id } = useParams();

  const navigate = useNavigate();

  /* ================= REDUX USER ================= */
  const reduxUser = useSelector(
    (state) => state.user.user
  );

  /* ================= STATE ================= */
  const [post, setPost] = useState(null);

  const [loading, setLoading] =
    useState(true);

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
  const currentUserId =
    getUserId(reduxUser);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // ✅ FIXED
        // your service has getBlog() NOT getBlogById()

        const data =
          await blogService.getBlog(id);

        console.log(
          "POST DATA:",
          data
        );

        setPost(data || null);
      } catch (err) {
        console.error(
          "Fetch post failed:",
          err
        );

        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  /* ================= DELETE POST ================= */
  const handleDelete = async () => {
    const confirmDelete =
      window.confirm(
        "Delete this post?"
      );

    if (!confirmDelete) return;

    try {
      await blogService.deleteBlog(
        post._id
      );

      navigate("/");
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

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

  /* ================= POST NOT FOUND ================= */
  if (!post) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-10 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Post not found
            </h2>

            <p className="text-gray-500 mb-6">
              This post may have been
              deleted or does not exist.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </Container>
    );
  }

  /* ================= OWNER CHECK ================= */

  const ownerId =
    typeof post?.owner === "object"
      ? getUserId(post.owner)
      : post?.owner;

  const isAuthor =
    currentUserId &&
    ownerId &&
    String(currentUserId) ===
      String(ownerId);

  console.log("CURRENT USER:", reduxUser);
  console.log(
    "CURRENT USER ID:",
    currentUserId
  );
  console.log("POST OWNER:", post.owner);
  console.log("OWNER ID:", ownerId);
  console.log("IS AUTHOR:", isAuthor);

  /* ================= UI ================= */

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-10 px-4">

        {/* MAIN CARD */}
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-200 shadow-xl">


          {/* CONTENT AREA */}
          <div className="p-6 md:p-10">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              {/* DATE */}
              <div className="text-sm text-gray-400">
                Published on{" "}
                {post?.createdAt
                  ? new Date(
                      post.createdAt
                    ).toLocaleDateString()
                  : ""}
              </div>

              {/* AUTHOR ACTIONS */}
              {isAuthor && (
                <div className="flex items-center gap-4">

                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Edit Post
                  </Link>

                  <button
                    onClick={
                      handleDelete
                    }
                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    Delete Post
                  </button>

                </div>
              )}
            </div>

            {/* POST CONTENT */}
            <PostContent post={post} />

            {/* POST ACTIONS */}
            <div className="mt-10">
              <PostActions
                postId={post._id}
              />
            </div>

            {/* COMMENTS */}
            <div className="mt-14 border-t border-gray-200 pt-10">
              <CommentSection
                blogId={post._id}
                currentUser={
                  reduxUser
                }
              />
            </div>

          </div>
        </div>
      </div>
    </Container>
  );
}

export default Post;