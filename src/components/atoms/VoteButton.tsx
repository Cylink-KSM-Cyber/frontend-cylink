'use client'

import React from 'react'
import { RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

/**
 * Vote Button Props
 */
interface VoteButtonProps {
  /**
   * Type of vote button
   */
  type: 'upvote' | 'downvote'

  /**
   * Whether the button is in active state
   */
  isActive: boolean

  /**
   * Whether the button is disabled
   */
  disabled?: boolean

  /**
   * Click handler
   */
  onClick: () => void

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Vote Button Component
 * @description Upvote/downvote button with active states and accessibility
 */
const VoteButton: React.FC<VoteButtonProps> = ({ type, isActive, disabled = false, onClick, className = '' }) => {
  const Icon = type === 'upvote' ? RiArrowUpLine : RiArrowDownLine

  const baseClasses = 'p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const activeClasses = isActive
    ? type === 'upvote'
      ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
      : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-300'

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${activeClasses} ${disabledClasses} ${className}`}
      aria-label={`${type} button`}
      aria-pressed={isActive}
    >
      <Icon size={20} />
    </button>
  )
}

export default VoteButton
