import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { axiosInstance } from "../utils/api";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";

const StatCard = ({ icon: Icon, label, value, color = "brand" }) => {
  const colorMap = {
    brand: "bg-brand-600/10 text-brand-600 dark:text-brand-400",
    pink: "bg-pink-500/10 text-pink-500",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    violet: "bg-violet-500/10 text-violet-500",
    amber: "bg-amber-500/10 text-amber-500",
  };

  return (
    <Card className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--text)]">{value}</div>
        <div className="text-sm text-[var(--text-muted)]">{label}</div>
      </div>
    </Card>
  );
};

const ActivityBar = ({ data, max }) => {
  const height = max > 0 ? Math.max((data.posts / max) * 100, 8) : 8;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full bg-[var(--surface-2)] rounded-lg overflow-hidden h-24 flex items-end">
        <div
          className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-lg transition-all duration-500"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-xs text-[var(--text-faint)]">{data.week}</span>
      <span className="text-xs font-medium text-[var(--text-muted)]">
        {data.posts}
      </span>
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/profile/dashboard-stats");
        setStats(res.data.stats);
      } catch (error) {
        console.log("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-[var(--text-muted)] text-center">
          Failed to load dashboard data.
        </p>
      </main>
    );
  }

  const maxWeeklyPosts = Math.max(
    ...stats.weeklyActivity.map((w) => w.posts),
    1
  );

  const memberSinceDate = new Date(stats.memberSince).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
          <LayoutDashboard
            size={22}
            className="text-brand-600 dark:text-brand-400"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Your activity at a glance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={stats.postsCount}
          color="brand"
        />
        <StatCard
          icon={Heart}
          label="Likes Received"
          value={stats.totalLikesReceived}
          color="pink"
        />
        <StatCard
          icon={MessageCircle}
          label="Comments Made"
          value={stats.commentsCount}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Followers"
          value={stats.followersCount}
          color="violet"
        />
        <StatCard
          icon={UserPlus}
          label="Following"
          value={stats.followingCount}
          color="green"
        />
        <StatCard
          icon={Calendar}
          label="Member Since"
          value={memberSinceDate}
          color="amber"
        />
      </div>

      {/* Weekly Activity */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Weekly Activity
          </h2>
          <span className="text-sm text-[var(--text-faint)]">
            (last 4 weeks)
          </span>
        </div>

        <div className="flex gap-3 items-end">
          {stats.weeklyActivity.map((week, i) => (
            <ActivityBar key={i} data={week} max={maxWeeklyPosts} />
          ))}
        </div>

        <p className="text-xs text-[var(--text-faint)] mt-3 text-center">
          Posts published per week
        </p>
      </Card>
    </main>
  );
};

export default DashboardPage;
