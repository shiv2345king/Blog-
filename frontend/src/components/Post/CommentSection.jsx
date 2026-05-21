import React, { useEffect, useState } from "react";
import { commentService } from "../../api/services/commentService";

function CommentSection({ blogId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    if (blogId) fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const res = await commentService.getComments(blogId);

      // backend returns ApiResponse { data: [...] }
      const data = res?.data ?? res ?? [];

      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch comments error:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD COMMENT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return alert("Login required");
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const res = await commentService.addComment(
        blogId,
        newComment.trim()
      );

      const comment = res?.data ?? res;

      if (comment?._id) {
        setComments((prev) => [comment, ...prev]);
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
    if (!window.confirm("Delete comment?")) return;

    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;

    try {
      const res = await commentService.updateComment(
        id,
        editContent.trim()
      );

      const updated = res?.data ?? res;

      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                content: updated?.content || editContent,
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

  /* ================= SAFE USER ID ================= */
  const getUserId = (user) => {
    if (!user) return null;
    return typeof user === "object"
      ? user._id || user.id
      : user;
  };

  const currentUserId = getUserId(currentUser);

  /* ================= LOADING ================= */
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        Comments ({comments.length})
      </h2>

      {/* INPUT */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="Write a comment..."
          />

          <button
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Login to comment</p>
      )}

      {/* COMMENTS */}
      {comments.map((c) => {
        const commentUserId = getUserId(c.user);

        const isAuthor =
          currentUserId &&
          commentUserId &&
          String(currentUserId) === String(commentUserId);

        return (
          <div key={c._id} className="border p-4 mb-3 rounded">

            {/* USER */}
            <div className="text-sm font-semibold">
              {c.user?.username || "User"}
            </div>

            {/* EDIT MODE */}
            {editingId === c._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-2 mt-2"
                />

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleUpdate(c._id)}
                    className="text-green-600"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2">{c.content}</p>

                {/* EDIT/DELETE */}
                {isAuthor && (
                  <div className="flex gap-3 text-sm mt-2">
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditContent(c.content);
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CommentSection;