import { io } from "socket.io-client";

let socket = null;

/**
 * Connect to the Socket.IO server.
 * Call after successful login / auth check.
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  // Derive the WS URL from the API URL
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:8000";

  socket = io(baseUrl, {
    withCredentials: true, // sends the JWT httpOnly cookie
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
  });

  socket.on("connect", () => {
    console.log("[socket] connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[socket] disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("[socket] connection error:", err.message);
  });

  return socket;
};

/**
 * Disconnect from the Socket.IO server.
 * Call on logout.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance (may be null if not connected).
 */
export const getSocket = () => socket;
