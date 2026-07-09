import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useModerationStore } from "../store/moderationStore";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProfileCard from "../components/profile/ProfileCard";
import PostCard from "../components/posts/PostCard";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/Modal";
import { FileText } from "lucide-react";

const ROLE_LEVELS = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const {
    profile,
    userPosts,
    isFetchingProfile,
    getPublicProfile,
    isFollowing,
    followersCount,
    removeUserPost,
    toggleFollow,
    checkFollowStatus,
  } = useProfileStore();
  const { toggleUserBan, deleteUser } = useModerationStore();

  const [showBanModal, setShowBanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => {
    if (userId) {
      getPublicProfile(userId);
      if (authUser) {
        checkFollowStatus(userId);
      }
    }
  }, [userId, authUser, getPublicProfile, checkFollowStatus]);

  if (isFetchingProfile || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleFollow = () => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    toggleFollow(userId);
  };

  const canManageProfile =
    authUser?._id !== userId &&
    ROLE_LEVELS[authUser?.role] > ROLE_LEVELS[profile?.role || "user"];
  const isAdmin = authUser?.role === "admin";

  const handleBanProfile = async () => {
    setIsBanning(true);
    try {
      await toggleUserBan(userId);
      getPublicProfile(userId);
    } finally {
      setIsBanning(false);
      setShowBanModal(false);
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeletingUser(true);
    try {
      await deleteUser(userId);
      navigate("/admin");
    } finally {
      setIsDeletingUser(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header with Actions overlay */}
      <div className="relative">
        <ProfileCard profile={profile} postsCount={userPosts.length} />

        {authUser && authUser._id !== profile._id && (
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <Button
              variant={isFollowing ? "secondary" : "primary"}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>

            {canManageProfile && (
              <Button
                variant="danger-ghost"
                size="sm"
                onClick={() => setShowBanModal(true)}
              >
                {profile.isBanned ? "Unban" : "Ban"}
              </Button>
            )}

            {isAdmin && canManageProfile && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete user
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Posts */}
      <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Posts</h2>

      {userPosts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          subtitle="This user hasn't shared anything yet."
        />
      ) : (
        userPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostDeleted={removeUserPost}
          />
        ))
      )}

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanProfile}
        title={profile.isBanned ? "Unban user" : "Ban user"}
        message={
          profile.isBanned
            ? `Are you sure you want to unban ${profile.name}?`
            : `Are you sure you want to ban ${profile.name}? They will not be able to access their account.`
        }
        confirmText={profile.isBanned ? "Unban" : "Ban user"}
        loading={isBanning}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfile}
        title="Delete user"
        message={`Delete ${profile.name} and all of their posts? This action cannot be undone.`}
        confirmText="Delete user"
        loading={isDeletingUser}
      />
    </main>
  );
};

export default PublicProfilePage;
