import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePostsStore } from "../../store/postsStore";
import { useProfileStore } from "../../store/profileStore";
import { useNotificationStore } from "../../store/notificationStore";
import { disconnectSocket } from "../../lib/socket";
import {
  LogOut,
  Home,
  FileText,
  Menu,
  Shield,
  X,
  Search,
  Bell,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { clearPosts } = usePostsStore();
  const { clearProfile } = useProfileStore();
  const { unreadCount, clearNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!authUser;
  const canModerate = ["moderator", "admin"].includes(authUser?.role);

  // Don't show the app header on the landing page for logged-out users
  const isLandingPage = location.pathname === "/" && !isAuthenticated;

  const handleLogout = async () => {
    try {
      await logout();
      clearPosts();
      clearProfile();
      clearNotifications();
      disconnectSocket();
      setIsMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const navLinkClasses = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${
      isActive(path)
        ? "bg-brand-600/10 text-brand-600 dark:text-brand-400"
        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
    }`;

  if (isLandingPage) return null; // Landing page has its own nav

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo - Left */}
          <Link
            to={isAuthenticated ? "/feed" : "/"}
            className="flex items-center gap-2 shrink-0"
          >
            <Logo height={54} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
              hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Center Nav — Desktop */}
          {isAuthenticated && (
            <nav className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
              <Link to="/feed" className={navLinkClasses("/feed")}>
                <Home size={18} />
                <span>Feed</span>
              </Link>
              <Link to="/posts" className={navLinkClasses("/posts")}>
                <FileText size={18} />
                <span>Posts</span>
              </Link>

              {canModerate && (
                <Link to="/admin" className={navLinkClasses("/admin")}>
                  <Shield size={18} />
                  <span>Moderation</span>
                </Link>
              )}
            </nav>
          )}

          {/* Right — Desktop */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />

              <Link
                to="/search"
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
                  hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </Link>

              <Link
                to="/notifications"
                className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
                  hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-600
                    text-white text-[10px] font-bold flex items-center justify-center
                    ring-2 ring-[var(--surface)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                  hover:bg-[var(--surface-2)] transition-colors"
              >
                <Avatar
                  src={authUser?.profilePicture}
                  name={authUser?.name || "User"}
                  size="sm"
                />
                <span className="hidden md:block text-sm font-medium text-[var(--text)] max-w-[120px] truncate">
                  {authUser?.name}
                </span>
              </Link>

              <Link
                to="/settings"
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)]
                  hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Settings"
              >
                <Settings size={18} />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)]
                  hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" as="link" to="/login">
                Sign in
              </Button>
              <Button variant="primary" size="sm" as="link" to="/register">
                Get started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-[var(--border)] py-3 space-y-1 animate-slideDown">
            {isAuthenticated ? (
              <>
                <Link
                  to="/feed"
                  onClick={closeMobile}
                  className={`${navLinkClasses("/feed")} w-full`}
                >
                  <Home size={18} />
                  Feed
                </Link>
                <Link
                  to="/posts"
                  onClick={closeMobile}
                  className={`${navLinkClasses("/posts")} w-full`}
                >
                  <FileText size={18} />
                  Posts
                </Link>
                <Link
                  to="/search"
                  onClick={closeMobile}
                  className={`${navLinkClasses("/search")} w-full`}
                >
                  <Search size={18} />
                  Search
                </Link>
                <Link
                  to="/notifications"
                  onClick={closeMobile}
                  className={`${navLinkClasses("/notifications")} w-full`}
                >
                  <Bell size={18} />
                  Notifications
                </Link>
                {canModerate && (
                  <Link
                    to="/admin"
                    onClick={closeMobile}
                    className={`${navLinkClasses("/admin")} w-full`}
                  >
                    <Shield size={18} />
                    Moderation
                  </Link>
                )}

                <div className="border-t border-[var(--border)] my-2" />

                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                >
                  <Avatar
                    src={authUser?.profilePicture}
                    name={authUser?.name || "User"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-[var(--text)]">
                    {authUser?.name}
                  </span>
                </Link>

                <Link
                  to="/settings"
                  onClick={closeMobile}
                  className={`${navLinkClasses("/settings")} w-full`}
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-[var(--text-muted)]">Theme</span>
                  <ThemeToggle />
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg
                    text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/20
                    transition-colors cursor-pointer text-sm font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-[var(--text-muted)]">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-lg text-sm font-medium
                    text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-lg text-sm font-medium
                    text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}

            {/* Animation styles */}
            <style>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-slideDown {
                animation: slideDown 0.2s ease-out;
              }
            `}</style>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
