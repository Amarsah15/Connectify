import express from "express";
import { auth, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getFollowStatus,
  getUsers,
  toggleFollow,
  toggleUserBan,
  updateUserRole,
  searchUsers,
  getPublicStats,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/stats/public", getPublicStats);

// Search must be before parameterized routes
userRoutes.get("/search", auth, searchUsers);

userRoutes.post("/:userId/follow", auth, toggleFollow);
userRoutes.get("/:userId/follow-status", auth, getFollowStatus);
userRoutes.get("/", auth, authorizeRoles("moderator", "admin"), getUsers);
userRoutes.patch(
  "/:userId/role",
  auth,
  authorizeRoles("admin"),
  updateUserRole
);
userRoutes.patch(
  "/:userId/ban",
  auth,
  authorizeRoles("moderator", "admin"),
  toggleUserBan
);
userRoutes.delete("/:userId", auth, authorizeRoles("admin"), deleteUser);

export default userRoutes;
