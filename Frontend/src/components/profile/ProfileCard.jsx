import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Calendar } from "lucide-react";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import { useAuthStore } from "../../store/authStore";

const ProfileCard = ({ profile, postsCount }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const roleBadgeColor = {
    admin: "red",
    moderator: "yellow",
    user: "gray",
  };

  const UserList = ({ users, onClose }) => {
    if (!users || users.length === 0) {
      return (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">
          No users list.
        </p>
      );
    }

    return (
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {users.map((u) => (
          <button
            key={u._id}
            onClick={() => {
              onClose();
              if (u._id === authUser?._id) {
                navigate("/profile");
              } else {
                navigate(`/profile/${u.username || u._id}`);
              }
            }}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-[var(--surface-2)] transition-colors cursor-pointer group"
          >
            <Avatar src={u.profilePicture} name={u.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[var(--text)] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {u.name}
              </div>
              {(u.headline || u.bio) && (
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                  {u.headline || u.bio}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="flex justify-center sm:justify-start">
            <Avatar
              src={profile?.profilePicture}
              name={profile?.name || "User"}
              size="xl"
              className="border-4 border-[var(--surface)] shadow-[var(--shadow-md)]"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-[var(--text)]">
                {profile?.name}
              </h1>
              {profile?.role && profile.role !== "user" && (profile.role !== "admin" || ["admin", "moderator"].includes(authUser?.role)) && (
                <Badge color={roleBadgeColor[profile.role]} size="md">
                  {profile.role}
                </Badge>
              )}
            </div>
            {profile?.username && (
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                @{profile.username}
              </p>
            )}
            {profile?.headline && (
              <p className="text-base font-semibold text-[var(--text)] mt-1 mb-3">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[var(--text-muted)] mb-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={14} />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar size={14} />
                <span className="text-sm">
                  Joined {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>

            {profile?.bio && (
              <p className="text-[var(--text-muted)] mb-4 leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex justify-center sm:justify-start gap-6 text-sm">
              {/* Posts Count */}
              <div className="text-center">
                <div className="font-bold text-lg text-[var(--text)]">
                  {postsCount || 0}
                </div>
                <div className="text-[var(--text-faint)]">Posts</div>
              </div>

              {/* Followers Button */}
              <button
                onClick={() => setIsFollowersOpen(true)}
                className="text-center group hover:opacity-85 focus:outline-none cursor-pointer"
              >
                <div className="font-bold text-lg text-[var(--text)] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {profile?.followers?.length || 0}
                </div>
                <div className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors">
                  Followers
                </div>
              </button>

              {/* Following Button */}
              <button
                onClick={() => setIsFollowingOpen(true)}
                className="text-center group hover:opacity-85 focus:outline-none cursor-pointer"
              >
                <div className="font-bold text-lg text-[var(--text)] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {profile?.following?.length || 0}
                </div>
                <div className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors">
                  Following
                </div>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Followers list modal */}
      <Modal
        isOpen={isFollowersOpen}
        onClose={() => setIsFollowersOpen(false)}
        title="Followers"
      >
        <UserList users={profile?.followers} onClose={() => setIsFollowersOpen(false)} />
      </Modal>

      {/* Following list modal */}
      <Modal
        isOpen={isFollowingOpen}
        onClose={() => setIsFollowingOpen(false)}
        title="Following"
      >
        <UserList users={profile?.following} onClose={() => setIsFollowingOpen(false)} />
      </Modal>
    </>
  );
};

export default ProfileCard;
