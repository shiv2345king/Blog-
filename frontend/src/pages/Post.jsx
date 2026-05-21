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

  const isAuthor =
    post && user
      ? String(post.owner?._id || post.owner) === String(user._id)
      : false;

  // =========================
  // PROTECTED ACTION WRAPPER
  // =========================
  const requireAuth = (callback) => {
    if (!user) {
      navigate("/login");
      return;
    }
    callback();
  };

  // =========================
  // FETCH POST DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          navigate("/");
          return;
        }

        setLoading(true);

        const blogRes = await blogService.getBlog(id);

        // ✅ Handle response based on your ApiResponse structure
        const blog = blogRes?.data || blogRes;

        if (!blog?._id) {
          navigate("/");
          return;
        }

        setPost(blog);

        // =========================
        // LIKES (PUBLIC FRIENDLY)
        // =========================
        try {
          const likeRes = await likeService.getBlogLikeCount(blog._id);
          // ✅ FIX: likeRes is already the data from service
          setLikes(Number(likeRes?.likeCount || 0));
        } catch {
          setLikes(0);
        }

        // =========================
        // CHECK IF USER LIKED
        // =========================
        if (user) {
          try {
            const likedBlogs = await likeService.getLikedBlogs();
            // ✅ FIX: likedBlogs is already the array from service
            setLiked(
              likedBlogs.some((b) => String(b._id || b.blog) === String(blog._id))
            );
          } catch {
            setLiked(false);
          }
        }
      } catch (err) {
        console.error("Post fetch error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // =========================
  // LIKE TOGGLE (PROTECTED)
  // =========================
  const handleLikeToggle = async () => {
    requireAuth(async () => {
      if (!post) return;

      try {
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

  // =========================
  // DELETE POST (PROTECTED)
  // =========================
  const deletePost = async () => {
    requireAuth(async () => {
      try {
        await blogService.deleteBlog(post._id);
        navigate("/");
      } catch (err) {
        console.error("Delete error:", err);
      }
    });
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found</div>;
  }

  return (
    <Container>
      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          className="w-full max-h-[500px] object-cover rounded"
          alt="post"
        />
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>

      {/* LIKE BUTTON */}
      <div className="mt-4">
        <Button onClick={handleLikeToggle}>
          {liked ? "Unlike" : "Like"} ({likes})
        </Button>
      </div>

      {/* CONTENT */}
      <div className="prose mt-6">{parse(post.content || "")}</div>

      {/* AUTHOR ACTIONS */}
      {isAuthor && (
        <div className="flex gap-4 mt-6">
          <Link to={`/posts/${post._id}/edit`}>
            <Button>Edit</Button>
          </Link>

          <Button onClick={deletePost}>Delete</Button>
        </div>
      )}

      {/* COMMENTS */}
      <div className="mt-10">
        <CommentSection blogId={post._id} currentUser={user} />
      </div>
    </Container>
  );
}