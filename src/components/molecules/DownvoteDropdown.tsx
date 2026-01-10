'use client'

import React, { useState, useRef, useEffect } from 'react'
import { DownvoteReason, DownvoteFormData } from '@/interfaces/feedback'

/**
 * Downvote Dropdown Props
 */
interface DownvoteDropdownProps {
  /**
   * Whether dropdown is open
   */
  isOpen: boolean

  /**
   * Close handler
   */
  onClose: () => void

  /**
   * Submit handler
   */
  onSubmit: (data: DownvoteFormData) => void

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Downvote reason options
 */
const REASON_OPTIONS: { value: DownvoteReason; label: string }[] = [
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'not_reproducible', label: 'Not Reproducible' },
  { value: 'spam', label: 'Spam' },
  { value: 'off_topic', label: 'Off Topic' },
  { value: 'unclear', label: 'Unclear' },
  { value: 'other', label: 'Other' }
]

/**
 * Downvote Dropdown Component
 * @description Inline dropdown for constructive downvoting with reason selection
 * Shows optional comment field only when "Other" is selected
 */
const DownvoteDropdown: React.FC<DownvoteDropdownProps> = ({ isOpen, onClose, onSubmit, className = '' }) => {
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherComment, setOtherComment] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus input when "Other" is selected
  useEffect(() => {
    if (showOtherInput) {
      inputRef.current?.focus()
    }
  }, [showOtherInput])

  const handleClose = () => {
    setShowOtherInput(false)
    setOtherComment('')
    onClose()
  }

  const handleReasonClick = (reason: DownvoteReason) => {
    if (reason === 'other') {
      setShowOtherInput(true)
    } else {
      onSubmit({ reason })
      handleClose()
    }
  }

  const handleOtherSubmit = () => {
    onSubmit({
      reason: 'other',
      comment: otherComment.trim() || undefined
    })
    handleClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'Enter' && showOtherInput) {
      handleOtherSubmit()
    }
  }

  if (!isOpen) return null

  // Render other input form
  if (showOtherInput) {
    return (
      <div
        ref={dropdownRef}
        className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] ${className}`}
      >
        <div className='px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-100'>
          Other reason (optional)
        </div>
        <div className='p-3'>
          <input
            ref={inputRef}
            type='text'
            value={otherComment}
            onChange={e => setOtherComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Please explain...'
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
          />
          <div className='flex items-center gap-2 mt-2'>
            <button
              type='button'
              onClick={() => setShowOtherInput(false)}
              className='flex-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors'
            >
              Back
            </button>
            <button
              type='button'
              onClick={handleOtherSubmit}
              className='flex-1 px-3 py-1.5 text-sm text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render reason options
  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] ${className}`}
    >
      <div className='px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-100'>
        Why are you downvoting?
      </div>
      {REASON_OPTIONS.map(option => (
        <button
          key={option.value}
          type='button'
          onClick={() => handleReasonClick(option.value)}
          className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default DownvoteDropdown
