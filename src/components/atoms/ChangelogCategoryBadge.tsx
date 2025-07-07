/**
 * ChangelogCategoryBadge component
 * @description Badge component for displaying changelog entry categories with color coding
 */

"use client";

import React from "react";
import { ChangelogCategoryBadgeProps } from "@/interfaces/changelog";

/**
 * ChangelogCategoryBadge Component
 *
 * Displays a colored badge for changelog entry categories with light theme styling.
 * Each category has its own distinct color scheme for easy visual identification.
 *
 * Features:
 * - Category-specific colors for visual distinction
 * - Multiple size variants for different use cases
 * - Light theme colors that complement the application design
 * - Semantic color choices that reflect category meaning
 *
 * Color scheme (light theme):
 * - Feature: Blue (bg-blue-100, text-blue-800)
 * - Bug Fix: Red (bg-red-100, text-red-800)
 * - Improvement: Green (bg-green-100, text-green-800)
 * - Security: Orange (bg-orange-100, text-orange-800)
 * - Performance: Purple (bg-purple-100, text-purple-800)
 * - Documentation: Indigo (bg-indigo-100, text-indigo-800)
 * - Breaking Change: Gray (bg-gray-100, text-gray-800)
 *
 * @param category - The changelog category to display
 * @param size - Size variant (sm, md, lg)
 * @param className - Additional CSS classes
 * @returns Category badge component with appropriate styling
 */
const ChangelogCategoryBadge: React.FC<ChangelogCategoryBadgeProps> = ({
  category,
  size = "md",
  className = "",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  // Category-specific colors for light theme
  const categoryColors = {
    Feature: "bg-blue-100 text-blue-800 border-blue-200",
    "Bug Fix": "bg-red-100 text-red-800 border-red-200",
    Improvement: "bg-green-100 text-green-800 border-green-200",
    Security: "bg-orange-100 text-orange-800 border-orange-200",
    Performance: "bg-purple-100 text-purple-800 border-purple-200",
    Documentation: "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Breaking Change": "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        border
        font-medium
        ${sizeClasses[size]}
        ${categoryColors[category]}
        ${className}
      `}
    >
      {category}
    </span>
  );
};

export default ChangelogCategoryBadge;
