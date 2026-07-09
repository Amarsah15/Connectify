import React from "react";

const colorMap = {
  brand:
    "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300",
  green:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  red:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  yellow:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  gray:
    "bg-[var(--surface-2)] text-[var(--text-muted)]",
};

const sizeMap = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

const Badge = ({
  children,
  color = "gray",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full leading-none
        ${colorMap[color] || colorMap.gray}
        ${sizeMap[size] || sizeMap.md}
        ${className}`}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
};

export default Badge;
