'use client'

import React from 'react'
import { FeedbackItem } from '@/interfaces/feedback'
import Modal from '@/components/atoms/Modal'
import Button from '@/components/atoms/Button'
import { RiAlertLine, RiDeleteBinLine } from 'react-icons/ri'

/**
 * DeleteFeedbackModal props
 * @interface DeleteFeedbackModalProps
 */
interface DeleteFeedbackModalProps {
  /** The feedback item to delete */
  feedback: FeedbackItem | null
  /** Whether the modal is visible */
  isOpen: boolean
  /** Function to call when deletion is confirmed */
  onConfirm: (feedback: FeedbackItem) => void
  /** Function to call when deletion is canceled */
  onCancel: () => void
  /** Whether deletion is in progress */
  isDeleting?: boolean
}

/**
 * DeleteFeedbackModal Component
 * @description Modal for confirming feedback deletion with appropriate warning visuals
 */
const DeleteFeedbackModal: React.FC<DeleteFeedbackModalProps> = ({
  feedback,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  // Don't render if no feedback is provided
  if (!feedback) return null

  /**
   * Handle confirm button click
   */
  const handleConfirm = () => {
    onConfirm(feedback)
  }

  /**
   * Truncate text for display
   */
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <Modal
      title='Delete Feedback'
      isOpen={isOpen}
      onClose={onCancel}
      variant='danger'
      size='sm'
      overlayStyle='glassmorphism'
      footer={
        <>
          <Button variant='secondary' onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleConfirm}
            disabled={isDeleting}
            loading={isDeleting}
            startIcon={<RiDeleteBinLine />}
          >
            {isDeleting ? 'Deleting...' : 'Delete Feedback'}
          </Button>
        </>
      }
    >
      <div className='flex flex-col items-center py-2'>
        <div className='mb-4 rounded-full bg-red-100 p-3 text-red-600'>
          <RiAlertLine className='h-6 w-6' />
        </div>

        <h4 className='mb-2 text-center text-lg font-medium text-gray-900'>
          Are you sure you want to delete this feedback?
        </h4>

        <p className='mb-4 text-center text-sm text-gray-600'>
          This action cannot be undone. The feedback and all associated votes will be permanently removed.
        </p>

        <div className='mb-4 w-full rounded-md bg-gray-50 p-3'>
          <div className='mb-1 text-xs font-medium text-gray-500'>Feedback Title</div>
          <div className='text-sm font-medium text-black'>{truncateText(feedback.title, 80)}</div>

          <div className='mt-3 text-xs font-medium text-gray-500'>Type</div>
          <div className='text-sm text-gray-700 capitalize'>{feedback.type}</div>

          <div className='mt-3 flex justify-between'>
            <div>
              <div className='text-xs font-medium text-gray-500'>Votes</div>
              <div className='text-sm text-gray-700'>{feedback.score}</div>
            </div>

            <div>
              <div className='text-xs font-medium text-gray-500'>Status</div>
              <div className='text-sm text-gray-700 capitalize'>{feedback.status.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteFeedbackModal
