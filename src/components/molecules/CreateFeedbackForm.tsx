'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeedbackFormData, FeedbackType, FeedbackItem } from '@/interfaces/feedback'
import { RiLightbulbLine, RiBugLine } from 'react-icons/ri'

/**
 * Form validation schema - Simplified to encourage participation
 */
const feedbackSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['bug', 'feature'])
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

/**
 * Create Feedback Form Props
 */
interface CreateFeedbackFormProps {
  /**
   * Similar feedback items (for duplicate detection)
   */
  similarFeedback: FeedbackItem[]

  /**
   * Whether similar search is loading
   */
  isSearchingSimilar: boolean

  /**
   * Title change handler (for duplicate detection)
   */
  onTitleChange: (title: string) => void

  /**
   * Form submission handler
   */
  onSubmit: (data: CreateFeedbackFormData) => void

  /**
   * Cancel handler
   */
  onCancel: () => void

  /**
   * Whether form is submitting
   */
  isSubmitting?: boolean
}

/**
 * Create Feedback Form Component
 * @description Simplified feedback form with only essential fields (Type, Title, Description)
 * Following best practices: 2-4 fields to encourage user participation
 */
const CreateFeedbackForm: React.FC<CreateFeedbackFormProps> = ({
  similarFeedback,
  isSearchingSimilar,
  onTitleChange,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'feature',
      title: '',
      description: ''
    }
  })

  const title = watch('title')

  // Trigger duplicate search on title change
  React.useEffect(() => {
    if (title && title.length >= 3) {
      onTitleChange(title)
    }
  }, [title, onTitleChange])

  const handleFormSubmit = (data: FeedbackFormValues) => {
    onSubmit(data as CreateFeedbackFormData)
  }

  const handleTypeChange = (type: FeedbackType) => {
    setFeedbackType(type)
    setValue('type', type)
  }

  // Get placeholder based on type
  const getDescriptionPlaceholder = () => {
    if (feedbackType === 'bug') {
      return "Describe what's not working and how it affects you. Include any context that helps us understand the issue."
    }
    return 'Describe the feature you want and why it would be helpful. The more context you provide, the better we can understand your needs.'
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-5'>
      {/* Type Selector - Icon-based toggle */}
      <div>
        <span className='block text-sm font-medium text-gray-700 mb-3'>What would you like to share?</span>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => handleTypeChange('feature')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all duration-200
              ${
                feedbackType === 'feature'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <RiLightbulbLine size={20} />
            <span className='font-medium'>Feature Request</span>
          </button>
          <button
            type='button'
            onClick={() => handleTypeChange('bug')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all duration-200
              ${
                feedbackType === 'bug'
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <RiBugLine size={20} />
            <span className='font-medium'>Bug Report</span>
          </button>
        </div>
        <input type='hidden' {...register('type')} value={feedbackType} />
      </div>

      {/* Title with standard label (no floating) */}
      <div className='transition-all duration-200 ease-out'>
        <label htmlFor='feedback-title' className='block text-sm font-medium text-gray-700 mb-1'>
          {feedbackType === 'bug' ? 'What went wrong?' : 'What do you want to see?'}
        </label>
        <input
          {...register('title')}
          id='feedback-title'
          type='text'
          placeholder={feedbackType === 'bug' ? 'e.g., Login button not working on mobile' : 'e.g., Dark mode support'}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200'
        />
        {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}

        {/* Similar Feedback (Duplicate Detection) with animation */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            isSearchingSimilar || similarFeedback.length > 0 ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          {isSearchingSimilar && (
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin' />
              Checking for similar feedback...
            </div>
          )}

          {!isSearchingSimilar && similarFeedback.length > 0 && (
            <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg'>
              <p className='text-sm font-medium text-amber-800 mb-2'>
                💡 Similar feedback found - consider voting instead:
              </p>
              <div className='space-y-1.5'>
                {similarFeedback.slice(0, 3).map(item => (
                  <button
                    key={item.id}
                    type='button'
                    className='w-full text-left text-sm p-2 rounded hover:bg-amber-100 transition-colors flex items-center justify-between group'
                    onClick={e => {
                      e.preventDefault()
                      // In real implementation, navigate to feedback detail
                    }}
                  >
                    <span className='text-amber-900 group-hover:text-amber-950'>{item.title}</span>
                    <span className='text-amber-600 text-xs shrink-0 ml-2'>{item.score} votes</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description with dynamic placeholder */}
      <div className='transition-all duration-200 ease-out'>
        <label htmlFor='feedback-description' className='block text-sm font-medium text-gray-700 mb-1'>
          Tell us more
        </label>
        <textarea
          {...register('description')}
          id='feedback-description'
          rows={4}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all duration-200'
          placeholder={getDescriptionPlaceholder()}
        />
        {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
      </div>

      {/* Actions with visible Cancel button */}
      <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-100'>
        <button
          type='button'
          onClick={onCancel}
          disabled={isSubmitting}
          className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50'
        >
          {isSubmitting ? (
            <span className='flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  )
}

export default CreateFeedbackForm
