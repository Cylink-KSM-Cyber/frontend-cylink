'use client'

import { useState, useCallback } from 'react'
import { FeedbackType, FeedbackStatus } from '@/interfaces/feedback'

/**
 * Custom hook for feedback filtering and sorting
 * @returns Filter state and update functions
 */
export const useFeedbackFilter = () => {
  const [type, setType] = useState<FeedbackType | 'all'>('all')
  const [status, setStatus] = useState<FeedbackStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'trending' | 'top_voted' | 'newest'>('trending')
  const [search, setSearch] = useState<string>('')
  const [myVotes, setMyVotes] = useState<boolean>(false)

  /**
   * Update type filter
   */
  const updateType = useCallback((newType: FeedbackType | 'all') => {
    setType(newType)
  }, [])

  /**
   * Update status filter
   */
  const updateStatus = useCallback((newStatus: FeedbackStatus | 'all') => {
    setStatus(newStatus)
  }, [])

  /**
   * Update sort option
   */
  const updateSortBy = useCallback((newSortBy: 'trending' | 'top_voted' | 'newest') => {
    setSortBy(newSortBy)
  }, [])

  /**
   * Update search query
   */
  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch)
  }, [])

  /**
   * Toggle "My Votes" filter
   */
  const toggleMyVotes = useCallback(() => {
    setMyVotes(prev => !prev)
  }, [])

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setType('all')
    setStatus('all')
    setSortBy('trending')
    setSearch('')
    setMyVotes(false)
  }, [])

  /**
   * Get filter object for API call
   */
  const getFilterObject = useCallback(() => {
    return {
      type,
      status,
      sortBy,
      search: search.trim() || undefined,
      myVotes: myVotes || undefined
    }
  }, [type, status, sortBy, search, myVotes])

  return {
    type,
    status,
    sortBy,
    search,
    myVotes,
    updateType,
    updateStatus,
    updateSortBy,
    updateSearch,
    toggleMyVotes,
    resetFilters,
    getFilterObject
  }
}

export default useFeedbackFilter
