import React from "react";
import { blogService } from "../api/services/blogService";
import { Link, useNavigate } from "react-router-dom";

function PostCard({ post, currentUser }) {
  const navigate = useNavigate();

  const isAuthor =
    currentUser?._id?.toString() ===
    (post.owner?._id?.toString() || post.owner?.toString());

  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      await blogService.deleteBlog(post._id); // ✅ FIXED
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/posts/${post._id}`)} // ✅ FIXED
    >
      <div className="h-48 bg-gray-200">
        {post.image && (
          <img src={post.image} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4">
        <h2 className="font-bold text-lg line-clamp-2">{post.title}</h2>

        <p className="text-sm text-gray-600 line-clamp-3">
          {post.content}
        </p>

        {isAuthor && (
          <div className="flex gap-3 mt-4">
            <Link
              to={`/posts/${post._id}/edit`} // ✅ FIXED
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600"
            >
              Edit
            </Link>

            <button onClick={handleDelete} className="text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;