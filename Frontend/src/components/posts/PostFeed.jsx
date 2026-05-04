import React, { useEffect } from "react";
import { usePostsStore } from "../../store/postsStore";
import PostCard from "./PostCard";
import LoadingSpinner from "../common/LoadingSpinner";

const PostFeed = ({ refreshTrigger }) => {
  const { posts, isFetchingPosts, getAllPosts } = usePostsStore();

  useEffect(() => {
    getAllPosts();
  }, [refreshTrigger, getAllPosts]);

  if (isFetchingPosts) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card p-6 sm:p-8 text-center">
        <div className="text-gray-500 mb-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 text-sm sm:text-base">
          Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
