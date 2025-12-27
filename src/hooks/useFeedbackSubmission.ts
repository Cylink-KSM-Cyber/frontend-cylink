'use client'

import { useState, useCallback, useEffect } from 'react'
import { CreateFeedbackFormData, FeedbackItem } from '@/interfaces/feedback'
import { createFeedback, searchSimilar } from '@/services/feedback'
import { useToast } from '@/contexts/ToastContext'
import logger from '@/utils/logger'

/**
 * Custom hook for feedback submission
 * @returns Submission functions and state
 */
export const useFeedbackSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [similarFeedback, setSimilarFeedback] = useState<FeedbackItem[]>([])
  const [isSearchingSimilar, setIsSearchingSimilar] = useState<boolean>(false)
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const { showToast } = useToast()

  /**
   * Search for similar feedback items (duplicate detection)
   * @param title - Title to search for
   */
  const searchForSimilar = useCallback(async (title: string) => {
    if (title.trim().length < 3) {
      setSimilarFeedback([])
      return
    }

    setIsSearchingSimilar(true)
    logger.debug('Searching for similar feedback', { title })

    try {
      const response = await searchSimilar(title)
      setSimilarFeedback(response.data)
    } catch (err) {
      logger.error('Failed to search similar feedback', { err })
      setSimilarFeedback([])
    } finally {
      setIsSearchingSimilar(false)
    }
  }, [])

  /**
   * Handle title change with debounced search
   * @param title - New title value
   */
  const handleTitleChange = useCallback(
    (title: string) => {
      // Clear existing timer
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
      }

      // Set new timer for debounced search
      const timer = setTimeout(() => {
        searchForSimilar(title)
      }, 500)

      setSearchDebounceTimer(timer)
    },
    [searchDebounceTimer, searchForSimilar]
  )

  /**
   * Submit new feedback
   * @param data - Feedback form data
   * @param onSuccess - Callback on successful submission
   */
  const submitFeedback = useCallback(
    async (data: CreateFeedbackFormData, onSuccess?: (item: FeedbackItem) => void) => {
      setIsSubmitting(true)
      logger.debug('Submitting feedback', { data })

      try {
        const response = await createFeedback(data)
        showToast('Feedback submitted successfully', 'white', 3000)

        // Clear similar feedback
        setSimilarFeedback([])

        // Call success callback
        if (onSuccess) {
          onSuccess(response.data)
        }

        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback'
        logger.error('Feedback submission failed', { err })
        showToast(errorMessage, 'error', 4000)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [showToast]
  )

  /**
   * Clear similar feedback results
   */
  const clearSimilar = useCallback(() => {
    setSimilarFeedback([])
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
      }
    }
  }, [searchDebounceTimer])

  return {
    isSubmitting,
    similarFeedback,
    isSearchingSimilar,
    handleTitleChange,
    submitFeedback,
    clearSimilar
  }
}

export default useFeedbackSubmission
