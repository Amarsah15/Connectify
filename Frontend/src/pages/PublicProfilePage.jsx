import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useModerationStore } from "../store/moderationStore";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProfileCard from "../components/profile/ProfileCard";
import PostCard from "../components/posts/PostCard";

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
    const action = profile.isBanned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} ${profile.name}?`)) {
      return;
    }

    await toggleUserBan(userId);
    getPublicProfile(userId);
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm(`Delete ${profile.name} and all of their posts?`)) {
      return;
    }

    await deleteUser(userId);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-xl shadow p-6">
          <ProfileCard profile={profile} />

          <div className="flex items-center gap-6 mt-4">
            <span className="text-sm text-gray-600">
              <strong>{followersCount}</strong> Followers
            </span>

            <span className="text-sm text-gray-600">
              <strong>{profile.following?.length || 0}</strong> Following
            </span>
          </div>

          {authUser && authUser._id !== userId && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={handleFollow}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-linkedin-blue text-white hover:bg-linkedin-darkblue"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>

              {canManageProfile && (
                <button
                  onClick={handleBanProfile}
                  className="px-5 py-2 rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                >
                  {profile.isBanned ? "Unban user" : "Ban user"}
                </button>
              )}

              {isAdmin && canManageProfile && (
                <button
                  onClick={handleDeleteProfile}
                  className="px-5 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete user
                </button>
              )}
            </div>
          )}
        </div>

        {/* Posts */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Posts</h2>

        {userPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={removeUserPost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
