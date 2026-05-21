import React, { useEffect, useState } from "react";
import { likeService } from "../../api/services/likeService";
import { useSelector } from "react-redux";

export default function PostActions({ postId }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const user = useSelector((state) => state.user.user);

  // ================= FETCH LIKE COUNT =================
  const fetchLikes = async () => {
    try {
      const res = await likeService.getBlogLikeCount(postId);

      const count =
        res?.data?.data?.likeCount ?? // backend ApiResponse format
        res?.data?.likeCount ??       // fallback
        0;

      setLikes(Number(count));
    } catch (err) {
      console.error("Like fetch error:", err);
      setLikes(0);
    }
  };

  // ================= CHECK IF USER LIKED =================
  const checkLiked = async () => {
    if (!user) return;

    try {
      const likedBlogs = await likeService.getLikedBlogs();

      const isLiked = likedBlogs?.some(
        (b) => String(b._id || b.blog) === String(postId)
      );

      setLiked(!!isLiked);
    } catch (err) {
      setLiked(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchLikes();
      checkLiked();
    }
  }, [postId, user]);

  // ================= LIKE TOGGLE =================
  const handleLike = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      if (liked) {
        await likeService.unlikeBlog(postId);
        setLiked(false);
      } else {
        await likeService.likeBlog(postId);
        setLiked(true);
      }

      // 🔥 IMPORTANT: always re-fetch from DB (source of truth)
      fetchLikes();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="mt-6 flex items-center gap-4">
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded-lg text-white transition ${
          liked ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {liked ? "💔 Unlike" : "👍 Like"} ({likes})
      </button>
    </div>
  );
}