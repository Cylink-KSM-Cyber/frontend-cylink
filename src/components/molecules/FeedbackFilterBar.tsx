'use client'

import React, { useState, useRef, useEffect } from 'react'
import { RiApps2Line, RiLightbulbLine, RiBugLine, RiUserLine, RiArrowDownSLine } from 'react-icons/ri'
import SearchInput from '@/components/atoms/SearchInput'
import { FeedbackType } from '@/interfaces/feedback'

/**
 * Type filter including 'all' option
 */
type FeedbackTypeFilter = FeedbackType | 'all'

/**
 * Sort option for feedback list
 */
type FeedbackSortOption = 'trending' | 'top_voted' | 'newest'

/**
 * Feedback Filter Bar Props
 */
interface FeedbackFilterBarProps {
  /**
   * Current type filter
   */
  type: FeedbackTypeFilter

  /**
   * Current sort option
   */
  sortBy: FeedbackSortOption

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
  onTypeChange: (type: FeedbackTypeFilter) => void

  /**
   * Sort change handler
   */
  onSortChange: (sort: FeedbackSortOption) => void

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

const TYPE_TABS: { value: FeedbackTypeFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <RiApps2Line size={16} /> },
  { value: 'feature', label: 'Features', icon: <RiLightbulbLine size={16} /> },
  { value: 'bug', label: 'Bugs', icon: <RiBugLine size={16} /> }
]

const SORT_OPTIONS: { value: FeedbackSortOption; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'top_voted', label: 'Top Voted' },
  { value: 'newest', label: 'Newest' }
]

/**
 * Feedback Filter Bar Component
 * @description Filter and sort controls for feedback list with tab-style type filter and sort dropdown
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
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(target)
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSortDropdown(false)
      }
    }

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortDropdown])

  const selectedSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label ?? 'Trending'

  const handleSortSelect = (value: FeedbackSortOption) => {
    onSortChange(value)
    setShowSortDropdown(false)
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-3 ${className}`}>
      {/* Desktop Layout */}
      <div className='hidden lg:flex items-center justify-between gap-4'>
        {/* Left: Type Tabs */}
        <div className='flex items-center gap-1'>
          {TYPE_TABS.map(tab => (
            <button
              key={tab.value}
              type='button'
              onClick={() => onTypeChange(tab.value)}
              className={`
                flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${type === tab.value ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Center: Search */}
        <div className='flex-1 max-w-md'>
          <SearchInput
            onSearch={onSearchChange}
            initialValue={search}
            placeholder='Search feedback...'
            className='w-full'
          />
        </div>

        {/* Right: My Votes + Sort Dropdown */}
        <div className='flex items-center gap-3'>
          {/* My Votes Toggle */}
          <button
            type='button'
            onClick={onMyVotesToggle}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${myVotes ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <RiUserLine size={16} />
            My Votes
          </button>

          {/* Sort Dropdown */}
          <div className='relative' ref={desktopDropdownRef}>
            <button
              type='button'
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className='flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200'
            >
              {selectedSortLabel}
              <RiArrowDownSLine size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50'>
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleSortSelect(option.value)}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors
                      ${
                        sortBy === option.value
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Three-row design for better UX */}
      <div className='lg:hidden space-y-3'>
        {/* Row 1: Search */}
        <SearchInput
          onSearch={onSearchChange}
          initialValue={search}
          placeholder='Search feedback...'
          className='w-full'
        />

        {/* Row 2: Type Filters - Full width horizontal scroll */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide'>
          {TYPE_TABS.map(tab => (
            <button
              key={tab.value}
              type='button'
              onClick={() => onTypeChange(tab.value)}
              className={`
                flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg 
                whitespace-nowrap transition-all duration-200 shrink-0
                ${type === tab.value ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Row 3: My Votes + Sort - Separated row with better spacing */}
        <div className='flex items-center justify-between'>
          {/* My Votes Toggle - with visible label */}
          <button
            type='button'
            onClick={onMyVotesToggle}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${myVotes ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <RiUserLine size={16} />
            <span>My Votes</span>
          </button>

          {/* Sort Dropdown Mobile - Larger tap target */}
          <div className='relative' ref={mobileDropdownRef}>
            <button
              type='button'
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className='flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200'
            >
              {selectedSortLabel}
              <RiArrowDownSLine size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50'>
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleSortSelect(option.value)}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors
                      ${
                        sortBy === option.value
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackFilterBar
