import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commentService } from "../../api/services/commentService";
import { likeService } from "../../api/services/likeService";

function CommentSection({
  blogId,
  currentUser,
}) {
  const navigate = useNavigate();

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
  }, [blogId, currentUser]);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const commentsData =
        await commentService.getComments(
          blogId
        );

      // Get liked comments for user
      let likedCommentIds = [];

      if (currentUser) {
        try {
          const likedComments =
            await likeService.getLikedComments();

          likedCommentIds =
            likedComments?.data?.map(
              (like) =>
                String(
                  like.comment?._id
                )
            ) || [];
        } catch {
          likedCommentIds = [];
        }
      }

      // Attach likes to comments
      const commentsWithLikes =
        await Promise.all(
          commentsData.map(
            async (comment) => {
              try {
                const countRes =
                  await likeService.getCommentLikeCount(
                    comment._id
                  );

                const likeCount =
                  countRes?.data
                    ?.likeCount || 0;

                return {
                  ...comment,
                  likeCount,
                  likedByMe:
                    likedCommentIds.includes(
                      String(
                        comment._id
                      )
                    ),
                };
              } catch {
                return {
                  ...comment,
                  likeCount: 0,
                  likedByMe: false,
                };
              }
            }
          )
        );

      setComments(
        commentsWithLikes
      );
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error
      );
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD COMMENT
  // =========================
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (!newComment.trim())
        return;

      try {
        setSubmitting(true);

        const newCommentData =
          await commentService.addComment(
            blogId,
            newComment.trim()
          );

        if (
          newCommentData?._id
        ) {
          setComments(
            (prev) => [
              {
                ...newCommentData,
                likeCount: 0,
                likedByMe:
                  false,
              },
              ...prev,
            ]
          );
        }

        setNewComment("");
      } catch (err) {
        console.error(
          "Add comment failed:",
          err
        );
        alert(
          "Failed to post comment"
        );
      } finally {
        setSubmitting(false);
      }
    };

  // =========================
  // DELETE COMMENT
  // =========================
  const handleDelete =
    async (commentId) => {
      const confirmDelete =
        window.confirm(
          "Delete comment?"
        );

      if (!confirmDelete)
        return;

      try {
        await commentService.deleteComment(
          commentId
        );

        setComments(
          (prev) =>
            prev.filter(
              (c) =>
                c._id !==
                commentId
            )
        );
      } catch (err) {
        console.error(
          "Delete failed:",
          err
        );
        alert(
          "Failed to delete comment"
        );
      }
    };

  // =========================
  // UPDATE COMMENT
  // =========================
  const handleUpdate =
    async (commentId) => {
      if (
        !editContent.trim()
      )
        return;

      try {
        const updatedComment =
          await commentService.updateComment(
            commentId,
            editContent.trim()
          );

        setComments(
          (prev) =>
            prev.map((c) =>
              c._id ===
              commentId
                ? {
                    ...c,
                    content:
                      updatedComment?.content ??
                      editContent,
                  }
                : c
            )
        );

        setEditingId(
          null
        );
        setEditContent("");
      } catch (err) {
        console.error(
          "Update failed:",
          err
        );
        alert(
          "Failed to update comment"
        );
      }
    };

  // =========================
  // LIKE / UNLIKE COMMENT
  // =========================
  const handleCommentLike =
    async (commentId) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const comment =
          comments.find(
            (c) =>
              c._id ===
              commentId
          );

        if (!comment)
          return;

        if (
          comment.likedByMe
        ) {
          await likeService.unlikeComment(
            commentId
          );

          setComments(
            (prev) =>
              prev.map(
                (c) =>
                  c._id ===
                  commentId
                    ? {
                        ...c,
                        likedByMe:
                          false,
                        likeCount:
                          Math.max(
                            c.likeCount -
                              1,
                            0
                          ),
                      }
                    : c
              )
          );
        } else {
          await likeService.likeComment(
            commentId
          );

          setComments(
            (prev) =>
              prev.map(
                (c) =>
                  c._id ===
                  commentId
                    ? {
                        ...c,
                        likedByMe:
                          true,
                        likeCount:
                          c.likeCount +
                          1,
                      }
                    : c
              )
          );
        }
      } catch (err) {
        console.error(
          "Like failed:",
          err
        );
      }
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-4">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        Comments (
        {
          comments.length
        }
        )
      </h2>

      {/* COMMENT FORM */}
      {currentUser ? (
        <form
          onSubmit={
            handleSubmit
          }
          className="mb-6"
        >
          <textarea
            value={
              newComment
            }
            onChange={(
              e
            ) =>
              setNewComment(
                e.target
                  .value
              )
            }
            className="w-full border p-3 rounded-lg"
            placeholder="Write a comment..."
            rows={4}
          />

          <button
            type="submit"
            disabled={
              submitting
            }
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Posting..."
              : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-4">
          Please login to
          comment
        </p>
      )}

      {/* COMMENT LIST */}
      {comments.length ===
      0 ? (
        <p className="text-gray-500">
          No comments yet.
        </p>
      ) : (
        comments.map((c) => {
          const isAuthor =
            currentUser &&
            String(
              currentUser._id
            ) ===
              String(
                c.user?._id
              );

          return (
            <div
              key={c._id}
              className="border p-4 mb-3 rounded-lg shadow-sm"
            >
              <div className="font-semibold text-sm text-gray-800">
                {c.user
                  ?.username ||
                  "User"}
              </div>

              {editingId ===
              c._id ? (
                <>
                  <textarea
                    value={
                      editContent
                    }
                    onChange={(
                      e
                    ) =>
                      setEditContent(
                        e
                          .target
                          .value
                      )
                    }
                    className="w-full border p-2 mt-2 rounded"
                    rows={3}
                  />

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() =>
                        handleUpdate(
                          c._id
                        )
                      }
                      className="text-green-600 text-sm"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(
                          null
                        );
                        setEditContent(
                          ""
                        );
                      }}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mt-2">
                    {
                      c.content
                    }
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    {/* LIKE */}
                    <button
                      onClick={() =>
                        handleCommentLike(
                          c._id
                        )
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {c.likedByMe
                        ? "💔 Unlike"
                        : "👍 Like"}{" "}
                      (
                      {
                        c.likeCount
                      }
                      )
                    </button>

                    {/* OWNER ACTIONS */}
                    {isAuthor && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(
                              c._id
                            );
                            setEditContent(
                              c.content
                            );
                          }}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              c._id
                            )
                          }
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
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