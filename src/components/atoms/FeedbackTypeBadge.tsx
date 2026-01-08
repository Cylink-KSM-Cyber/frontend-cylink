'use client'

import React from 'react'
import { RiBugLine, RiLightbulbLine } from 'react-icons/ri'
import { FeedbackType } from '@/interfaces/feedback'

/**
 * Feedback Type Badge Props
 */
interface FeedbackTypeBadgeProps {
  /**
   * Type of feedback
   */
  type: FeedbackType

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Feedback Type Badge Component
 * @description Badge for differentiating bugs and features with icons and colors
 */
const FeedbackTypeBadge: React.FC<FeedbackTypeBadgeProps> = ({ type, className = '' }) => {
  const isBug = type === 'bug'

  const Icon = isBug ? RiBugLine : RiLightbulbLine

  const colorClasses = isBug ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'

  const label = isBug ? 'Bug' : 'Feature'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </span>
  )
}

export default FeedbackTypeBadge
