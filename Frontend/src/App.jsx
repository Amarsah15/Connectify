import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/common/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostsPage from "./pages/PostsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";

import { useAuthStore } from "./store/authStore";
import { useNotificationStore } from "./store/notificationStore";
import { usePostsStore } from "./store/postsStore";
import { connectSocket, disconnectSocket, getSocket } from "./lib/socket";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { fetchUnreadCount, addNotification } = useNotificationStore();
  const { updatePostLike } = usePostsStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Connect Socket.IO when authenticated
  useEffect(() => {
    if (authUser) {
      connectSocket();
      fetchUnreadCount();

      const socket = getSocket();
      if (socket) {
        // Listen for real-time notifications
        socket.on("notification:new", (notification) => {
          addNotification(notification);
        });

        // Listen for like updates
        socket.on("post:liked", (data) => {
          updatePostLike(data);
        });
      }

      return () => {
        const s = getSocket();
        if (s) {
          s.off("notification:new");
          s.off("post:liked");
        }
      };
    } else {
      disconnectSocket();
    }
  }, [authUser, fetchUnreadCount, addNotification, updatePostLike]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-md)",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "var(--success)", secondary: "var(--surface)" },
          },
          error: {
            iconTheme: { primary: "var(--danger)", secondary: "var(--surface)" },
          },
        }}
      />

      {!["/", "/login", "/register"].includes(location.pathname) && <Header />}

      <Routes>
        {/* ---------- PUBLIC: Landing page ---------- */}
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/feed" replace /> : <LandingPage />
          }
        />

        {/* ---------- AUTH ROUTES ---------- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* ---------- PUBLIC PROFILE ---------- */}
        <Route path="/profile/:userId" element={<PublicProfilePage />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PostsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
