import React from "react";

const Logo = ({ className = "", height = 32 }) => {
  return (
    <svg
      width="220"
      height="60"
      viewBox="0 0 220 60"
      className={className}
      style={{ height: `${height}px`, width: "auto" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Premium Connection Node Icon */}
      <g transform="translate(8, 12)">
        {/* Connecting paths */}
        <path
          d="M6 24 L18 12 L30 24 M18 12 L18 28"
          stroke="var(--color-brand-500)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Nodes with outline for crispness */}
        <circle cx="18" cy="12" r="5.5" fill="var(--color-brand-600)" />
        <circle cx="6" cy="24" r="4.5" fill="var(--color-brand-400)" />
        <circle cx="30" cy="24" r="4.5" fill="var(--color-brand-400)" />
        <circle cx="18" cy="28" r="4.5" fill="var(--color-brand-600)" />

        {/* Glow ring around the core node */}
        <circle cx="18" cy="12" r="9.5" stroke="var(--color-brand-500)" strokeWidth="1.5" strokeOpacity="0.35" />
      </g>

      {/* Typography */}
      <text
        x="56"
        y="39"
        fill="var(--text)"
        fontSize="25"
        fontWeight="800"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        letterSpacing="-0.04em"
      >
        Connect
        <tspan fill="var(--color-brand-600)" fontWeight="900">ify</tspan>
      </text>
    </svg>
  );
};

export default Logo;
