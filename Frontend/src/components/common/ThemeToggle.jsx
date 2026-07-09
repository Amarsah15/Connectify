import React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg
        bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)]
        text-[var(--text-muted)] hover:text-[var(--text)]
        transition-all duration-200 ease-out
        hover:scale-105 hover:shadow-[var(--shadow)]
        active:scale-95 cursor-pointer ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
