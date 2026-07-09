import { create } from "zustand";
import { axiosInstance } from "../utils/api";
import toast from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isFetching: false,
  hasMore: true,
  page: 1,

  fetchNotifications: async (page = 1) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get(`/notifications?page=${page}&limit=15`);
      if (page === 1) {
        set({
          notifications: res.data.notifications,
          hasMore: res.data.hasMore,
          page: 1,
        });
      } else {
        set((state) => ({
          notifications: [...state.notifications, ...res.data.notifications],
          hasMore: res.data.hasMore,
          page,
        }));
      }
    } catch (error) {
      console.log("Error fetching notifications", error);
    } finally {
      set({ isFetching: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get("/notifications/unread-count");
      set({ unreadCount: res.data.unreadCount });
    } catch {}
  },

  markRead: async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  markAllRead: async () => {
    try {
      await axiosInstance.patch("/notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
      toast.success("All notifications marked as read");
    } catch {}
  },

  // Called from Socket.IO listener
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0, page: 1, hasMore: true });
  },
}));
