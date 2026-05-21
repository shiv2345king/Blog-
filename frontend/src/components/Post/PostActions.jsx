import React, { useEffect, useState } from "react";
import { likeService } from "../../api/services/likeService";

export default function PostActions({ postId }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await likeService.getBlogLikeCount(postId);
        
        console.log("LIKE RESPONSE:", response);

        // ✅ CORRECT: apiCall returns raw backend response
        const count = Number(response?.data?.likeCount || 0);

        setLikes(count);
      } catch (err) {
        console.error(err);
        setLikes(0);
      }
    };

    if (postId) {
      fetchLikes();
    }
  }, [postId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await likeService.unlikeBlog(postId);
        setLikes((prev) => Math.max(prev - 1, 0));
        setLiked(false);
      } else {
        await likeService.likeBlog(postId);
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  return (
    <div className="mt-6 flex items-center gap-4">
      <button
        onClick={handleLike}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {liked ? "💔 Unlike" : "👍 Like"} ({likes})
      </button>
    </div>
  );
}