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

  const requireAuth = (fn) => {
    if (!user) {
      navigate("/login");
      return;
    }
    fn();
  };

  // ================= FETCH POST =================
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const res = await blogService.getBlog(id);
        const blog = res?.data || res;

        if (!blog?._id) {
          navigate("/");
          return;
        }

        setPost(blog);

        // ================= LIKE COUNT =================
        const likeRes = await likeService.getBlogLikeCount(blog._id);

        const count =
          likeRes?.data?.data?.likeCount ??
          likeRes?.data?.likeCount ??
          0;

        setLikes(Number(count));

        // ================= USER LIKE STATUS =================
        if (user) {
          const likedBlogs = await likeService.getLikedBlogs();

          const isLiked = likedBlogs?.some(
            (b) => String(b._id || b.blog) === String(blog._id)
          );

          setLiked(!!isLiked);
        } else {
          setLiked(false);
        }
      } catch (err) {
        console.error("Post fetch error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  // ================= LIKE TOGGLE =================
  const handleLike = async () => {
    requireAuth(async () => {
      try {
        if (liked) {
          await likeService.unlikeBlog(post._id);
          setLiked(false);
        } else {
          await likeService.likeBlog(post._id);
          setLiked(true);
        }

        // 🔥 always sync with backend
        const res = await likeService.getBlogLikeCount(post._id);

        const count =
          res?.data?.data?.likeCount ??
          res?.data?.likeCount ??
          0;

        setLikes(Number(count));
      } catch (err) {
        console.error("Like error:", err);
      }
    });
  };

  // ================= DELETE =================
  const deletePost = async () => {
    requireAuth(async () => {
      try {
        await blogService.deleteBlog(post._id);
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <Container>
      {post.image && (
        <img
          src={post.image}
          className="w-full max-h-[500px] object-cover rounded"
          alt="post"
        />
      )}

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>

      <div className="mt-4">
        <Button onClick={handleLike}>
          {liked ? "Unlike" : "Like"} ({likes})
        </Button>
      </div>

      <div className="prose mt-6">{parse(post.content || "")}</div>

      {isAuthor && (
        <div className="flex gap-4 mt-6">
          <Link to={`/posts/${post._id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={deletePost}>Delete</Button>
        </div>
      )}

      <div className="mt-10">
        <CommentSection blogId={post._id} currentUser={user} />
      </div>
    </Container>
  );
}