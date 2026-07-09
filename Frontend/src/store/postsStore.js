import { create } from "zustand";
import { axiosInstance } from "../utils/api";
import toast from "react-hot-toast";
import { useProfileStore } from "./profileStore";

const syncPostToProfile = (postId, updateFn) => {
  try {
    const profileStoreState = useProfileStore.getState();
    if (profileStoreState && profileStoreState.userPosts) {
      const hasPost = profileStoreState.userPosts.some((p) => p._id === postId);
      if (hasPost) {
        useProfileStore.setState((state) => ({
          userPosts: state.userPosts.map((post) =>
            post._id === postId ? updateFn(post) : post
          ),
        }));
      }
    }
  } catch (err) {
    console.error("Failed to sync post to profile store:", err);
  }
};

export const usePostsStore = create((set, get) => ({
  posts: [],
  isCreatingPost: false,
  isFetchingPosts: false,
  isDeletingPost: false,

  createPost: async (data) => {
    set({ isCreatingPost: true });
    try {
      const res = await axiosInstance.post("/posts/create", data);

      // Add the new post to the beginning of the posts array
      const currentPosts = get().posts;
      set({ posts: [res.data.post, ...currentPosts] });

      toast.success(res.data.message);
      return res.data.post;
    } catch (error) {
      console.log("Error creating post", error);
      toast.error(error.response?.data?.message || "Error creating post");
      throw error;
    } finally {
      set({ isCreatingPost: false });
    }
  },

  getAllPosts: async (scope) => {
    set({ isFetchingPosts: true });
    try {
      const params = scope ? `?scope=${scope}` : "";
      const res = await axiosInstance.get(`/posts/getAll${params}`);
      set({ posts: res.data.posts });
      return res.data.posts;
    } catch (error) {
      console.log("Error fetching posts", error);
      toast.error(error.response?.data?.message || "Error fetching posts");
      throw error;
    } finally {
      set({ isFetchingPosts: false });
    }
  },

  deletePost: async (postId) => {
    set({ isDeletingPost: true });
    try {
      await axiosInstance.delete(`/posts/${postId}`);

      // Remove locally from posts
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
      }));

      // Also remove locally from profile store posts
      try {
        const profileStoreState = useProfileStore.getState();
        if (profileStoreState && profileStoreState.userPosts) {
          useProfileStore.setState((state) => ({
            userPosts: state.userPosts.filter((p) => p._id !== postId),
          }));
        }
      } catch (err) {
        console.error("Error removing post from profile store:", err);
      }

      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
      console.log("Error deleting post", error);
      throw error;
    } finally {
      set({ isDeletingPost: false });
    }
  },

  // ─── Likes ───
  toggleLike: async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/like`);

      // Update the post in state
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likesCount: res.data.likesCount,
                likedByMe: res.data.liked,
              }
            : post
        ),
      }));

      // Sync to profile posts
      syncPostToProfile(postId, (post) => ({
        ...post,
        likesCount: res.data.likesCount,
        likedByMe: res.data.liked,
      }));

      return res.data;
    } catch (error) {
      toast.error("Failed to toggle like");
      throw error;
    }
  },

  // Update a single post's like data (from socket event)
  updatePostLike: ({ postId, likesCount, liked, userId }) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? { ...post, likesCount }
          : post
      ),
    }));

    // Sync to profile posts
    syncPostToProfile(postId, (post) => ({
      ...post,
      likesCount,
    }));
  },

  // ─── Comments ───
  fetchComments: async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`);
      return res.data.comments;
    } catch (error) {
      toast.error("Failed to load comments");
      throw error;
    }
  },

  addComment: async (postId, content, parentCommentId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comments`, {
        content,
        parentCommentId,
      });

      // Increment comments count locally
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
            : post
        ),
      }));

      // Sync to profile posts
      syncPostToProfile(postId, (post) => ({
        ...post,
        commentsCount: (post.commentsCount || 0) + 1,
      }));

      toast.success("Comment added");
      return res.data.comment;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      throw error;
    }
  },

  deleteComment: async (commentId, postId) => {
    try {
      await axiosInstance.delete(`/posts/comments/${commentId}`);

      // Decrement comments count locally
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, commentsCount: Math.max(0, (post.commentsCount || 1) - 1) }
            : post
        ),
      }));

      // Sync to profile posts
      syncPostToProfile(postId, (post) => ({
        ...post,
        commentsCount: Math.max(0, (post.commentsCount || 1) - 1),
      }));

      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
      throw error;
    }
  },

  getPostsByUserId: async (userId) => {
    try {
      const res = await axiosInstance.get(`/posts/${userId}`);
      return res.data.posts;
    } catch (error) {
      console.log("Error fetching user posts", error);
      toast.error(error.response?.data?.message || "Error fetching user posts");
      throw error;
    }
  },

  // Utility function to clear posts (useful for logout)
  clearPosts: () => {
    set({ posts: [] });
  },
}));
