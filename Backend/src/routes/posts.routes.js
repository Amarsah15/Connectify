import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
} from "../controllers/post.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { validatePost, validateComment } from "../middleware/validation.middleware.js";

const postRoutes = express.Router();

// Existing routes
postRoutes.post("/create", auth, validatePost, createPost);
postRoutes.get("/getAll", auth, getAllPosts);
postRoutes.delete("/:id", auth, deletePost);

// Like/Unlike
postRoutes.post("/:id/like", auth, toggleLike);

// Comments
postRoutes.post("/:id/comments", auth, validateComment, addComment);
postRoutes.get("/:id/comments", auth, getComments);
postRoutes.delete("/comments/:commentId", auth, deleteComment);

export default postRoutes;
