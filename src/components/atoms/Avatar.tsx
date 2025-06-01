"use client";

import React from "react";

/**
 * Props for Avatar component
 */
interface AvatarProps {
  /**
   * Username to extract initials from
   */
  username: string;

  /**
   * Size of the avatar in pixels
   * @default 40
   */
  size?: number;

  /**
   * Additional CSS classes to apply
   */
  className?: string;

  /**
   * Click handler for avatar
   */
  onClick?: () => void;

  /**
   * Whether the avatar is clickable
   * @default false
   */
  isClickable?: boolean;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Utility function to extract initials from username
 * @description Extracts up to 3 alphabetic characters from username, ignoring numbers
 * @param username - The username to extract initials from
 * @returns Uppercase initials string
 */
const extractInitials = (username: string): string => {
  if (!username || typeof username !== "string") {
    return "U"; // Fallback for undefined/empty usernames
  }

  // Remove special characters and numbers, keep only alphabetic characters
  const alphabeticOnly = username.replace(/[^a-zA-Z]/g, "");

  if (alphabeticOnly.length === 0) {
    return "U"; // Fallback for usernames with no alphabetic characters
  }

  // Take first 3 characters and convert to uppercase
  return alphabeticOnly.substring(0, 3).toUpperCase();
};

/**
 * Avatar Component
 * @description Displays a circular avatar with user initials
 * Features:
 * - Extracts up to 3 alphabetic characters from username
 * - Uses CyLink brand colors (#2563EB background, white text)
 * - Handles edge cases (empty, numeric, short usernames)
 * - Supports hover and active states
 * - Fully accessible with ARIA labels and keyboard navigation
 * - Responsive design with customizable size
 */
const Avatar: React.FC<AvatarProps> = ({
  username,
  size = 40,
  className = "",
  onClick,
  isClickable = false,
  ariaLabel,
}) => {
  const initials = extractInitials(username);

  // Generate default ARIA label if not provided
  const defaultAriaLabel = ariaLabel || `Profile avatar for ${username}`;

  // Base styles for avatar container
  const baseStyles = `
    inline-flex items-center justify-center
    bg-[#2563EB] text-white
    rounded-full flex-shrink-0
    font-semibold text-sm
    transition-all duration-200 ease-in-out
    ${
      isClickable || onClick
        ? "cursor-pointer hover:bg-[#1D4ED8] active:bg-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        : ""
    }
  `;

  // Text styles for avatar initials
  const textStyles = `
    font-semibold text-white
    select-none pointer-events-none
  `;

  // Calculate font size based on avatar size
  const fontSize = size <= 32 ? "0.75rem" : size <= 48 ? "0.875rem" : "1rem";
  const letterSpacing = "0.5px";

  const avatarElement = (
    <div
      className={`${baseStyles} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize,
        letterSpacing,
      }}
      onClick={isClickable || onClick ? onClick : undefined}
      role={isClickable || onClick ? "button" : "img"}
      aria-label={defaultAriaLabel}
      tabIndex={isClickable || onClick ? 0 : -1}
      onKeyDown={(e) => {
        if ((isClickable || onClick) && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <span className={textStyles}>{initials}</span>
    </div>
  );

  return avatarElement;
};

export default Avatar;
