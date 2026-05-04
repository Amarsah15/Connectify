import { create } from "zustand";
import { axiosInstance } from "../utils/api";
import toast from "react-hot-toast";

export const useProfileStore = create((set) => ({
  profile: null,
  userPosts: [],
  isFetchingProfile: false,
  isUpdatingProfile: false,
  isFollowing: false,
  followersCount: 0,

  getUserProfile: async () => {
    set({ isFetchingProfile: true });
    try {
      const res = await axiosInstance.get("/profile/");
      set({
        profile: res.data.profile,
        userPosts: res.data.posts || [],
      });
      return res.data;
    } catch (error) {
      console.log("Error fetching profile", error);
      toast.error(error.response?.data?.message || "Error fetching profile");
      throw error;
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/profile/update", data);

      // Update the profile in the store
      set({ profile: res.data.user });

      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      console.log("Error updating profile", error);
      toast.error(error.response?.data?.message || "Error updating profile");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Utility function to clear profile data (useful for logout)
  clearProfile: () => {
    set({
      profile: null,
      userPosts: [],
    });
  },

  // Update user posts when a new post is created
  addUserPost: (post) => {
    set((state) => ({
      userPosts: [post, ...state.userPosts],
    }));
  },

  // Remove a post from user posts when deleted
  removeUserPost: (postId) => {
    set((state) => ({
      userPosts: state.userPosts.filter((post) => post._id !== postId),
    }));
  },

  getPublicProfile: async (userId) => {
    set({ isFetchingProfile: true });
    try {
      const res = await axiosInstance.get(`/profile/${userId}`);
      set({
        profile: res.data.profile,
        userPosts: res.data.posts || [],
        followersCount: res.data.profile.followers?.length || 0,
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  checkFollowStatus: async (userId) => {
    const res = await axiosInstance.get(`/users/${userId}/follow-status`);
    set({ isFollowing: res.data.following });
  },

  toggleFollow: async (userId) => {
    const res = await axiosInstance.post(`/users/${userId}/follow`);
    set({
      isFollowing: res.data.following,
      followersCount: res.data.followersCount,
    });
  },
}));
