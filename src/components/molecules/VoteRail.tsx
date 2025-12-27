'use client'

import React, { useState } from 'react'
import VoteButton from '@/components/atoms/VoteButton'
import VoteCounter from '@/components/atoms/VoteCounter'
import DownvoteDropdown from '@/components/molecules/DownvoteDropdown'
import { VoteType, DownvoteFormData } from '@/interfaces/feedback'

/**
 * Vote Rail Props
 */
interface VoteRailProps {
  /**
   * Current vote score
   */
  score: number

  /**
   * Current user's vote
   */
  userVote?: VoteType

  /**
   * Upvote handler
   */
  onUpvote: () => void

  /**
   * Downvote handler with reason
   */
  onDownvote: (data?: DownvoteFormData) => void

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
 * Vote Rail Component
 * @description Vertical voting column with upvote, counter, and downvote dropdown
 */
const VoteRail: React.FC<VoteRailProps> = ({
  score,
  userVote,
  onUpvote,
  onDownvote,
  disabled = false,
  className = ''
}) => {
  const [showDownvoteDropdown, setShowDownvoteDropdown] = useState(false)

  const handleDownvoteClick = () => {
    // If already downvoted, toggle it off
    if (userVote === 'downvote') {
      onDownvote()
    } else {
      // Show dropdown for new downvote
      setShowDownvoteDropdown(true)
    }
  }

  const handleDownvoteSubmit = (data: DownvoteFormData) => {
    onDownvote(data)
    setShowDownvoteDropdown(false)
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <VoteButton type='upvote' isActive={userVote === 'upvote'} onClick={onUpvote} disabled={disabled} />

      <VoteCounter count={score} />

      <div className='relative'>
        <VoteButton
          type='downvote'
          isActive={userVote === 'downvote'}
          onClick={handleDownvoteClick}
          disabled={disabled}
        />

        <DownvoteDropdown
          isOpen={showDownvoteDropdown}
          onClose={() => setShowDownvoteDropdown(false)}
          onSubmit={handleDownvoteSubmit}
          className='left-full top-0 ml-2'
        />
      </div>
    </div>
  )
}

export default VoteRail
