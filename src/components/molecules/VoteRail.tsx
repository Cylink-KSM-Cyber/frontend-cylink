'use client'

import React from 'react'
import VoteButton from '@/components/atoms/VoteButton'
import VoteCounter from '@/components/atoms/VoteCounter'
import { VoteType } from '@/interfaces/feedback'

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
   * Downvote handler
   */
  onDownvote: () => void

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
 * @description Vertical voting column with upvote, counter, and downvote
 */
const VoteRail: React.FC<VoteRailProps> = ({
  score,
  userVote,
  onUpvote,
  onDownvote,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <VoteButton type='upvote' isActive={userVote === 'upvote'} onClick={onUpvote} disabled={disabled} />

      <VoteCounter count={score} />

      <VoteButton type='downvote' isActive={userVote === 'downvote'} onClick={onDownvote} disabled={disabled} />
    </div>
  )
}

export default VoteRail
