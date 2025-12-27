'use client'

import React from 'react'
import SegmentedControl, { SegmentedControlOption } from '@/components/atoms/SegmentedControl'
import SearchInput from '@/components/atoms/SearchInput'
import { FeedbackType } from '@/interfaces/feedback'

/**
 * Feedback Filter Bar Props
 */
interface FeedbackFilterBarProps {
  /**
   * Current type filter
   */
  type: FeedbackType | 'all'

  /**
   * Current sort option
   */
  sortBy: 'trending' | 'top_voted' | 'newest'

  /**
   * Current search query
   */
  search: string

  /**
   * Whether "My Votes" filter is active
   */
  myVotes: boolean

  /**
   * Type filter change handler
   */
  onTypeChange: (type: FeedbackType | 'all') => void

  /**
   * Sort change handler
   */
  onSortChange: (sort: 'trending' | 'top_voted' | 'newest') => void

  /**
   * Search change handler
   */
  onSearchChange: (search: string) => void

  /**
   * My Votes toggle handler
   */
  onMyVotesToggle: () => void

  /**
   * Additional CSS classes
   */
  className?: string
}

const TYPE_OPTIONS: SegmentedControlOption<FeedbackType | 'all'>[] = [
  { value: 'all', label: 'All' },
  { value: 'feature', label: 'Features' },
  { value: 'bug', label: 'Bugs' }
]

const SORT_OPTIONS: SegmentedControlOption<'trending' | 'top_voted' | 'newest'>[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'top_voted', label: 'Top Voted' },
  { value: 'newest', label: 'Newest' }
]

/**
 * Feedback Filter Bar Component
 * @description Filter and sort controls for feedback list
 */
const FeedbackFilterBar: React.FC<FeedbackFilterBarProps> = ({
  type,
  sortBy,
  search,
  myVotes,
  onTypeChange,
  onSortChange,
  onSearchChange,
  onMyVotesToggle,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Desktop Layout */}
      <div className='hidden lg:flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          {/* Type Filter */}
          <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={onTypeChange} />

          {/* Sort */}
          <SegmentedControl options={SORT_OPTIONS} value={sortBy} onChange={onSortChange} />
        </div>

        <div className='flex items-center gap-4'>
          {/* My Votes Toggle */}
          <button
            type='button'
            onClick={onMyVotesToggle}
            className={`
              px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200
              ${
                myVotes
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            My Votes
          </button>

          {/* Search */}
          <SearchInput
            onSearch={onSearchChange}
            initialValue={search}
            placeholder='Search feedback...'
            className='w-64'
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden space-y-3'>
        {/* Search */}
        <SearchInput
          onSearch={onSearchChange}
          initialValue={search}
          placeholder='Search feedback...'
          className='w-full'
        />

        {/* Type Filter - Scrollable */}
        <div className='overflow-x-auto'>
          <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={onTypeChange} />
        </div>

        {/* Sort and My Votes */}
        <div className='flex items-center gap-2 overflow-x-auto'>
          <SegmentedControl options={SORT_OPTIONS} value={sortBy} onChange={onSortChange} />

          <button
            type='button'
            onClick={onMyVotesToggle}
            className={`
              flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200
              ${myVotes ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200'}
            `}
          >
            My Votes
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackFilterBar
