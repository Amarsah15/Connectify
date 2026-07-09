import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Check,
  CheckCheck,
} from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

const iconMap = {
  like: { icon: Heart, color: "text-pink-500" },
  comment: { icon: MessageCircle, color: "text-blue-500" },
  follow: { icon: UserPlus, color: "text-brand-600 dark:text-brand-400" },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60));

  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  if (diff < 10080) return `${Math.floor(diff / 1440)}d ago`;
  return date.toLocaleDateString();
};

const getMessage = (notification) => {
  const name = notification.actor?.name || "Someone";
  switch (notification.type) {
    case "like":
      return (
        <>
          <strong>{name}</strong> liked your post
        </>
      );
    case "comment":
      return (
        <>
          <strong>{name}</strong> commented on your post
        </>
      );
    case "follow":
      return (
        <>
          <strong>{name}</strong> started following you
        </>
      );
    default:
      return (
        <>
          <strong>{name}</strong> interacted with you
        </>
      );
  }
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    isFetching,
    hasMore,
    page,
    fetchNotifications,
    markRead,
    markAllRead,
    unreadCount,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    fetchNotifications(page + 1);
  };

  const handleClick = (notification) => {
    if (!notification.read) {
      markRead(notification._id);
    }

    // Navigate based on type
    if (notification.type === "follow") {
      navigate(`/profile/${notification.actor?._id}`);
    } else if (notification.post?._id) {
      navigate("/feed");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck size={16} />
            Mark all read
          </Button>
        )}
      </div>

      {isFetching && notifications.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          subtitle="When someone interacts with your posts or follows you, you'll see it here."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const typeConfig = iconMap[notification.type] || iconMap.like;
            const Icon = typeConfig.icon;

            return (
              <button
                key={notification._id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer
                  ${
                    notification.read
                      ? "bg-[var(--surface)] border-[var(--border-light)] hover:bg-[var(--surface-2)]"
                      : "bg-brand-600/5 border-brand-600/15 hover:bg-brand-600/10"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <Avatar
                      src={notification.actor?.profilePicture}
                      name={notification.actor?.name || "User"}
                      size="sm"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                        bg-[var(--surface)] border border-[var(--border-light)]
                        flex items-center justify-center`}
                    >
                      <Icon size={10} className={typeConfig.color} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text)] leading-relaxed">
                      {getMessage(notification)}
                    </p>
                    {notification.post?.content && (
                      <p className="text-xs text-[var(--text-faint)] mt-1 truncate">
                        "{notification.post.content}"
                      </p>
                    )}
                    <span className="text-xs text-[var(--text-faint)] mt-1 block">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })}

          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                loading={isFetching}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
