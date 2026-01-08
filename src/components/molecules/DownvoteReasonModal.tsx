'use client'

import React, { useState } from 'react'
import Modal from '@/components/atoms/Modal'
import Button from '@/components/atoms/Button'
import { DownvoteReason, DownvoteFormData } from '@/interfaces/feedback'

/**
 * Downvote Reason Modal Props
 */
interface DownvoteReasonModalProps {
  /**
   * Whether modal is open
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
   * Whether form is submitting
   */
  isSubmitting?: boolean
}

/**
 * Downvote reason options
 */
const REASON_OPTIONS: { value: DownvoteReason; label: string; description: string }[] = [
  {
    value: 'duplicate',
    label: 'Duplicate',
    description: 'This feedback already exists'
  },
  {
    value: 'not_reproducible',
    label: 'Not Reproducible',
    description: 'Cannot reproduce the described issue'
  },
  {
    value: 'spam',
    label: 'Spam',
    description: 'This is spam or inappropriate content'
  },
  {
    value: 'off_topic',
    label: 'Off Topic',
    description: 'Not relevant to this product'
  },
  {
    value: 'unclear',
    label: 'Unclear',
    description: 'Description is too vague or unclear'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Another reason (please explain)'
  }
]

/**
 * Downvote Reason Modal Component
 * @description Modal for constructive downvoting with reason selection
 */
const DownvoteReasonModal: React.FC<DownvoteReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [selectedReason, setSelectedReason] = useState<DownvoteReason | null>(null)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (!selectedReason) return

    onSubmit({
      reason: selectedReason,
      comment: comment.trim() || undefined
    })

    // Reset form
    setSelectedReason(null)
    setComment('')
  }

  const handleClose = () => {
    setSelectedReason(null)
    setComment('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Why are you downvoting?' size='md'>
      <div className='space-y-4'>
        <p className='text-sm text-gray-600'>Please select a reason to help us understand your feedback better.</p>

        {/* Reason Options */}
        <div className='space-y-2'>
          {REASON_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`
                flex items-start p-3 border rounded-lg cursor-pointer transition-colors
                ${
                  selectedReason === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type='radio'
                name='reason'
                value={option.value}
                checked={selectedReason === option.value}
                onChange={() => setSelectedReason(option.value)}
                className='mt-1 mr-3'
              />
              <div className='flex-1'>
                <div className='font-medium text-gray-900'>{option.label}</div>
                <div className='text-sm text-gray-600'>{option.description}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Optional Comment */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Additional Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder='Provide more context if needed...'
          />
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            className='bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedReason || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Downvote'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DownvoteReasonModal
