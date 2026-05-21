import React, { useEffect, useState } from "react";
import { commentService } from "../../api/services/commentService";

function CommentSection({ blogId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    if (!blogId) return;
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const res = await commentService.getComments(blogId);
      const list = res?.data ?? res;

      setComments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
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
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete comment?")) return;

    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;

    try {
      const res = await commentService.updateComment(id, editContent.trim());
      const updated = res?.data ?? res;

      setComments((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, content: updated?.content || editContent }
            : c
        )
      );

      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOADING =================
  if (loading) return <div className="p-4">Loading comments...</div>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        Comments ({comments.length})
      </h2>

      {/* ADD COMMENT */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-3 rounded"
            rows={4}
            placeholder="Write a comment..."
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-4">Login to comment</p>
      )}

      {/* LIST */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        comments.map((c) => {
          const commentUserId = c.user?._id || c.user;

          const isAuthor =
            currentUser &&
            String(currentUser._id) === String(commentUserId);

          return (
            <div key={c._id} className="border p-4 mb-3 rounded">
              <div className="text-sm font-semibold">
                {c.user?.username || "User"}
              </div>

              {editingId === c._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border p-2 mt-2 rounded"
                  />

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(c._id)}
                      className="text-green-600"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2">{c.content}</p>

                  {isAuthor && (
                    <div className="flex gap-3 text-xs mt-2">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
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
        })
      )}
    </div>
  );
}

export default CommentSection;