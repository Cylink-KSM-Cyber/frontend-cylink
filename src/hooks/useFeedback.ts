'use client'
import { useState, useEffect, useCallback } from 'react'
import { FeedbackItem, FeedbackFilter } from '@/interfaces/feedback'
import { fetchFeedback, deleteFeedback } from '@/services/feedback'
import { useToast } from '@/contexts/ToastContext'
import logger from '@/utils/logger'
/**
 * Custom hook for fetching and managing feedback items
 * @param initialFilter - Initial filter settings
 * @returns Feedback data, loading state, and management functions
 */
export const useFeedback = (
  initialFilter: FeedbackFilter = {
    type: 'all',
    status: 'all',
    sortBy: 'trending',
    page: 1,
    limit: 10
  }
) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [filter, setFilter] = useState<FeedbackFilter>(initialFilter)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0
  })
  const { showToast } = useToast()
  /**
   * Fetch feedback based on current filter
   */
  const fetchFeedbackData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    logger.debug('Fetching feedback with filter', { filter })
    try {
      const response = await fetchFeedback(filter)
      logger.debug('Feedback API response', { response })
      if (response?.data) {
        setFeedback(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        logger.error('Unexpected API response structure', { response })
        setError(new Error('Unexpected API response structure'))
        setFeedback([])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedback'))
      logger.error('Failed to fetch feedback', { err })
      showToast('Failed to load feedback', 'error', 4000)
    } finally {
      setIsLoading(false)
    }
  }, [filter, showToast])
  // Fetch feedback when filter changes
  useEffect(() => {
    fetchFeedbackData()
  }, [fetchFeedbackData])
  /**
   * Update filter settings
   * @param newFilter - New filter settings to apply
   */
  const updateFilter = useCallback((newFilter: Partial<FeedbackFilter>) => {
    logger.debug('Updating filter', { newFilter })
    setFilter(prevFilter => ({
      ...prevFilter,
      ...newFilter,
      // Reset to page 1 if any filter other than page changes
      page: newFilter.page ?? 1
    }))
  }, [])
  /**
   * Manually refresh feedback data
   */
  const refreshFeedback = useCallback(() => {
    logger.debug('Manually refreshing feedback')
    return fetchFeedbackData()
  }, [fetchFeedbackData])
  /**
   * Delete a feedback item by ID
   * @param id - ID of the feedback to delete
   * @returns Promise resolving to success status
   */
  const deleteFeedbackItem = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deleteFeedback(id)
        // Display success toast
        showToast('Feedback deleted successfully', 'white', 4000)
        // Refresh feedback after deletion
        await fetchFeedbackData()
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete feedback'
        setError(err instanceof Error ? err : new Error(errorMessage))
        // Display error toast
        showToast(errorMessage, 'error', 4000)
        return false
      }
    },
    [showToast, fetchFeedbackData]
  )
  /**
   * Update a single feedback item in the list (for optimistic updates)
   */
  const updateFeedbackItem = useCallback((updatedItem: FeedbackItem) => {
    setFeedback(prevFeedback => prevFeedback.map(item => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])
  return {
    feedback,
    isLoading,
    error,
    pagination,
    filter,
    updateFilter,
    refreshFeedback,
    deleteFeedbackItem,
    updateFeedbackItem
  }
}
export default useFeedback
