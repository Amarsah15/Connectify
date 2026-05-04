import React from "react";
import { Ban, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "../../store/postsStore";
import { useAuthStore } from "../../store/authStore";
import { useModerationStore } from "../../store/moderationStore";

const ROLE_LEVELS = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const PostCard = ({ post, onPostDeleted }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { deletePost } = usePostsStore();
  const { toggleUserBan } = useModerationStore();

  const isOwner = authUser?._id === post?.author?._id;
  const canDeletePost =
    isOwner || ["moderator", "admin"].includes(authUser?.role);
  const canBanAuthor =
    post?.author?._id &&
    !isOwner &&
    ROLE_LEVELS[authUser?.role] > ROLE_LEVELS[post?.author?.role || "user"];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(post._id);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
      console.log("Failed to delete post:", error);
    }
  };

  const handleBanAuthor = async () => {
    if (!window.confirm(`Ban ${post?.author?.name}?`)) return;

    try {
      await toggleUserBan(post.author._id);
    } catch (error) {
      console.log("Failed to ban user:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleProfileNavigation = (clickedUserId) => {
    if (!clickedUserId) return;

    if (authUser?._id === clickedUserId) {
      navigate("/profile");
    } else {
      navigate(`/profile/${clickedUserId}`);
    }
  };

  return (
    <div className="card p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {/* Profile Picture */}
          <img
            src={
              post?.author?.profilePicture ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${post?.author?.name}`
            }
            alt={post?.author?.name}
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => handleProfileNavigation(post?.author?._id)}
          />

          {/* Name + Timestamp */}
          <div>
            <div className="flex items-center space-x-2">
              <h3
                className="font-semibold text-gray-900 cursor-pointer hover:underline"
                onClick={() => handleProfileNavigation(post?.author?._id)}
              >
                {post?.author?.name}
              </h3>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">
                {formatDate(post?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {(canBanAuthor || canDeletePost) && (
          <div className="flex items-center gap-1">
            {canBanAuthor && (
              <button
                onClick={handleBanAuthor}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Ban author"
              >
                <Ban size={18} />
              </button>
            )}
            {canDeletePost && (
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete post"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mt-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post?.content}</p>
      </div>
    </div>
  );
};

export default PostCard;
