import React, { useEffect, useState } from "react";
import { commentService } from "../../api/services/commentService";

function CommentSection({ blogId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [likedComments, setLikedComments] = useState([]);

  /* ================= SAFE USER ID ================= */
  const getUserId = (user) => {
    if (!user) return null;

    return typeof user === "object"
      ? user._id || user.id
      : user;
  };

  const currentUserId = getUserId(currentUser);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (blogId) {
      fetchComments();
      fetchLikedComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const res = await commentService.getComments(blogId);

      const data = res?.data ?? res ?? [];

      const commentsWithLikes = await Promise.all(
        data.map(async (comment) => {
          try {
            const likeRes =
              await commentService.getCommentLikeCount(
                comment._id
              );

            return {
              ...comment,
              likeCount:
                likeRes?.data?.likeCount ||
                likeRes?.likeCount ||
                0,
            };
          } catch {
            return {
              ...comment,
              likeCount: 0,
            };
          }
        })
      );

      setComments(
        Array.isArray(commentsWithLikes)
          ? commentsWithLikes
          : []
      );
    } catch (err) {
      console.error("Fetch comments error:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH LIKED COMMENTS ================= */
  const fetchLikedComments = async () => {
    try {
      const res =
        await commentService.getLikedComments();

      const liked = res?.data ?? res ?? [];

      setLikedComments(
        liked.map((l) =>
          String(l.comment?._id)
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD COMMENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      return alert("Login required");
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const res = await commentService.addComment(
        blogId,
        newComment.trim()
      );

      const comment = res?.data ?? res;

      if (comment?._id) {
        setComments((prev) => [
          {
            ...comment,
            likeCount: 0,
          },
          ...prev,
        ]);
      }

      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete comment?")) {
      return;
    }

    try {
      await commentService.deleteComment(id);

      setComments((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;

    try {
      const res =
        await commentService.updateComment(
          id,
          editContent.trim()
        );

      const updated = res?.data ?? res;

      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                content:
                  updated?.content ||
                  editContent,
              }
            : c
        )
      );

      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Update comment error:", err);
    }
  };

  /* ================= LIKE / UNLIKE ================= */
  const handleLike = async (commentId) => {
    try {
      const isLiked =
        likedComments.includes(commentId);

      if (isLiked) {
        await commentService.unlikeComment(
          commentId
        );

        setLikedComments((prev) =>
          prev.filter(
            (id) => id !== commentId
          )
        );

        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likeCount:
                    (c.likeCount || 1) - 1,
                }
              : c
          )
        );
      } else {
        await commentService.likeComment(
          commentId
        );

        setLikedComments((prev) => [
          ...prev,
          commentId,
        ]);

        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likeCount:
                    (c.likeCount || 0) + 1,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h2>

      {/* INPUT */}
      {currentUser ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8"
        >
          <textarea
            value={newComment}
            onChange={(e) =>
              setNewComment(e.target.value)
            }
            className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..."
          />

          <button
            disabled={submitting}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            {submitting
              ? "Posting..."
              : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500">
          Login to comment
        </p>
      )}

      {/* COMMENTS */}
      <div className="space-y-5">
        {comments.map((c) => {
          const commentUserId =
            getUserId(c.user);

          const isAuthor =
            currentUserId &&
            commentUserId &&
            String(currentUserId) ===
              String(commentUserId);

          const isLiked =
            likedComments.includes(c._id);

          return (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {c.user?.username ||
                      "User"}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      c.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                {/* AUTHOR ACTIONS */}
                {isAuthor && (
                  <div className="flex gap-3 text-sm">

                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditContent(
                          c.content
                        );
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(c._id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>

                  </div>
                )}
              </div>

              {/* EDIT MODE */}
              {editingId === c._id ? (
                <div className="mt-4">

                  <textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl p-3"
                  />

                  <div className="flex gap-3 mt-3">

                    <button
                      onClick={() =>
                        handleUpdate(c._id)
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              ) : (
                <>
                  {/* CONTENT */}
                  <p className="mt-4 text-gray-700 leading-7">
                    {c.content}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-5 flex items-center gap-4">

                    <button
                      onClick={() =>
                        handleLike(c._id)
                      }
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        isLiked
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      ❤️ {c.likeCount || 0}
                    </button>

                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommentSection;