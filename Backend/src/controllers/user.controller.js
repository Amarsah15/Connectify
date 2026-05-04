import User from "../models/User.js";
import Post from "../models/Post.js";

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

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // FOLLOW
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

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

    const isFollowing = currentUser.following.includes(targetUserId);

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
