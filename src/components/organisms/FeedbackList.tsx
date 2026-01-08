'use client'

import React from 'react'
import { FeedbackItem, DownvoteFormData } from '@/interfaces/feedback'
import FeedbackCard from '@/components/molecules/FeedbackCard'
import Pagination from '@/components/molecules/Pagination'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'

/**
 * Feedback List Props
 */
interface FeedbackListProps {
  /**
   * Array of feedback items
   */
  feedback: FeedbackItem[]

  /**
   * Whether data is loading
   */
  isLoading: boolean

  /**
   * Pagination data
   */
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }

  /**
   * Page change handler
   */
  onPageChange: (page: number) => void

  /**
   * Upvote handler
   */
  onUpvote: (feedbackId: number) => void

  /**
   * Downvote handler with optional reason data
   */
  onDownvote: (feedbackId: number, data?: DownvoteFormData) => void

  /**
   * View supporters handler
   */
  onViewSupporters: (feedbackId: number) => void

  /**
   * Delete feedback handler
   */
  onDelete?: (feedbackId: number) => void

  /**
   * Current user ID for ownership check
   */
  currentUserId?: number

  /**
   * Whether voting is disabled
   */
  isVoting?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Feedback List Component
 * @description Main list container for feedback items with pagination
 */
const FeedbackList: React.FC<FeedbackListProps> = ({
  feedback,
  isLoading,
  pagination,
  onPageChange,
  onUpvote,
  onDownvote,
  onViewSupporters,
  onDelete,
  currentUserId,
  isVoting = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <LoadingSpinner />
      </div>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-gray-400 mb-4'>
          <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-1'>No feedback found</h3>
        <p className='text-gray-500'>Be the first to submit feedback or adjust your filters.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Feedback Cards */}
      <div className='space-y-4'>
        {feedback.map(item => {
          // Debug logging for ownership check
          console.log('FeedbackCard ownership check:', {
            feedbackId: item.id,
            feedbackUserId: item.user_id,
            feedbackUserIdType: typeof item.user_id,
            currentUserId: currentUserId,
            currentUserIdType: typeof currentUserId,
            isOwner: currentUserId !== undefined && Number(item.user_id) === Number(currentUserId)
          })

          return (
            <FeedbackCard
              key={item.id}
              feedback={item}
              onUpvote={() => onUpvote(item.id)}
              onDownvote={data => onDownvote(item.id, data)}
              onViewSupporters={() => onViewSupporters(item.id)}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
              isOwner={currentUserId !== undefined && Number(item.user_id) === Number(currentUserId)}
              disabled={isVoting}
            />
          )
        })}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className='mt-6'>
          <Pagination currentPage={pagination.page} totalPages={pagination.total_pages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

export default FeedbackList
