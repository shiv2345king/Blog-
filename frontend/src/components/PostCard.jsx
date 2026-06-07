import React from "react";
import { blogService } from "../api/services/blogService";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function PostCard({
  post,
  currentUser,
}) {
  const navigate = useNavigate();

  //safe user id getter
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

  //safe current user id
  const currentUserId =
    getUserId(currentUser);

  //safe owner id
  const ownerId =
    typeof post?.owner === "object"
      ? getUserId(post.owner)
      : post?.owner;

  //safe author check
  const isAuthor =
    currentUserId &&
    ownerId &&
    String(currentUserId) ===
      String(ownerId);


  //safe delete handler
  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete =
      window.confirm(
        "Delete this post?"
      );

    if (!confirmDelete) return;

    try {
      await blogService.deleteBlog(
        post._id
      );

      window.location.reload();
    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

      alert(
        "Failed to delete post"
      );
    }
  };

  //safe open post handler
  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div
      onClick={openPost}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {post?.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image Available
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* TITLE */}
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
          {post?.title ||
            "Untitled Post"}
        </h2>

        {/* CONTENT */}
        <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3">
          {post?.content
            ?.replace(/<[^>]*>/g, "")
            ?.slice(0, 180) ||
            "No content"}
        </p>

        {/* AUTHOR */}
        <div className="mt-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase">
            {post?.owner?.username
              ? post.owner.username[0]
              : "U"}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {post?.owner
                ?.username || "Unknown"}
            </p>

            <p className="text-xs text-gray-400">
              {post?.createdAt
                ? new Date(
                    post.createdAt
                  ).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          {/* READ MORE */}
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
            Read More →
          </button>

          {/* ACTIONS */}
          {isAuthor && (
            <div
              className="flex items-center gap-4"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <Link
                to={`/posts/${post._id}/edit`}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
              >
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-sm font-semibold text-red-500 hover:bg-red-100 transition"
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