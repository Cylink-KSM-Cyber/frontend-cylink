/**
 * ChangelogCategoryBadge component
 * @description Badge component for displaying changelog entry categories with color coding
 */

"use client";

import React from "react";
import {
  ChangelogCategoryBadgeProps,
  ChangelogCategory,
  CategoryColorConfig,
} from "@/interfaces/changelog";

/**
 * Color configuration for different changelog categories
 */
const categoryColors: Record<ChangelogCategory, CategoryColorConfig> = {
  Feature: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  "Bug Fix": {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  Improvement: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  Security: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  Performance: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  Documentation: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  "Breaking Change": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
};

/**
 * ChangelogCategoryBadge component with color-coded category display
 * @param props - Component properties
 * @returns ChangelogCategoryBadge component
 */
const ChangelogCategoryBadge: React.FC<ChangelogCategoryBadgeProps> = ({
  category,
  size = "md",
  className = "",
}) => {
  const colors = categoryColors[category] || categoryColors["Feature"];

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-sm";
      default: // md
        return "px-3 py-1.5 text-xs";
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${colors.bg} ${colors.text} ${colors.border}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {category}
    </span>
  );
};

export default ChangelogCategoryBadge;
