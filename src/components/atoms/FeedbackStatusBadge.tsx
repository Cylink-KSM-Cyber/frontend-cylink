'use client'

import React from 'react'
import { FeedbackStatus } from '@/interfaces/feedback'

/**
 * Feedback Status Badge Props
 */
interface FeedbackStatusBadgeProps {
  /**
   * Status of feedback
   */
  status: FeedbackStatus

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Status configuration map
 */
const STATUS_CONFIG: Record<FeedbackStatus, { label: string; colorClasses: string }> = {
  open: {
    label: 'Open',
    colorClasses: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  under_review: {
    label: 'Under Review',
    colorClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  planned: {
    label: 'Planned',
    colorClasses: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  in_progress: {
    label: 'In Progress',
    colorClasses: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  completed: {
    label: 'Completed',
    colorClasses: 'bg-green-100 text-green-700 border-green-200'
  },
  closed: {
    label: 'Closed',
    colorClasses: 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

/**
 * Feedback Status Badge Component
 * @description Pill-shaped badge showing feedback lifecycle status
 */
const FeedbackStatusBadge: React.FC<FeedbackStatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.colorClasses} ${className}`}
    >
      {config.label}
    </span>
  )
}

export default FeedbackStatusBadge
