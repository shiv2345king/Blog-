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

  /* ================= AUTHOR CHECK ================= */
  const isAuthor =
    post && user
      ? String(post.owner?._id || post.owner) === String(user?._id)
      : false;

  /* ================= AUTH GUARD ================= */
  const requireAuth = (cb) => {
    if (!user) {
      navigate("/login");
      return;
    }
    cb();
  };

  /* ================= FETCH POST ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await blogService.getBlog(id);
        const blog = res?.data ?? res;

        if (!blog?._id) {
          navigate("/");
          return;
        }

        setPost(blog);

        /* ================= LIKE COUNT ================= */
        try {
          const likeRes = await likeService.getBlogLikeCount(blog._id);
          const count = likeRes?.data?.likeCount ?? 0;
          setLikes(Number(count));
        } catch {
          setLikes(0);
        }

        /* ================= CHECK IF LIKED ================= */
        if (user) {
          try {
            const likedRes = await likeService.getLikedBlogs();

            const likedArray = likedRes?.data ?? likedRes ?? [];

            const hasLiked = likedArray.some((l) =>
              String(l.blog?._id || l.blog) === String(blog._id)
            );

            setLiked(hasLiked);
          } catch {
            setLiked(false);
          }
        }
      } catch (err) {
        console.error("Post load error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user, navigate]);

  /* ================= LIKE TOGGLE ================= */
  const handleLikeToggle = () => {
    requireAuth(async () => {
      try {
        if (!post?._id) return;

        if (liked) {
          await likeService.unlikeBlog(post._id);
          setLiked(false);
          setLikes((p) => Math.max(p - 1, 0));
        } else {
          await likeService.likeBlog(post._id);
          setLiked(true);
          setLikes((p) => p + 1);
        }
      } catch (err) {
        console.error("Like error:", err);
      }
    });
  };

  /* ================= DELETE POST ================= */
  const handleDelete = () => {
    requireAuth(async () => {
      if (!window.confirm("Delete this post?")) return;

      try {
        await blogService.deleteBlog(post._id);
        navigate("/");
      } catch (err) {
        console.error("Delete error:", err);
      }
    });
  };

  /* ================= UI STATES ================= */
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">

        {/* IMAGE */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded-xl"
          />
        )}

        {/* TITLE */}
        <h1 className="text-4xl font-bold mt-6">{post.title}</h1>

        {/* AUTHOR */}
        <p className="text-gray-500 mt-2">
          By {post.owner?.username || "Unknown"}
        </p>

        {/* LIKE */}
        <div className="mt-6">
          <Button onClick={handleLikeToggle}>
            {liked ? "💔 Unlike" : "👍 Like"} ({likes})
          </Button>
        </div>

        {/* CONTENT */}
        <div className="prose max-w-none mt-8">
          {parse(post.content || "")}
        </div>

        {/* ACTIONS */}
        {isAuthor && (
          <div className="flex gap-4 mt-8">
            <Link to={`/posts/${post._id}/edit`}>
              <Button>Edit</Button>
            </Link>

            <Button onClick={handleDelete}>Delete</Button>
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