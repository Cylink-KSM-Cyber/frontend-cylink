'use client'

import React, { useState } from 'react'

/**
 * Props for Avatar component
 */
interface AvatarProps {
  /**
   * Username to extract initials from
   */
  username: string

  /**
   * Optional avatar image URL
   */
  avatarUrl?: string

  /**
   * Size of the avatar in pixels
   * @default 40
   */
  size?: number

  /**
   * Additional CSS classes to apply
   */
  className?: string

  /**
   * Click handler for avatar
   */
  onClick?: () => void

  /**
   * Whether the avatar is clickable
   * @default false
   */
  isClickable?: boolean

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string
}

/**
 * Utility function to extract initials from username
 * @description Extracts up to 3 alphabetic characters from username, ignoring numbers
 * @param username - The username to extract initials from
 * @returns Uppercase initials string
 */
const extractInitials = (username: string): string => {
  if (!username || typeof username !== 'string') {
    return 'U' // Fallback for undefined/empty usernames
  }

  // Remove special characters and numbers, keep only alphabetic characters
  const alphabeticOnly = username.replaceAll(/[^a-zA-Z]/g, '')

  if (alphabeticOnly.length === 0) {
    return 'U' // Fallback for usernames with no alphabetic characters
  }

  // Take first 3 characters and convert to uppercase
  return alphabeticOnly.substring(0, 3).toUpperCase()
}

/**
 * Calculate font size based on avatar size
 */
const getFontSize = (size: number): string => {
  if (size <= 32) return '0.75rem'
  if (size <= 48) return '0.875rem'
  return '1rem'
}

/**
 * Avatar Component
 * @description Displays a circular avatar with user image or initials fallback
 * Features:
 * - Shows user image if avatarUrl provided
 * - Falls back to initials if no image or image fails to load
 * - Extracts up to 3 alphabetic characters from username
 * - Uses CyLink brand colors (#2563EB background, white text)
 * - Handles edge cases (empty, numeric, short usernames)
 * - Supports hover and active states
 * - Fully accessible with ARIA labels and keyboard navigation
 * - Responsive design with customizable size
 */
const Avatar: React.FC<AvatarProps> = ({
  username,
  avatarUrl,
  size = 40,
  className = '',
  onClick,
  isClickable = false,
  ariaLabel
}) => {
  const [imageError, setImageError] = useState(false)
  const initials = extractInitials(username)
  const showImage = avatarUrl && !imageError
  const canClick = isClickable || onClick

  // Generate default ARIA label if not provided
  const defaultAriaLabel = ariaLabel ?? `Profile avatar for ${username}`
  const fontSize = getFontSize(size)
  const letterSpacing = '0.5px'

  // Text styles for avatar initials
  const textStyles = 'font-semibold text-white select-none pointer-events-none'

  // Avatar content (image or initials)
  const avatarContent = showImage ? (
    <img src={avatarUrl} alt={username} className='w-full h-full object-cover' onError={() => setImageError(true)} />
  ) : (
    <span className={textStyles}>{initials}</span>
  )

  // Common styles
  const commonStyles = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize,
    letterSpacing
  }

  // If clickable, render as button for proper accessibility
  if (canClick) {
    return (
      <button
        type='button'
        className={`
          inline-flex items-center justify-center
          ${showImage ? 'bg-gray-200' : 'bg-[#2563EB]'} text-white
          rounded-full shrink-0
          font-semibold text-sm
          transition-all duration-200 ease-in-out
          overflow-hidden
          cursor-pointer hover:opacity-90 active:opacity-80
          focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
          ${className}
        `}
        style={commonStyles}
        onClick={onClick}
        aria-label={defaultAriaLabel}
      >
        {avatarContent}
      </button>
    )
  }

  // Non-clickable avatar (display only)
  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${showImage ? 'bg-gray-200' : 'bg-[#2563EB]'} text-white
        rounded-full shrink-0
        font-semibold text-sm
        transition-all duration-200 ease-in-out
        overflow-hidden
        ${className}
      `}
      style={commonStyles}
      aria-label={defaultAriaLabel}
    >
      {avatarContent}
    </div>
  )
}

export default Avatar
