/**
 * ChangelogCategoryBadge component
 * @description Badge component for displaying changelog entry categories with color coding
 */

"use client";

import React from "react";
import {
  ChangelogCategoryBadgeProps,
  ChangelogCategory,
} from "@/interfaces/changelog";

/**
 * Color configuration for different changelog categories in dark theme
 */
const categoryColors: Record<ChangelogCategory, string> = {
  Feature: "bg-blue-900 text-blue-200",
  "Bug Fix": "bg-red-900 text-red-200",
  Improvement: "bg-green-900 text-green-200",
  Security: "bg-yellow-900 text-yellow-200",
  Performance: "bg-purple-900 text-purple-200",
  Documentation: "bg-gray-800 text-gray-300",
  "Breaking Change": "bg-orange-900 text-orange-200",
};

/**
 * ChangelogCategoryBadge component with dark theme color-coded category display
 * @param props - Component properties
 * @returns ChangelogCategoryBadge component
 */
const ChangelogCategoryBadge: React.FC<ChangelogCategoryBadgeProps> = ({
  category,
  size = "md",
  className = "",
}) => {
  const colorClasses = categoryColors[category] || categoryColors["Feature"];

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2.5 py-0.5 text-xs";
      case "lg":
        return "px-4 py-2 text-sm";
      default: // md
        return "px-3 py-1.5 text-xs";
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${colorClasses}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {category}
    </span>
  );
};

export default ChangelogCategoryBadge;
