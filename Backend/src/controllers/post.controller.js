import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { createNotification } from "./notification.controller.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content required" });
    }

    const newPost = new Post({
      content,
      author: userId,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: err.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const scope = req.query.scope; // "following" or undefined (global)
    const skip = (page - 1) * limit;

    let filter = {};

    // If scope=following, only show posts from followed users + self
    if (scope === "following" && userId) {
      const User = (await import("../models/User.js")).default;
      const currentUser = await User.findById(userId).select("following");
      const followingIds = currentUser?.following || [];
      filter.author = { $in: [...followingIds, userId] };
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("author", "name username bio headline profilePicture role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add commentsCount and likedByMe to each post
    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const postObj = post.toObject();
        postObj.commentsCount = commentsCount;
        postObj.likedByMe = userId
          ? post.likes.some((id) => id.toString() === userId.toString())
          : false;
        return postObj;
      })
    );

    res.status(200).json({
      success: true,
      message: "Posts fetched",
      posts: postsWithMeta,
      page,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId).populate("author", "role");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const authorRole = post.author?.role || "user";
    const isOwner = post.author?._id.toString() === userId.toString();
    const isActorAdmin = req.user.role === "admin";
    const isActorModerator = req.user.role === "moderator";

    let isAuthorized = isOwner;
    if (isActorAdmin) {
      isAuthorized = true;
    } else if (isActorModerator) {
      if (authorRole !== "admin") {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Also delete comments for this post
    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: err.message,
    });
  }
};

// ─── Like / Unlike ───
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);

      // Notify post author (not self)
      if (post.author.toString() !== userId.toString()) {
        try {
          await createNotification({
            recipient: post.author,
            actor: userId,
            type: "like",
            post: post._id,
          });
        } catch {}
      }
    }

    await post.save();

    // Emit Socket.IO event if available
    try {
      const { getIO } = await import("../../socket.js");
      const io = getIO();
      if (io) {
        io.emit("post:liked", {
          postId: post._id,
          likesCount: post.likes.length,
          liked: !alreadyLiked,
          userId: userId.toString(),
        });
      }
    } catch {}

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: err.message,
    });
  }
};

// ─── Comments ───
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { content, parentCommentId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = new Comment({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null,
    });

    await comment.save();

    // Populate the author for the response
    await comment.populate("author", "name username profilePicture role");
    if (comment.parentComment) {
      await comment.populate({
        path: "parentComment",
        populate: { path: "author", select: "name username" }
      });
    }

    // Notify post author or parent comment author (not self)
    if (parentCommentId) {
      try {
        const parentCommentObj = await Comment.findById(parentCommentId);
        if (parentCommentObj && parentCommentObj.author.toString() !== userId.toString()) {
          await createNotification({
            recipient: parentCommentObj.author,
            actor: userId,
            type: "comment",
            post: post._id,
          });
        }
      } catch {}
    } else {
      if (post.author.toString() !== userId.toString()) {
        try {
          await createNotification({
            recipient: post.author,
            actor: userId,
            type: "comment",
            post: post._id,
          });
        } catch {}
      }
    }

    // Emit Socket.IO event if available
    try {
      const { getIO } = await import("../../socket.js");
      const io = getIO();
      if (io) {
        io.emit("post:commented", {
          postId,
          comment: comment.toObject(),
        });
      }
    } catch {}

    res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: err.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ post: postId });
    const comments = await Comment.find({ post: postId })
      .populate("author", "name username bio headline profilePicture role")
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "name username" }
      })
      .sort({ createdAt: 1 }) // We'll sort by oldest-first (createdAt: 1) so thread replies read logically top-to-bottom!
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      comments,
      page,
      hasMore: skip + comments.length < total,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const canDeleteAnyComment = ["moderator", "admin"].includes(req.user.role);

    if (
      comment.author.toString() !== userId.toString() &&
      !canDeleteAnyComment
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: err.message,
    });
  }
};
