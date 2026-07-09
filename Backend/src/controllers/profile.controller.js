import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await User.findById(userId)
      .select("-password")
      .populate("followers", "name username profilePicture bio headline role")
      .populate("following", "name username profilePicture bio headline role");
    const posts = await Post.find({ author: userId })
      .populate("author", "name username headline profilePicture role")
      .sort({ createdAt: -1 });

    if (!profile) return res.status(404).json({ message: "User not found" });

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const postObj = post.toObject();
        postObj.commentsCount = commentsCount;
        postObj.likedByMe = post.likes.some((id) => id.toString() === userId.toString());
        return postObj;
      })
    );

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      profile,
      posts: postsWithMeta,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, bio, headline, username, profilePicture } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (headline !== undefined) updateData.headline = headline;
    if (username) {
      const normalizedUsername = username.trim().toLowerCase();
      if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
        return res.status(400).json({
          success: false,
          message: "Username can only contain alphanumeric characters and underscores.",
        });
      }
      const existing = await User.findOne({ username: normalizedUsername, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken.",
        });
      }
      updateData.username = normalizedUsername;
    }

    if (profilePicture) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
          folder: "connectify_avatars",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        });
        updateData.profilePicture = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture to Cloudinary",
          error: uploadError.message,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(userId);
    const query = isObjectId ? { _id: userId } : { username: userId.toLowerCase() };

    const profile = await User.findOne(query)
      .select("name username bio headline profilePicture role isBanned createdAt followers following")
      .populate("followers", "name username profilePicture bio headline role")
      .populate("following", "name username profilePicture bio headline role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await Post.find({ author: profile._id })
      .populate("author", "name username headline profilePicture role")
      .sort({ createdAt: -1 });

    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded._id;
      } catch {}
    }

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const postObj = post.toObject();
        postObj.commentsCount = commentsCount;
        postObj.likedByMe = currentUserId
          ? post.likes.some((id) => id.toString() === currentUserId.toString())
          : false;
        return postObj;
      })
    );

    res.status(200).json({
      success: true,
      profile,
      posts: postsWithMeta,
    });
  } catch (error) {
    console.error("Public profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public profile",
    });
  }
};

// ─── Dashboard Stats ───
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, posts, commentsCount] = await Promise.all([
      User.findById(userId).select("followers following createdAt"),
      Post.find({ author: userId }),
      Comment.countDocuments({ author: userId }),
    ]);

    // Total likes received across all posts
    const totalLikesReceived = posts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );

    // Recent activity: posts per week (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const recentPosts = posts.filter((p) => p.createdAt >= fourWeeksAgo);
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (3 - i) * 7 - 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (3 - i) * 7);

      return {
        week: `W${i + 1}`,
        posts: recentPosts.filter(
          (p) => p.createdAt >= weekStart && p.createdAt < weekEnd
        ).length,
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        postsCount: posts.length,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        totalLikesReceived,
        commentsCount,
        memberSince: user.createdAt,
        weeklyActivity: weeklyData,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

// ─── Update Password ───
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};
