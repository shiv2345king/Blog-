import React, { useEffect, useState } from "react";
import { commentService } from "../../api/services/commentService";

function CommentSection({
  blogId,
  currentUser,
}) {
  const [comments, setComments] =
    useState([]);

  const [newComment, setNewComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [editContent, setEditContent] =
    useState("");

  // =========================
  // FETCH COMMENTS
  // =========================
  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const commentsData = await commentService.getComments(blogId);

      console.log("🔍 COMMENTS FROM SERVICE:", commentsData);
      console.log("🔍 IS ARRAY?", Array.isArray(commentsData));
      console.log("🔍 LENGTH:", commentsData?.length);

      // ✅ Service already returns the array directly
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD COMMENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      return alert("Login required");
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const newCommentData = await commentService.addComment(
        blogId,
        newComment.trim()
      );

      console.log("🔍 NEW COMMENT DATA:", newCommentData);

      // ✅ Service returns the comment object directly
      if (newCommentData?._id) {
        setComments((prev) => [newCommentData, ...prev]);
      }

      setNewComment("");
    } catch (err) {
      console.error("Add comment failed:", err);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE COMMENT
  // =========================
  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("Delete comment?");

    if (!confirmDelete) return;

    try {
      await commentService.deleteComment(commentId);

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete comment");
    }
  };

  // =========================
  // UPDATE COMMENT
  // =========================
  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const updatedComment = await commentService.updateComment(
        commentId,
        editContent.trim()
      );

      console.log("🔍 UPDATED COMMENT:", updatedComment);

      // ✅ Service returns the comment object directly
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                content: updatedComment?.content || editContent,
              }
            : c
        )
      );

      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update comment");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-4">Loading comments...</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        Comments ({comments.length})
      </h2>

      {/* COMMENT FORM */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="Write a comment..."
            rows={4}
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-4">Please login to comment</p>
      )}

      {/* COMMENT LIST */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((c) => {
          console.log("🔍 RENDERING COMMENT:", c);

          const isAuthor =
            String(currentUser?._id) === String(c.user?._id || c.user);

          return (
            <div
              key={c._id}
              className="border p-4 mb-3 rounded-lg shadow-sm"
            >
              <div className="font-semibold text-sm text-gray-800">
                {c.user?.username || "User"}
              </div>

              {editingId === c._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border p-2 mt-2 rounded"
                    rows={3}
                  />

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleUpdate(c._id)}
                      className="text-sm text-green-600"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="text-sm text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mt-2">{c.content}</p>

                  {isAuthor && (
                    <div className="flex gap-3 text-xs mt-3">
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
        })
      )}
    </div>
  );
}

export default CommentSection;