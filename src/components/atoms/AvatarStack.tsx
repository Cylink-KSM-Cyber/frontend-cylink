'use client'

import React, { useState } from 'react'
import Avatar from '@/components/atoms/Avatar'
import { FeedbackUser } from '@/interfaces/feedback'

/**
 * Avatar Stack Props
 */
interface AvatarStackProps {
  /**
   * Array of users to display (first 5)
   */
  users: FeedbackUser[]

  /**
   * Total number of supporters
   */
  totalCount: number

  /**
   * Click handler for overflow counter
   */
  onOverflowClick?: () => void

  /**
   * Size of avatars in pixels
   */
  size?: number

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Avatar Stack Component
 * @description Facepile showing first 5 supporters with overflow counter
 * Implements UX research specifications:
 * - First 5 avatars with 25% overlap
 * - 2px white border for separation
 * - +N counter for additional supporters
 * - Hover tooltips
 * - Last-on-top z-index layering
 */
const AvatarStack: React.FC<AvatarStackProps> = ({ users, totalCount, onOverflowClick, size = 32, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Display first 5 users
  const displayUsers = users.slice(0, 5)
  const overflowCount = totalCount - displayUsers.length

  // Calculate overlap (25% of avatar size)
  const overlap = size * 0.25

  if (totalCount === 0) {
    return null
  }

  return (
    <div className={`flex items-center ${className}`} role='group' aria-label='Supporters'>
      {/* Avatar stack */}
      <div className='flex items-center' style={{ marginRight: overflowCount > 0 ? `-${overlap}px` : 0 }}>
        {displayUsers.map((user, index) => (
          <div
            key={user.id}
            className='relative'
            style={{
              marginLeft: index > 0 ? `-${overlap}px` : 0,
              zIndex: displayUsers.length - index
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className='relative' style={{ width: size, height: size }}>
              <div className='absolute inset-0 rounded-full bg-white' style={{ padding: '2px' }}>
                <Avatar username={user.name} size={size - 4} isClickable={false} ariaLabel={`Avatar of ${user.name}`} />
              </div>
            </div>

            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50'>
                {user.name}
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 -mt-1'>
                  <div className='border-4 border-transparent border-t-gray-900'></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overflow counter */}
      {overflowCount > 0 && (
        <button
          type='button'
          onClick={onOverflowClick}
          className='flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-xs hover:bg-gray-300 transition-colors duration-200 border-2 border-white'
          style={{
            width: size,
            height: size,
            marginLeft: `-${overlap}px`,
            zIndex: 0
          }}
          aria-label={`View all ${totalCount} supporters`}
        >
          +{overflowCount}
        </button>
      )}
    </div>
  )
}

export default AvatarStack
