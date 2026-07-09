import express from "express";
import {
  getUserProfile,
  updateProfile,
  getPublicProfile,
  getDashboardStats,
  updatePassword,
} from "../controllers/profile.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { validateProfileUpdate } from "../middleware/validation.middleware.js";

const profileRoutes = express.Router();

profileRoutes.get("/", auth, getUserProfile);
profileRoutes.get("/dashboard-stats", auth, getDashboardStats);
profileRoutes.put("/update", auth, validateProfileUpdate, updateProfile);
profileRoutes.put("/update-password", auth, updatePassword);
profileRoutes.get("/:userId", getPublicProfile);

export default profileRoutes;
