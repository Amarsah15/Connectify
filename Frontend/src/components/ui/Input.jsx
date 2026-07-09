import React, { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 rounded-lg
            bg-[var(--surface-3)] border border-[var(--border)]
            text-[var(--text)] placeholder:text-[var(--text-faint)]
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-[var(--danger)] focus:ring-[var(--danger)]" : ""}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
