import React, { useEffect } from "react";
import { usePostsStore } from "../../store/postsStore";
import PostCard from "./PostCard";
import { PostCardSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { FileText } from "lucide-react";

const PostFeed = ({ refreshTrigger, scope }) => {
  const { posts, isFetchingPosts, getAllPosts } = usePostsStore();

  useEffect(() => {
    getAllPosts(scope);
  }, [refreshTrigger, getAllPosts, scope]);

  if (isFetchingPosts) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No posts yet"
        subtitle="Be the first to share something with the community!"
      />
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
