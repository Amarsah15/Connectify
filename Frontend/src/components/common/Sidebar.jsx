import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import {
  LayoutDashboard,
  Settings,
  Bell,
  User,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthStore();

  const roleBadgeColor = {
    admin: "red",
    moderator: "yellow",
    user: "gray",
  };

  return (
    <div className="space-y-4">
      {/* Profile summary card */}
      <Card padding="p-0" className="overflow-hidden">
        {/* Cover gradient */}
        <div className="h-20 bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-950 dark:via-purple-950 dark:to-slate-950 relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-violet-400/30 blur-lg dark:bg-brand-500/10" />
          <div className="absolute -left-2 -bottom-2 w-12 h-12 rounded-full bg-teal-400/20 blur-md dark:bg-purple-500/10" />
        </div>
        
        <div className="px-4 pb-5 pt-0 text-center relative">
          {/* Avatar overlapping cover */}
          <div className="flex justify-center -mt-10 mb-3">
            <div className="ring-4 ring-[var(--surface)] rounded-full bg-[var(--surface)]">
              <Avatar
                src={authUser?.profilePicture}
                name={authUser?.name || "User"}
                size="xl"
              />
            </div>
          </div>

          <h3 className="font-bold text-lg text-[var(--text)] line-clamp-1">
            {authUser?.name}
          </h3>
          {authUser?.username && (
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              @{authUser.username}
            </p>
          )}
          {authUser?.headline && (
            <p className="text-xs font-medium text-[var(--text)] opacity-90 mt-0.5 max-w-[200px] mx-auto truncate" title={authUser.headline}>
              {authUser.headline}
            </p>
          )}
          <p className="text-[10px] text-[var(--text-faint)] mt-0.5 mb-2 line-clamp-1">
            {authUser?.email}
          </p>

          {authUser?.role && authUser.role !== "user" && (
            <div className="flex justify-center mb-3">
              <Badge color={roleBadgeColor[authUser.role]} size="sm">
                {authUser.role}
              </Badge>
            </div>
          )}

          {authUser?.bio ? (
            <p className="text-sm text-[var(--text-muted)] line-clamp-2 px-2 leading-relaxed">
              {authUser.bio}
            </p>
          ) : (
            <p className="text-xs text-[var(--text-faint)] italic">
              No bio added yet.
            </p>
          )}

          <div className="border-t border-[var(--border-light)] mt-4 pt-4 grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="block text-lg font-bold text-[var(--text)]">
                {authUser?.followers?.length || 0}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-faint)]">
                Followers
              </span>
            </div>
            <div className="border-l border-[var(--border-light)]">
              <span className="block text-lg font-bold text-[var(--text)]">
                {authUser?.following?.length || 0}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-faint)]">
                Following
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Quick Links card */}
      <Card className="hidden md:block">
        <h4 className="font-bold text-sm text-[var(--text)] uppercase tracking-wider mb-3">
          Quick Links
        </h4>
        <nav className="space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <User size={16} className="text-brand-600 dark:text-brand-400" />
            <span>My Profile</span>
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Bell size={16} className="text-brand-600 dark:text-brand-400" />
            <span>Notifications</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <Settings size={16} className="text-brand-600 dark:text-brand-400" />
            <span>Settings</span>
          </Link>
        </nav>
      </Card>
    </div>
  );
};

export default Sidebar;
