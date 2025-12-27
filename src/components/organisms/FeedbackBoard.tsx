'use client'

import React, { useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import useFeedback from '@/hooks/useFeedback'
import useFeedbackVoting from '@/hooks/useFeedbackVoting'
import useFeedbackFilter from '@/hooks/useFeedbackFilter'
import useFeedbackSubmission from '@/hooks/useFeedbackSubmission'
import FeedbackFilterBar from '@/components/molecules/FeedbackFilterBar'
import FeedbackList from '@/components/organisms/FeedbackList'
import Modal from '@/components/atoms/Modal'
import CreateFeedbackForm from '@/components/molecules/CreateFeedbackForm'
import SupportersModal from '@/components/molecules/SupportersModal'
import { fetchVoters } from '@/services/feedback'
import { FeedbackUser, DownvoteFormData } from '@/interfaces/feedback'

/**
 * Feedback Board Component
 * @description Complete feedback board interface with all features
 */
const FeedbackBoard: React.FC = () => {
  // Filter state
  const { type, sortBy, search, myVotes, updateType, updateSortBy, updateSearch, toggleMyVotes, getFilterObject } =
    useFeedbackFilter()

  // Feedback data
  const { feedback, isLoading, pagination, filter, updateFilter, updateFeedbackItem } = useFeedback({
    ...getFilterObject(),
    page: 1,
    limit: 10
  })

  // Voting functionality
  const { isVoting, handleUpvote, handleDownvote } = useFeedbackVoting()

  // Submission functionality
  const submissionHook = useFeedbackSubmission()
  const { isSubmitting, similarFeedback, isSearchingSimilar, handleTitleChange, submitFeedback, clearSimilar } =
    submissionHook

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSupportersModal, setShowSupportersModal] = useState(false)
  const [supporters, setSupporters] = useState<FeedbackUser[]>([])
  const [supportersTotal, setSupportersTotal] = useState(0)

  // Update filter when filter state changes
  React.useEffect(() => {
    updateFilter({
      ...getFilterObject(),
      page: 1
    })
  }, [type, sortBy, search, myVotes, updateFilter, getFilterObject])

  /**
   * Handle upvote
   */
  const handleUpvoteClick = (feedbackId: number) => {
    const item = feedback.find(f => f.id === feedbackId)
    if (!item) return

    handleUpvote(feedbackId, item.user_vote, updatedItem => {
      updateFeedbackItem(updatedItem)
    })
  }

  /**
   * Handle downvote with optional reason data
   */
  const handleDownvoteClick = (feedbackId: number, data?: DownvoteFormData) => {
    const item = feedback.find(f => f.id === feedbackId)
    if (!item) return

    handleDownvote(
      feedbackId,
      item.user_vote,
      updatedItem => {
        updateFeedbackItem(updatedItem)
      },
      data
    )
  }

  /**
   * Handle view supporters
   */
  const handleViewSupporters = async (feedbackId: number) => {
    try {
      const response = await fetchVoters(feedbackId)
      setSupporters(response.data.voters)
      setSupportersTotal(response.data.total)
      setShowSupportersModal(true)
    } catch (err) {
      console.error('Failed to fetch supporters', err)
    }
  }

  /**
   * Handle create feedback
   */
  const handleCreateFeedback = async (data: any) => {
    await submitFeedback(data, () => {
      setShowCreateModal(false)
      clearSimilar()
      // Refresh feedback list
      updateFilter({ ...filter, page: 1 })
    })
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    updateFilter({ ...filter, page })
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Feedback</h1>
          <p className='text-gray-600 mt-1'>Request features and report bugs to help us improve</p>
        </div>

        {/* Create Button - Desktop */}
        <button
          type='button'
          onClick={() => setShowCreateModal(true)}
          className='hidden lg:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'
        >
          <RiAddLine size={20} />
          <span>Create Feedback</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FeedbackFilterBar
        type={type}
        sortBy={sortBy}
        search={search}
        myVotes={myVotes}
        onTypeChange={updateType}
        onSortChange={updateSortBy}
        onSearchChange={updateSearch}
        onMyVotesToggle={toggleMyVotes}
      />

      {/* Feedback List */}
      <FeedbackList
        feedback={feedback}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onUpvote={handleUpvoteClick}
        onDownvote={handleDownvoteClick}
        onViewSupporters={handleViewSupporters}
        isVoting={isVoting}
      />

      {/* Floating Action Button - Mobile */}
      <button
        type='button'
        onClick={() => setShowCreateModal(true)}
        className='lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors z-10'
        aria-label='Create feedback'
      >
        <RiAddLine size={24} />
      </button>

      {/* Create Feedback Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          clearSimilar()
        }}
        title='Create Feedback'
        size='lg'
      >
        <CreateFeedbackForm
          similarFeedback={similarFeedback}
          isSearchingSimilar={isSearchingSimilar}
          onTitleChange={handleTitleChange}
          onSubmit={handleCreateFeedback}
          onCancel={() => {
            setShowCreateModal(false)
            clearSimilar()
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Supporters Modal */}
      <SupportersModal
        isOpen={showSupportersModal}
        onClose={() => setShowSupportersModal(false)}
        supporters={supporters}
        totalCount={supportersTotal}
      />
    </div>
  )
}

export default FeedbackBoard
