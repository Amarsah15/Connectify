import React from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-brand-600 hover:bg-brand-700 text-white shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)]",
  ghost:
    "bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]",
  danger:
    "bg-[var(--danger)] hover:brightness-110 text-white shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)]",
  "danger-ghost":
    "bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--danger)] hover:text-red-700 dark:hover:text-red-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-2.5 text-base gap-2.5",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  as,
  to,
  className = "",
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    hover:scale-[1.02] active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    cursor-pointer select-none`;

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${
    sizes[size] || sizes.md
  } ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {loading && <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />}
      {children}
    </>
  );

  // Render as Link if `as="link"` or `to` is provided
  if (as === "link" || to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
