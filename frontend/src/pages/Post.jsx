import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

import { blogService } from "../api/services/blogService";
import { likeService } from "../api/services/likeService";

import { Button, Container } from "../components";
import CommentSection from "../components/Post/CommentSection.jsx";

export default function Post() {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  // =========================
  // CHECK AUTHOR
  // =========================
  const isAuthor =
    post && user
      ? String(post.owner?._id || post.owner) ===
        String(user?._id || user?.user?._id)
      : false;

  // =========================
  // REQUIRE LOGIN
  // =========================
  const requireAuth = (callback) => {
    if (!user) {
      navigate("/login");
      return;
    }

    callback();
  };

  // =========================
  // FETCH POST
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        setLoading(true);

        // =========================
        // FETCH BLOG
        // =========================
        const blogRes =
          await blogService.getBlog(id);

        const blog =
          blogRes?.data ||
          blogRes?.blog ||
          blogRes;

        if (!blog?._id) {
          navigate("/");
          return;
        }

        setPost(blog);

        // =========================
        // FETCH LIKE COUNT
        // PUBLIC ROUTE
        // =========================
        try {
          const likeRes =
            await likeService.getBlogLikeCount(
              blog._id
            );

          const count = Number(
            likeRes?.data?.likeCount || 0
          );

          setLikes(count);
        } catch (err) {
          console.error(
            "Like count fetch failed:",
            err
          );

          setLikes(0);
        }

        // =========================
        // CHECK IF USER LIKED
        // ONLY IF LOGGED IN
        // =========================
        if (user) {
          try {
            const likedBlogs =
              await likeService.getLikedBlogs();

            const likedArray =
              likedBlogs?.data || [];

            const hasLiked =
              likedArray.some(
                (like) =>
                  String(
                    like.blog?._id ||
                      like.blog
                  ) === String(blog._id)
              );

            setLiked(hasLiked);
          } catch (err) {
            console.error(
              "Liked blogs fetch failed:",
              err
            );

            setLiked(false);
          }
        }
      } catch (err) {
        console.error(
          "Post fetch error:",
          err
        );

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  // =========================
  // LIKE / UNLIKE
  // =========================
  const handleLikeToggle = () => {
    requireAuth(async () => {
      try {
        if (!post?._id) return;

        if (liked) {
          await likeService.unlikeBlog(
            post._id
          );

          setLiked(false);

          setLikes((prev) =>
            Math.max(prev - 1, 0)
          );
        } else {
          await likeService.likeBlog(
            post._id
          );

          setLiked(true);

          setLikes((prev) => prev + 1);
        }
      } catch (err) {
        console.error(
          "Like toggle failed:",
          err
        );
      }
    });
  };

  // =========================
  // DELETE POST
  // =========================
  const handleDelete = () => {
    requireAuth(async () => {
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

        alert(
          "Failed to delete post"
        );
      }
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Loading post...
      </div>
    );
  }

  // =========================
  // NO POST
  // =========================
  if (!post) {
    return (
      <div className="text-center py-10">
        Post not found
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        {/* IMAGE */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded-xl shadow"
          />
        )}

        {/* TITLE */}
        <h1 className="text-4xl font-bold mt-6">
          {post.title}
        </h1>

        {/* AUTHOR */}
        <p className="text-gray-500 mt-2">
          By{" "}
          {post.owner?.username ||
            "Unknown"}
        </p>

        {/* LIKE BUTTON */}
        <div className="mt-6">
          <Button
            onClick={handleLikeToggle}
          >
            {liked
              ? "💔 Unlike"
              : "👍 Like"}{" "}
            ({likes})
          </Button>
        </div>

        {/* CONTENT */}
        <div className="prose max-w-none mt-8">
          {parse(post.content || "")}
        </div>

        {/* AUTHOR ACTIONS */}
        {isAuthor && (
          <div className="flex gap-4 mt-8">
            <Link
              to={`/edit-post/${post._id}`}
            >
              <Button>Edit</Button>
            </Link>

            <Button
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}

        {/* COMMENTS */}
        <div className="mt-12">
          <CommentSection
            blogId={post._id}
            currentUser={user}
          />
        </div>
      </div>
    </Container>
  );
}