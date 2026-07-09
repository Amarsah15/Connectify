import Notification from "../models/Notification.js";

/**
 * Helper: create a notification (skip self-notifications).
 * Called from other controllers after DB writes succeed.
 */
export const createNotification = async ({ recipient, actor, type, post }) => {
  // Skip self-notifications
  if (recipient.toString() === actor.toString()) return null;

  const notification = new Notification({
    recipient,
    actor,
    type,
    post: post || undefined,
  });

  await notification.save();

  // Emit via Socket.IO if available
  try {
    const { getIO, getUserSockets } = await import("../../socket.js");
    const io = getIO();
    if (io) {
      const populated = await Notification.findById(notification._id)
        .populate("actor", "name profilePicture role")
        .populate("post", "content");

      const recipientSockets = getUserSockets(recipient.toString());
      if (recipientSockets) {
        for (const socketId of recipientSockets) {
          io.to(socketId).emit("notification:new", populated.toObject());
        }
      }
    }
  } catch {}

  return notification;
};

/**
 * GET /api/v1/notifications/
 * List notifications for the current user (newest-first, paginated).
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const total = await Notification.countDocuments({ recipient: userId });
    const notifications = await Notification.find({ recipient: userId })
      .populate("actor", "name profilePicture role")
      .populate("post", "content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      notifications,
      page,
      hasMore: skip + notifications.length < total,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

/**
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({ success: true, unreadCount: count });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/v1/notifications/:id/read
 */
export const markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/v1/notifications/read-all
 */
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all as read",
      error: err.message,
    });
  }
};
