import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} from "../controllers/notification.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", auth, getNotifications);
notificationRoutes.get("/unread-count", auth, getUnreadCount);
notificationRoutes.patch("/:id/read", auth, markRead);
notificationRoutes.patch("/read-all", auth, markAllRead);

export default notificationRoutes;
