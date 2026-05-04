import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/api";

export const useModerationStore = create((set) => ({
  users: [],
  isFetchingUsers: false,
  isUpdatingUser: false,

  getUsers: async () => {
    set({ isFetchingUsers: true });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data.users || [] });
      return res.data.users || [];
    } catch (error) {
      console.log("Error fetching users", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      throw error;
    } finally {
      set({ isFetchingUsers: false });
    }
  },

  updateUserRole: async (userId, role) => {
    set({ isUpdatingUser: true });
    try {
      const res = await axiosInstance.patch(`/users/${userId}/role`, { role });
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? res.data.user : user
        ),
      }));
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error updating role", error);
      toast.error(error.response?.data?.message || "Failed to update role");
      throw error;
    } finally {
      set({ isUpdatingUser: false });
    }
  },

  toggleUserBan: async (userId) => {
    set({ isUpdatingUser: true });
    try {
      const res = await axiosInstance.patch(`/users/${userId}/ban`);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? res.data.user : user
        ),
      }));
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      console.log("Error updating ban", error);
      toast.error(error.response?.data?.message || "Failed to update ban");
      throw error;
    } finally {
      set({ isUpdatingUser: false });
    }
  },

  deleteUser: async (userId) => {
    set({ isUpdatingUser: true });
    try {
      const res = await axiosInstance.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting user", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
      throw error;
    } finally {
      set({ isUpdatingUser: false });
    }
  },
}));
