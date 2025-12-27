import React from 'react'
import { Metadata } from 'next'
import FeedbackBoard from '@/components/organisms/FeedbackBoard'

/**
 * Metadata for the feedback page
 */
export const metadata: Metadata = {
  title: 'Feedback - CyLink',
  description: 'Submit feature requests and bug reports'
}

/**
 * Feedback Page Component
 * @description Main feedback board page
 */
export default function FeedbackPage() {
  return <FeedbackBoard />
}
