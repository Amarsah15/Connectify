import React from "react";

const Card = ({
  children,
  hover = false,
  padding = "p-5",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)]
        shadow-[var(--shadow)]
        ${hover
          ? "transition-all duration-200 ease-out hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
          : ""}
        ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
