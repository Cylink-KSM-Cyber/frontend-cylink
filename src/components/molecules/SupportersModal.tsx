'use client'

import React, { useState } from 'react'
import Modal from '@/components/atoms/Modal'
import Avatar from '@/components/atoms/Avatar'
import SearchInput from '@/components/atoms/SearchInput'
import { FeedbackUser } from '@/interfaces/feedback'

/**
 * Supporters Modal Props
 */
interface SupportersModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean

  /**
   * Close handler
   */
  onClose: () => void

  /**
   * List of supporters
   */
  supporters: FeedbackUser[]

  /**
   * Total count of supporters
   */
  totalCount: number
}

/**
 * Supporters Modal Component
 * @description Modal showing all supporters with search functionality
 */
const SupportersModal: React.FC<SupportersModalProps> = ({ isOpen, onClose, supporters, totalCount }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSupporters = supporters.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Supporters (${totalCount})`} size='md'>
      <div className='space-y-4'>
        {/* Search */}
        <SearchInput
          onSearch={setSearchQuery}
          initialValue={searchQuery}
          placeholder='Search supporters...'
          className='w-full'
        />

        {/* Supporters List */}
        <div className='max-h-96 overflow-y-auto space-y-2'>
          {filteredSupporters.length === 0 ? (
            <p className='text-center text-gray-500 py-8'>
              {searchQuery ? 'No supporters found' : 'No supporters yet'}
            </p>
          ) : (
            filteredSupporters.map(user => (
              <div key={user.id} className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                <Avatar username={user.name} size={40} isClickable={false} ariaLabel={`Avatar of ${user.name}`} />
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-gray-900 truncate'>{user.name}</div>
                  <div className='text-sm text-gray-500 truncate'>{user.email}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SupportersModal
