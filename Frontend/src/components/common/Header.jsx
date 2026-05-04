import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { usePostsStore } from "../../store/postsStore";
import { useProfileStore } from "../../store/profileStore";
import { LogOut, Home, FileText, Menu, Shield, X } from "lucide-react";
import Logo from "../../assets/logo.svg";

const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { clearPosts } = usePostsStore();
  const { clearProfile } = useProfileStore();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!authUser;
  const canModerate = ["moderator", "admin"].includes(authUser?.role);

  const handleLogout = async () => {
    try {
      await logout();
      clearPosts();
      clearProfile();
      setIsMobileMenuOpen(false); // Close menu on logout
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Connectify Logo" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="sm:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center Nav - Desktop only */}
          {isAuthenticated && (
            <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 px-1 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home size={20} />
                <span className="hidden sm:block">Home</span>
              </Link>
              <Link
                to="/posts"
                className="flex items-center space-x-1 px-1 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText size={20} />
                <span className="hidden sm:block">Posts</span>
              </Link>
              {canModerate && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-1 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Shield size={20} />
                  <span className="hidden sm:block">Moderation</span>
                </Link>
              )}
            </div>
          )}

          {/* Right - Desktop */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-1 px-1 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={
                    authUser?.profilePicture ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${
                      authUser?.name || "User"
                    }`
                  }
                  alt={authUser?.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block">{authUser?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-1 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-linkedin-blue"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 bg-white border-t border-gray-200 py-2 px-2 rounded-lg shadow-md">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  <Home size={18} className="inline mr-2" />
                  Home
                </Link>
                <Link
                  to="/posts"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  <FileText size={18} className="inline mr-2" />
                  Posts
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                >
                  <img
                    src={
                      authUser?.profilePicture ||
                      `https://api.dicebear.com/5.x/initials/svg?seed=${
                        authUser?.name || "User"
                      }`
                    }
                    alt={authUser?.name || "User"}
                    className="w-6 h-6 rounded-full inline mr-2"
                  />
                  {authUser?.name}
                </Link>
                {canModerate && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                  >
                    <Shield size={18} className="inline mr-2" />
                    Moderation
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <LogOut size={18} className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
