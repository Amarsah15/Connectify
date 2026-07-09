import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  subtitle,
  action,
  actionLabel,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]
        flex items-center justify-center mb-4">
        <Icon size={24} className="text-[var(--text-faint)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-[var(--text-muted)] max-w-sm mb-4">
          {subtitle}
        </p>
      )}
      {action && actionLabel && (
        <Button variant="primary" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
