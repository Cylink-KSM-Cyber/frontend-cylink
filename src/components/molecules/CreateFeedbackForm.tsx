'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeedbackFormData, FeedbackType, FeedbackItem } from '@/interfaces/feedback'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import SegmentedControl from '@/components/atoms/SegmentedControl'

/**
 * Form validation schema
 */
const feedbackSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['bug', 'feature']),
  reproduction_steps: z.string().optional(),
  expected_behavior: z.string().optional(),
  actual_behavior: z.string().optional(),
  use_case: z.string().optional()
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
 * @description Form for creating new feedback with duplicate detection
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
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Type Selector */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Type</label>
        <SegmentedControl
          options={[
            { value: 'feature' as FeedbackType, label: 'Feature Request' },
            { value: 'bug' as FeedbackType, label: 'Bug Report' }
          ]}
          value={feedbackType}
          onChange={handleTypeChange}
        />
        <input type='hidden' {...register('type')} value={feedbackType} />
      </div>

      {/* Title */}
      <div>
        <Input
          label='Title'
          placeholder={feedbackType === 'bug' ? 'Describe the bug briefly' : 'Describe the feature you want'}
          error={errors.title?.message}
          fullWidth
          {...register('title')}
        />

        {/* Similar Feedback (Duplicate Detection) */}
        {isSearchingSimilar && <p className='mt-2 text-sm text-gray-500'>Searching for similar feedback...</p>}

        {!isSearchingSimilar && similarFeedback.length > 0 && (
          <div className='mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
            <p className='text-sm font-medium text-yellow-800 mb-2'>
              Similar feedback found. Consider voting for these instead:
            </p>
            <div className='space-y-2'>
              {similarFeedback.slice(0, 3).map(item => (
                <div key={item.id} className='text-sm'>
                  <a
                    href='#'
                    className='text-blue-600 hover:underline'
                    onClick={e => {
                      e.preventDefault()
                      // In real implementation, navigate to feedback detail
                    }}
                  >
                    {item.title}
                  </a>
                  <span className='text-gray-500 ml-2'>({item.score} votes)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          placeholder={
            feedbackType === 'bug' ? 'Provide details about the bug' : 'Explain the feature and why it would be useful'
          }
        />
        {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
      </div>

      {/* Bug-specific fields */}
      {feedbackType === 'bug' && (
        <>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Steps to Reproduce</label>
            <textarea
              {...register('reproduction_steps')}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder={'1. Go to...\n2. Click on...\n3. See error'}
            />
          </div>

          <div>
            <Input
              label='Expected Behavior'
              placeholder='What should happen?'
              fullWidth
              {...register('expected_behavior')}
            />
          </div>

          <div>
            <Input
              label='Actual Behavior'
              placeholder='What actually happens?'
              fullWidth
              {...register('actual_behavior')}
            />
          </div>
        </>
      )}

      {/* Feature-specific fields */}
      {feedbackType === 'feature' && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Use Case</label>
          <textarea
            {...register('use_case')}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            placeholder="Describe how you would use this feature and why it's valuable"
          />
        </div>
      )}

      {/* Actions */}
      <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
        <Button
          type='button'
          onClick={onCancel}
          disabled={isSubmitting}
          className='bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </form>
  )
}

export default CreateFeedbackForm
