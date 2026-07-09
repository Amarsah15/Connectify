import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Users } from "lucide-react";
import { axiosInstance } from "../utils/api";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      try {
        const res = await axiosInstance.get(`/users/search?q=${encodeURIComponent(query.trim())}`);
        setResults(res.data.users || []);
      } catch {
        setResults([]);
      }
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const roleBadgeColor = {
    admin: "red",
    moderator: "yellow",
    user: "gray",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people by name..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]
            text-[var(--text)] placeholder-[var(--text-faint)]
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            transition-all text-sm"
          autoFocus
        />
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !hasSearched ? (
        <EmptyState
          icon={SearchIcon}
          title="Find people"
          subtitle="Start typing a name to search across the network."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No results found"
          subtitle={`No users found matching "${query}". Try a different search.`}
        />
      ) : (
        <div className="space-y-2">
          {results.map((user) => (
            <button
              key={user._id}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="w-full text-left p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]
                hover:border-brand-600/30 hover:shadow-[var(--shadow)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.profilePicture}
                  name={user.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text)] truncate">
                      {user.name}
                    </span>
                    {user.role && user.role !== "user" && (
                      <Badge color={roleBadgeColor[user.role]} size="sm">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                  {user.bio && (
                    <p className="text-sm text-[var(--text-muted)] truncate mt-0.5">
                      {user.bio}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[var(--text-faint)] shrink-0">
                  {user.followers?.length || 0} followers
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
