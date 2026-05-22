import React from "react";
import { blogService } from "../api/services/blogService";
import { Link, useNavigate } from "react-router-dom";

function PostCard({ post, currentUser }) {
  const navigate = useNavigate();

  /* ================= SAFE USER ID ================= */
  const getUserId = (user) => {
    if (!user) return null;

    if (user._id) return user._id;

    if (user.data?._id) return user.data._id;

    if (user.user?._id) return user.user._id;

    return null;
  };

  const currentUserId = getUserId(currentUser);

  const ownerId =
    typeof post.owner === "object"
      ? post.owner?._id
      : post.owner;

  const isAuthor =
    currentUserId &&
    ownerId &&
    String(currentUserId) === String(ownerId);

  /* ================= DELETE ================= */
  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await blogService.deleteBlog(post._id);

      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer border border-gray-100"
      onClick={() => navigate(`/posts/${post._id}`)}
    >

      {/* IMAGE */}
      <div className="h-56 bg-gray-100 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-6">
          {post.content?.replace(/<[^>]+>/g, "")}
        </p>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between">

          <div className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>

          {/* AUTHOR ACTIONS */}
          {isAuthor && (
            <div
              className="flex gap-4"
              onClick={(e) => e.stopPropagation()}
            >

              <Link
                to={`/posts/${post._id}/edit`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;