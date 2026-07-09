import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/models/User.js";

// Minimal cookie parser — avoids cookie package ESM issues
const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );


let io = null;

// userId → Set<socketId> — supports multiple tabs/devices
const userSocketMap = new Map();

/**
 * Get the Socket.IO server instance.
 */
export const getIO = () => io;

/**
 * Get all socket IDs for a given user.
 */
export const getUserSockets = (userId) => userSocketMap.get(userId);

/**
 * Authenticate a socket connection using the JWT cookie.
 * Reuses the same logic as auth.middleware.js.
 */
const authenticateSocket = async (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    if (user.isBanned) {
      return next(new Error("Account banned"));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid authentication"));
  }
};

/**
 * Initialize Socket.IO on an existing HTTP server.
 */
export const initializeSocket = (server, corsOptions) => {
  io = new Server(server, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
  });

  // Use JWT cookie authentication
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Add to user-socket map
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);

    // Broadcast online status
    socket.broadcast.emit("user:online", { userId });

    console.log(`Socket connected: ${socket.id} (user: ${socket.user.name})`);

    // Handle disconnect
    socket.on("disconnect", () => {
      const sockets = userSocketMap.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSocketMap.delete(userId);
          // Only broadcast offline if no remaining connections
          socket.broadcast.emit("user:offline", { userId });
        }
      }
      console.log(`Socket disconnected: ${socket.id} (user: ${socket.user.name})`);
    });
  });

  return io;
};
