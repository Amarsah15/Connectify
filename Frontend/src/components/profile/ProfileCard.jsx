import React from "react";
import { Mail, Calendar } from "lucide-react";

const ProfileCard = ({ profile, postsCount }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
        <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
          <img
            src={
              profile?.profilePicture ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${profile?.name}`
            }
            alt={profile?.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.name}
            </h1>
            {profile?.role && profile.role !== "user" && (
              <span className="inline-flex self-center sm:self-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-linkedin-blue capitalize">
                {profile.role}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-gray-600 mb-4">
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              <Mail size={16} />
              <span className="text-sm">{profile?.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              <Calendar size={16} />
              <span className="text-sm">
                Joined {formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>

          {profile?.bio && <p className="text-gray-700 mb-4">{profile?.bio}</p>}

          <div className="flex justify-center sm:justify-start space-x-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg text-gray-900">
                {postsCount || 0}
              </div>
              <div className="text-gray-500">Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
