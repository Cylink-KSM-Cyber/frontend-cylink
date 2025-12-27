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
  const [showDownvoteModal, setShowDownvoteModal] = useState<boolean>(false)
  const [pendingDownvote, setPendingDownvote] = useState<{
    feedbackId: number
    onSuccess: (item: FeedbackItem) => void
  } | null>(null)
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
   * Handle downvote action (shows modal for reason)
   * @param feedbackId - ID of feedback to downvote
   * @param currentVote - Current user's vote (if any)
   * @param onSuccess - Callback with updated feedback item
   */
  const handleDownvote = useCallback(
    async (feedbackId: number, currentVote: VoteType | undefined, onSuccess: (item: FeedbackItem) => void) => {
      logger.debug('Handling downvote', { feedbackId, currentVote })

      // If already downvoted, remove vote
      if (currentVote === 'downvote') {
        setIsVoting(true)
        try {
          const response = await removeVote(feedbackId)
          onSuccess(response.data)
          showToast('Vote removed', 'white', 2000)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to remove vote'
          logger.error('Remove vote failed', { err })
          showToast(errorMessage, 'error', 3000)
        } finally {
          setIsVoting(false)
        }
      } else {
        // Otherwise, show modal to get reason
        setPendingDownvote({ feedbackId, onSuccess })
        setShowDownvoteModal(true)
      }
    },
    [showToast]
  )

  /**
   * Submit downvote with reason
   * @param data - Downvote form data with reason
   */
  const submitDownvote = useCallback(
    async (data: DownvoteFormData) => {
      if (!pendingDownvote) return

      setIsVoting(true)
      logger.debug('Submitting downvote with reason', { data })

      try {
        const response = await voteFeedback(pendingDownvote.feedbackId, 'downvote', data)
        pendingDownvote.onSuccess(response.data)
        showToast('Downvote recorded', 'white', 2000)
        setShowDownvoteModal(false)
        setPendingDownvote(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to downvote'
        logger.error('Downvote failed', { err })
        showToast(errorMessage, 'error', 3000)
      } finally {
        setIsVoting(false)
      }
    },
    [pendingDownvote, showToast]
  )

  /**
   * Cancel downvote modal
   */
  const cancelDownvote = useCallback(() => {
    setShowDownvoteModal(false)
    setPendingDownvote(null)
  }, [])

  return {
    isVoting,
    showDownvoteModal,
    handleUpvote,
    handleDownvote,
    submitDownvote,
    cancelDownvote
  }
}

export default useFeedbackVoting
