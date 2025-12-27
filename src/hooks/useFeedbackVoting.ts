'use client'

import { useState, useCallback } from 'react'
import { FeedbackItem, VoteType, DownvoteFormData } from '@/interfaces/feedback'
import { voteFeedback, removeVote } from '@/services/feedback'
import { useToast } from '@/contexts/ToastContext'
import logger from '@/utils/logger'

/**
 * Custom hook for feedback voting functionality
 * @returns Voting functions and state
 */
export const useFeedbackVoting = () => {
  const [isVoting, setIsVoting] = useState<boolean>(false)
  const { showToast } = useToast()

  /**
   * Handle upvote action
   * @param feedbackId - ID of feedback to upvote
   * @param currentVote - Current user's vote (if any)
   * @param onSuccess - Callback with updated feedback item
   */
  const handleUpvote = useCallback(
    async (feedbackId: number, currentVote: VoteType | undefined, onSuccess: (item: FeedbackItem) => void) => {
      setIsVoting(true)
      logger.debug('Handling upvote', { feedbackId, currentVote })

      try {
        // If already upvoted, remove vote
        if (currentVote === 'upvote') {
          const response = await removeVote(feedbackId)
          onSuccess(response.data)
          showToast('Vote removed', 'white', 2000)
        } else {
          // Otherwise, add upvote
          const response = await voteFeedback(feedbackId, 'upvote')
          onSuccess(response.data)
          showToast('Upvoted successfully', 'white', 2000)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to vote'
        logger.error('Upvote failed', { err })
        showToast(errorMessage, 'error', 3000)
      } finally {
        setIsVoting(false)
      }
    },
    [showToast]
  )

  /**
   * Handle downvote action with optional reason data
   * @param feedbackId - ID of feedback to downvote
   * @param currentVote - Current user's vote (if any)
   * @param onSuccess - Callback with updated feedback item
   * @param data - Optional downvote form data with reason
   */
  const handleDownvote = useCallback(
    async (
      feedbackId: number,
      currentVote: VoteType | undefined,
      onSuccess: (item: FeedbackItem) => void,
      data?: DownvoteFormData
    ) => {
      setIsVoting(true)
      logger.debug('Handling downvote', { feedbackId, currentVote, data })

      try {
        // If already downvoted, remove vote
        if (currentVote === 'downvote') {
          const response = await removeVote(feedbackId)
          onSuccess(response.data)
          showToast('Vote removed', 'white', 2000)
        } else {
          // Otherwise, add downvote with reason
          const response = await voteFeedback(feedbackId, 'downvote', data)
          onSuccess(response.data)
          showToast('Downvote recorded', 'white', 2000)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to downvote'
        logger.error('Downvote failed', { err })
        showToast(errorMessage, 'error', 3000)
      } finally {
        setIsVoting(false)
      }
    },
    [showToast]
  )

  return {
    isVoting,
    handleUpvote,
    handleDownvote
  }
}

export default useFeedbackVoting
