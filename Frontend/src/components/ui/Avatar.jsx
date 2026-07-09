import React from "react";

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-lg",
};

const Avatar = ({
  src,
  name = "User",
  size = "md",
  online,
  className = "",
  ...props
}) => {
  const fallbackUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(name)}`;
  const imgSrc = src || fallbackUrl;

  return (
    <div className={`relative inline-flex shrink-0 rounded-full ${className}`} {...props}>
      <img
        src={imgSrc}
        alt={name}
        className={`rounded-full object-cover border border-[var(--border)]
          bg-[var(--surface-2)] ${sizeMap[size] || sizeMap.md}`}
        onError={(e) => {
          e.target.src = fallbackUrl;
        }}
      />
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full border-2 border-[var(--surface)]
            ${online ? "bg-[var(--success)]" : "bg-[var(--text-faint)]"}
            ${size === "xs" || size === "sm" ? "w-2 h-2" : "w-3 h-3"}`}
        />
      )}
    </div>
  );
};

export default Avatar;
