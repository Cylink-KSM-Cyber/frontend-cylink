/**
 * ChangelogVersionBadge component
 * @description Badge component for displaying version numbers in changelog entries
 */

"use client";

import React from "react";

/**
 * Props for ChangelogVersionBadge component
 */
interface ChangelogVersionBadgeProps {
  /** Version string (e.g., "1.2.0") */
  version: string;
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Custom CSS classes */
  className?: string;
}

/**
 * ChangelogVersionBadge component for displaying version information
 * @param props - Component properties
 * @returns ChangelogVersionBadge component
 */
const ChangelogVersionBadge: React.FC<ChangelogVersionBadgeProps> = ({
  version,
  size = "md",
  className = "",
}) => {
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default: // md
        return "px-3 py-1.5 text-sm";
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-mono font-semibold rounded-md
        bg-gray-900 text-white border border-gray-700
        ${getSizeClasses()}
        ${className}
      `}
    >
      v{version}
    </span>
  );
};

export default ChangelogVersionBadge;
