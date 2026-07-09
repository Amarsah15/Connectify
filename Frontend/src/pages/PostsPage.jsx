import React, { useEffect } from "react";
import { usePostsStore } from "../store/postsStore";
import PostCard from "../components/posts/PostCard";
import { PostCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Sidebar from "../components/common/Sidebar";
import { FileText } from "lucide-react";

const PostsPage = () => {
  const { posts, isFetchingPosts, getAllPosts } = usePostsStore();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  if (isFetchingPosts) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
            <Sidebar />
          </div>
          <div className="lg:col-span-3 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Column */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
          <Sidebar />
        </div>

        {/* Posts Content Column */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-6">All Posts</h1>

          {posts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No posts available"
              subtitle="Be the first to share something with the community!"
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PostsPage;
