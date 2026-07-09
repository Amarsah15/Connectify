import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createTokenPayload = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  username: user.username,
  bio: user.bio || "",
  headline: user.headline || "",
  profilePicture: user.profilePicture,
  role: user.role,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      username: normalizedUsername,
      password: hashedPassword,
      profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    // Generate JWT token
    const token = jwt.sign(createTokenPayload(user), process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in response header
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // 'None' with secure true for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const safeUser = user.toObject();
    delete safeUser.password;

    // Generate JWT token
    const token = jwt.sign(createTokenPayload(user), process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in response header
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User login failed",
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User logout failed",
      error: error.message,
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        bio: req.user.bio || "",
        headline: req.user.headline || "",
        profilePicture: req.user.profilePicture,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
