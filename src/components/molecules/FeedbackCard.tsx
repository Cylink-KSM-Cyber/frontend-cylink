'use client'

import React from 'react'
import { FeedbackItem, DownvoteFormData } from '@/interfaces/feedback'
import VoteRail from '@/components/molecules/VoteRail'
import FeedbackTypeBadge from '@/components/atoms/FeedbackTypeBadge'
import FeedbackStatusBadge from '@/components/atoms/FeedbackStatusBadge'
import AvatarStack from '@/components/atoms/AvatarStack'
import { formatDistanceToNow } from 'date-fns'
import { RiDeleteBinLine } from 'react-icons/ri'

/**
 * Feedback Card Props
 */
interface FeedbackCardProps {
  /**
   * Feedback item data
   */
  feedback: FeedbackItem

  /**
   * Upvote handler
   */
  onUpvote: () => void

  /**
   * Downvote handler with optional reason data
   */
  onDownvote: (data?: DownvoteFormData) => void

  /**
   * Click handler for viewing supporters
   */
  onViewSupporters: () => void

  /**
   * Click handler for card title
   */
  onTitleClick?: () => void

  /**
   * Delete handler - called when delete button is clicked
   */
  onDelete?: () => void

  /**
   * Whether the current user is the owner of this feedback
   * Controls visibility of delete button
   */
  isOwner?: boolean

  /**
   * Whether voting is disabled
   */
  disabled?: boolean

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Feedback Card Component
 * @description Individual feedback item card with responsive layout
 * Desktop: Horizontal (Vote Rail | Content | Social Rail)
 * Mobile: Card with footer
 */
const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onUpvote,
  onDownvote,
  onViewSupporters,
  onTitleClick,
  onDelete,
  isOwner = false,
  disabled = false,
  className = ''
}) => {
  const timeAgo = formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Desktop Layout */}
      <div className='hidden lg:flex items-start gap-4 p-4'>
        {/* Vote Rail - Left */}
        <VoteRail
          score={feedback.score}
          userVote={feedback.user_vote}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          disabled={disabled}
          className='shrink-0'
        />

        {/* Content - Center */}
        <div className='flex-1 min-w-0'>
          {/* Title - Using button for accessibility */}
          <button
            type='button'
            className='text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors text-left w-full'
            onClick={onTitleClick}
          >
            {feedback.title}
          </button>

          {/* Description */}
          <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{feedback.description}</p>

          {/* Metadata Row */}
          <div className='flex items-center gap-2 flex-wrap'>
            <FeedbackTypeBadge type={feedback.type} />
            <FeedbackStatusBadge status={feedback.status} />
            <span className='text-xs text-gray-500'>
              {feedback.author?.name} • {timeAgo}
            </span>
            {feedback.tags && feedback.tags.length > 0 && (
              <>
                {feedback.tags.map(tag => (
                  <span key={tag} className='px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded'>
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Social Rail - Right */}
        <div className='shrink-0 flex items-center gap-2'>
          <AvatarStack
            users={feedback.voters}
            totalCount={feedback.total_voters}
            onOverflowClick={onViewSupporters}
            size={32}
          />
          {isOwner && onDelete && (
            <button
              type='button'
              onClick={onDelete}
              className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors'
              aria-label='Delete feedback'
              title='Delete feedback'
            >
              <RiDeleteBinLine size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden p-4'>
        {/* Content */}
        <div className='mb-3'>
          {/* Title - Using button for accessibility */}
          <button
            type='button'
            className='text-base font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors text-left w-full'
            onClick={onTitleClick}
          >
            {feedback.title}
          </button>

          {/* Description */}
          <p className='text-sm text-gray-600 mb-2 line-clamp-2'>{feedback.description}</p>

          {/* Metadata */}
          <div className='flex items-center gap-2 flex-wrap mb-2'>
            <FeedbackTypeBadge type={feedback.type} />
            <FeedbackStatusBadge status={feedback.status} />
          </div>

          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <span>
              {feedback.author?.name} • {timeAgo}
            </span>
            {isOwner && onDelete && (
              <button
                type='button'
                onClick={onDelete}
                className='p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors'
                aria-label='Delete feedback'
                title='Delete feedback'
              >
                <RiDeleteBinLine size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Footer with Vote Rail and Facepile */}
        <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
          <VoteRail
            score={feedback.score}
            userVote={feedback.user_vote}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            disabled={disabled}
          />

          <AvatarStack
            users={feedback.voters}
            totalCount={feedback.total_voters}
            onOverflowClick={onViewSupporters}
            size={28}
          />
        </div>
      </div>
    </div>
  )
}

export default FeedbackCard
