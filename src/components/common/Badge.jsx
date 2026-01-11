import React from "react";
import { BADGE_VARIANTS } from "@/constants/badges";

/**
 * Reusable Badge Component
 * @param {string} variant - Key from BADGE_VARIANTS (e.g. 'subject', 'course', 'active')
 * @param {string} size - 'sm' or 'md'
 * @param {ReactNode} children - Badge content
 * @param {string} className - Additional classes
 */
const Badge = ({
  variant = "default",
  size = "sm",
  children,
  className = "",
}) => {
  const flavorClasses = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;

  const sizeClasses =
    size === "md"
      ? "px-2.5 py-1 text-sm rounded-md"
      : "px-2 py-0.5 text-xs rounded-full";

  return (
    <span
      className={`inline-flex items-center font-medium border ${flavorClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
