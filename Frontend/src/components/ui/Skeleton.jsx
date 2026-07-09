import React from "react";

const Skeleton = ({ className = "", rounded = "rounded-lg" }) => {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-2)] ${rounded} ${className}`}
    />
  );
};

/**
 * Pre-built skeleton for a post card layout
 */
const PostCardSkeleton = () => (
  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10" rounded="rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    <div className="flex gap-4 pt-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

/**
 * Pre-built skeleton for a user card layout
 */
const UserCardSkeleton = () => (
  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] p-4 flex items-center gap-3">
    <Skeleton className="w-12 h-12" rounded="rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

export { PostCardSkeleton, UserCardSkeleton };
export default Skeleton;
