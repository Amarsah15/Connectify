import React, { useEffect, useState } from "react";
import { Pencil, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProfileCard from "../components/profile/ProfileCard";
import EditProfile from "../components/profile/EditProfile";
import PostCard from "../components/posts/PostCard";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { FileText } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const {
    profile,
    userPosts,
    isFetchingProfile,
    getUserProfile,
    removeUserPost,
  } = useProfileStore();

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  if (isFetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">
          You must be logged in to view this page.
        </p>
      </div>
    );
  }

  const displayProfile = profile || authUser;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      {editing ? (
        <EditProfile
          profile={displayProfile}
          onProfileUpdated={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="relative">
          <ProfileCard
            profile={displayProfile}
            postsCount={userPosts.length}
          />
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              as="link"
              to="/dashboard"
            >
              <LayoutDashboard size={16} className="text-brand-600 dark:text-brand-400" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} />
              Edit
            </Button>
          </div>
        </div>
      )}

      {/* User Posts */}
      <h2 className="text-xl font-semibold text-[var(--text)] mt-8 mb-4">
        My Posts
      </h2>

      {userPosts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          subtitle="Start sharing your thoughts with the community."
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
    </main>
  );
};

export default ProfilePage;
