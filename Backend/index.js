import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import authRoutes from "./src/routes/auth.routes.js";
import postRoutes from "./src/routes/posts.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import { connectDB } from "./src/config/db.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const app = express();

connectDB();

// ─── Security ───
app.use(helmet());

const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://connectify-amarnath-kumar.vercel.app",
    "http://localhost:5173",
  ].filter(Boolean),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// ─── Rate Limiting ───
const isProd = process.env.NODE_ENV === "production";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 300 : 10000, // limit each IP per window (10000 in dev)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 10000, // stricter for auth in prod, loose in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
});

// ─── API Routes ───
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/posts", apiLimiter, postRoutes);
app.use("/api/v1/profile", apiLimiter, profileRoutes);
app.use("/api/v1/users", apiLimiter, userRoutes);
app.use("/api/v1/notifications", apiLimiter, notificationRoutes);

// ─── Health / Root ───
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Connectify API — V2");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// ─── 404 handler ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ───
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─── Create HTTP server + Socket.IO ───
const server = createServer(app);
initializeSocket(server, corsOptions);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
