import React, { useState } from "react";
import { Ban, Trash2, Heart, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "../../store/postsStore";
import { useAuthStore } from "../../store/authStore";
import { useModerationStore } from "../../store/moderationStore";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { ConfirmModal } from "../ui/Modal";

const ROLE_LEVELS = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

const PostCard = ({ post, onPostDeleted }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { deletePost, toggleLike, fetchComments, addComment, deleteComment } =
    usePostsStore();
  const { toggleUserBan } = useModerationStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBanning, setIsBanning] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Like animation
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isOwner = authUser?._id === post?.author?._id;
  const canDeletePost =
    isOwner ||
    authUser?.role === "admin" ||
    (authUser?.role === "moderator" && post?.author?.role !== "admin");
  const canBanAuthor =
    post?.author?._id &&
    !isOwner &&
    ROLE_LEVELS[authUser?.role] > ROLE_LEVELS[post?.author?.role || "user"];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
      console.log("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBanAuthor = async () => {
    setIsBanning(true);
    try {
      await toggleUserBan(post.author._id);
    } catch (error) {
      console.log("Failed to ban user:", error);
    } finally {
      setIsBanning(false);
      setShowBanModal(false);
    }
  };

  const handleProfileNavigation = (authorObj) => {
    if (!authorObj) return;
    const ident = authorObj.username || authorObj._id;
    if (authUser?._id === authorObj._id) {
      navigate("/profile");
    } else {
      navigate(`/profile/${ident}`);
    }
  };

  const handleLike = async () => {
    setLikeAnimating(true);
    try {
      await toggleLike(post._id);
    } catch {}
    setTimeout(() => setLikeAnimating(false), 300);
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true);
      try {
        const fetched = await fetchComments(post._id);
        setComments(fetched);
      } catch {}
      setIsLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const [replyingToId, setReplyingToId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [isSubmittingReply, setIsSubmittingReply] = useState({});

  const handleAddComment = async (e, parentCommentId = null) => {
    e.preventDefault();
    const text = parentCommentId ? replyTexts[parentCommentId] : commentText;
    if (!text || !text.trim()) return;

    if (parentCommentId) {
      setIsSubmittingReply((prev) => ({ ...prev, [parentCommentId]: true }));
    } else {
      setIsSubmittingComment(true);
    }

    try {
      const newComment = await addComment(post._id, text.trim(), parentCommentId);
      setComments((prev) => [...prev, newComment]);
      if (parentCommentId) {
        setReplyTexts((prev) => ({ ...prev, [parentCommentId]: "" }));
        setReplyingToId(null);
      } else {
        setCommentText("");
      }
    } catch {}

    if (parentCommentId) {
      setIsSubmittingReply((prev) => ({ ...prev, [parentCommentId]: false }));
    } else {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, post._id);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {}
  };

  const roleBadgeColor = {
    admin: "red",
    moderator: "yellow",
    user: "gray",
  };

  return (
    <>
      <Card className="mb-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => handleProfileNavigation(post?.author)}
              className="cursor-pointer shrink-0"
            >
              <Avatar
                src={post?.author?.profilePicture}
                name={post?.author?.name || "User"}
                size="md"
              />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  className="font-semibold text-sm text-[var(--text)] hover:text-brand-600 dark:hover:text-brand-400
                    transition-colors cursor-pointer text-left truncate"
                  onClick={() => handleProfileNavigation(post?.author)}
                >
                  {post?.author?.name}
                </button>
                {post?.author?.username && (
                  <span className="text-xs text-[var(--text-faint)]">
                    @{post.author.username}
                  </span>
                )}
                {post?.author?.role && post.author.role !== "user" && (post.author.role !== "admin" || ["admin", "moderator"].includes(authUser?.role)) && (
                  <Badge color={roleBadgeColor[post.author.role]} size="sm">
                    {post.author.role}
                  </Badge>
                )}
              </div>
              {post?.author?.headline && (
                <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-normal max-w-md">
                  {post.author.headline}
                </div>
              )}
            </div>
          </div>

          {/* Actions & Timestamp on the Right */}
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <span className="text-[10px] md:text-xs text-[var(--text-faint)] whitespace-nowrap">
              {formatDate(post?.createdAt)}
            </span>
            {(canBanAuthor || canDeletePost) && (
              <div className="flex items-center gap-0.5">
                {canBanAuthor && (
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--danger)]
                      hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Ban author"
                  >
                    <Ban size={16} />
                  </button>
                )}
                {canDeletePost && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--danger)]
                      hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className="text-[var(--text)] whitespace-pre-wrap break-words leading-relaxed">
            {post?.content && post.content.length > 1000 && !isExpanded
              ? `${post.content.slice(0, 1000)}... `
              : post?.content}
            {post?.content && post.content.length > 1000 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-brand-600 dark:text-brand-400 hover:underline font-semibold ml-1 cursor-pointer inline"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>

        {/* Like/Comment action row */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-light)]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-all cursor-pointer
              ${
                post?.likedByMe
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-[var(--text-faint)] hover:text-brand-600 dark:hover:text-brand-400"
              }
              ${likeAnimating ? "scale-125" : "scale-100"}`}
            style={{ transition: "transform 0.2s ease, color 0.2s ease" }}
          >
            <Heart
              size={16}
              className={post?.likedByMe ? "fill-current" : ""}
            />
            <span>{post?.likesCount || 0}</span>
          </button>
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 text-sm text-[var(--text-faint)]
              hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            <span>{post?.commentsCount || 0}</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
            {/* Add comment form */}
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <Avatar
                src={authUser?.profilePicture}
                name={authUser?.name || "User"}
                size="sm"
                className="shrink-0 mt-0.5"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]
                    text-sm text-[var(--text)] placeholder-[var(--text-faint)]
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                    transition-all"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>

            {/* Comments list */}
            {isLoadingComments ? (
              <div className="text-sm text-[var(--text-faint)] text-center py-4">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-[var(--text-faint)] text-center py-3">
                No comments yet. Be the first!
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {comments.filter(c => !c.parentComment).map((comment) => {
                  const commentReplies = comments.filter(r => {
                    if (!r.parentComment) return false;
                    const pid = typeof r.parentComment === "string" ? r.parentComment : r.parentComment._id;
                    return pid === comment._id;
                  });

                  return (
                    <div key={comment._id} className="space-y-2">
                      {/* Top-level Comment */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProfileNavigation(comment.author)}
                          className="cursor-pointer shrink-0"
                        >
                          <Avatar
                            src={comment.author?.profilePicture}
                            name={comment.author?.name || "User"}
                            size="xs"
                          />
                        </button>
                        <div className="flex-1">
                          <div className="bg-[var(--surface-2)] rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleProfileNavigation(comment.author)}
                                className="text-sm font-semibold text-[var(--text)] hover:text-brand-600
                                  dark:hover:text-brand-400 transition-colors cursor-pointer"
                              >
                                {comment.author?.name}
                              </button>
                              {(authUser?._id === comment.author?._id ||
                                ["moderator", "admin"].includes(authUser?.role)) && (
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="p-0.5 text-[var(--text-faint)] hover:text-[var(--danger)]
                                    transition-colors cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-[var(--text-muted)] break-words leading-relaxed mt-0.5">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 ml-3 text-xs text-[var(--text-faint)]">
                            <span>{formatDate(comment.createdAt)}</span>
                            <button
                              onClick={() => {
                                setReplyingToId(replyingToId === comment._id ? null : comment._id);
                                setReplyTexts(prev => ({ ...prev, [comment._id]: "" }));
                              }}
                              className="hover:text-brand-600 dark:hover:text-brand-400 font-semibold cursor-pointer transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Reply Input Form */}
                      {replyingToId === comment._id && (
                        <form
                          onSubmit={(e) => handleAddComment(e, comment._id)}
                          className="flex gap-2 ml-8 mt-2"
                        >
                          <Avatar
                            src={authUser?.profilePicture}
                            name={authUser?.name || "User"}
                            size="xs"
                            className="shrink-0 mt-0.5"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={replyTexts[comment._id] || ""}
                              onChange={(e) =>
                                setReplyTexts((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]
                                text-xs text-[var(--text)] placeholder-[var(--text-faint)]
                                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                transition-all"
                              maxLength={1000}
                            />
                            <button
                              type="submit"
                              disabled={
                                !(replyTexts[comment._id] || "").trim() ||
                                isSubmittingReply[comment._id]
                              }
                              className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700
                                disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Comment Replies */}
                      {commentReplies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex gap-2 ml-8 pl-3 border-l-2 border-[var(--border-light)] mt-2"
                        >
                          <button
                            onClick={() => handleProfileNavigation(reply.author)}
                            className="cursor-pointer shrink-0"
                          >
                            <Avatar
                              src={reply.author?.profilePicture}
                              name={reply.author?.name || "User"}
                              size="xs"
                            />
                          </button>
                          <div className="flex-1">
                            <div className="bg-[var(--surface-2)] rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  onClick={() => handleProfileNavigation(reply.author)}
                                  className="text-xs font-semibold text-[var(--text)] hover:text-brand-600
                                    dark:hover:text-brand-400 transition-colors cursor-pointer"
                                >
                                  {reply.author?.name}
                                </button>
                                {(authUser?._id === reply.author?._id ||
                                  ["moderator", "admin"].includes(authUser?.role)) && (
                                  <button
                                    onClick={() => handleDeleteComment(reply._id)}
                                    className="p-0.5 text-[var(--text-faint)] hover:text-[var(--danger)]
                                      transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-[var(--text-muted)] break-words leading-relaxed mt-0.5">
                                {reply.content}
                              </p>
                            </div>
                            <span className="text-[10px] text-[var(--text-faint)] ml-3">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
      />

      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanAuthor}
        title={`Ban ${post?.author?.name}?`}
        message="This will prevent the user from accessing their account."
        confirmText="Ban user"
        loading={isBanning}
      />
    </>
  );
};

export default PostCard;
