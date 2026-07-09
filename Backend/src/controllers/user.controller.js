import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import { createNotification } from "./notification.controller.js";

const ROLE_LEVELS = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const canManageUser = (actor, target) => {
  if (!actor || !target) return false;
  if (actor._id.toString() === target._id.toString()) return false;
  return ROLE_LEVELS[actor.role] > ROLE_LEVELS[target.role];
};

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const currentUser = await User.findById(currentUserId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(targetUserId);
    const targetUser = isObjectId
      ? await User.findById(targetUserId)
      : await User.findOne({ username: targetUserId.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUserId.toString() === targetUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUserId);
    } else {
      // FOLLOW
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    // Create follow notification (only on follow, not unfollow)
    if (!isFollowing) {
      try {
        await createNotification({
          recipient: targetUser._id,
          actor: currentUserId,
          type: "follow",
        });
      } catch {}
    }

    res.status(200).json({
      success: true,
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Follow toggle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update follow status",
    });
  }
};

export const getFollowStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(targetUserId);
    const targetUser = isObjectId
      ? await User.findById(targetUserId)
      : await User.findOne({ username: targetUserId.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    res.status(200).json({
      success: true,
      following: isFollowing,
    });
  } catch (error) {
    console.error("Follow status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch follow status",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetUser = await User.findById(req.params.userId);

    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!canManageUser(req.user, targetUser)) {
      return res.status(403).json({
        success: false,
        message: "You cannot change this user's role",
      });
    }

    targetUser.role = role;
    await targetUser.save();

    const safeUser = targetUser.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

export const toggleUserBan = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!canManageUser(req.user, targetUser)) {
      return res.status(403).json({
        success: false,
        message: "You cannot ban or unban this user",
      });
    }

    targetUser.isBanned = !targetUser.isBanned;
    targetUser.bannedAt = targetUser.isBanned ? new Date() : null;
    await targetUser.save();

    const safeUser = targetUser.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: targetUser.isBanned
        ? "User banned successfully"
        : "User unbanned successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Toggle ban error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ban status",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!canManageUser(req.user, targetUser)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this user",
      });
    }

    await Post.deleteMany({ author: targetUser._id });
    await Comment.deleteMany({ author: targetUser._id });
    await Notification.deleteMany({
      $or: [{ recipient: targetUser._id }, { actor: targetUser._id }],
    });
    await User.updateMany(
      {},
      {
        $pull: {
          followers: targetUser._id,
          following: targetUser._id,
        },
      }
    );
    await User.findByIdAndDelete(targetUser._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ─── Search Users ───
export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q || q.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};

export const getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    
    const result = await Post.aggregate([
      { $project: { likesCount: { $size: { $ifNull: [ "$likes", [] ] } } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } }
    ]);
    const totalLikes = result[0]?.totalLikes || 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalPosts,
      totalLikes,
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
