'use client'

import React, { useState, useMemo } from 'react'
import { RiAddLine } from 'react-icons/ri'
import Cookies from 'js-cookie'
import useFeedback from '@/hooks/useFeedback'
import useFeedbackVoting from '@/hooks/useFeedbackVoting'
import useFeedbackFilter from '@/hooks/useFeedbackFilter'
import useFeedbackSubmission from '@/hooks/useFeedbackSubmission'
import FeedbackFilterBar from '@/components/molecules/FeedbackFilterBar'
import FeedbackList from '@/components/organisms/FeedbackList'
import Modal from '@/components/atoms/Modal'
import CreateFeedbackForm from '@/components/molecules/CreateFeedbackForm'
import SupportersModal from '@/components/molecules/SupportersModal'
import DeleteFeedbackModal from '@/components/molecules/DeleteFeedbackModal'
import { fetchVoters } from '@/services/feedback'
import { FeedbackUser, DownvoteFormData, FeedbackItem } from '@/interfaces/feedback'
import { useAuth } from '@/contexts/AuthContext'
import AuthService from '@/services/auth'

/**
 * Decode JWT token to extract user ID
 * @param token - JWT access token
 * @returns User ID or undefined if invalid
 */
const getUserIdFromToken = (token: string | undefined): number | undefined => {
  if (!token) return undefined

  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return undefined

    // Decode base64 payload (second part)
    const payload = JSON.parse(atob(parts[1]))

    // JWT typically has 'sub' (subject) as user ID, or 'user_id' / 'id'
    const userId = payload.sub ?? payload.user_id ?? payload.id

    return typeof userId === 'number' ? userId : Number(userId)
  } catch {
    return undefined
  }
}

/**
 * Feedback Board Component
 * @description Complete feedback board interface with all features
 */
const FeedbackBoard: React.FC = () => {
  // Auth context for current user
  const { user } = useAuth()

  // Get current user ID with multiple fallbacks
  const currentUserId = useMemo(() => {
    // 1. First try auth context
    if (user?.id) {
      return user.id
    }

    // 2. Fallback: try AuthService (reads from cookie)
    const storedUser = AuthService.getUser()
    if (storedUser?.id) {
      return storedUser.id
    }

    // 3. Final fallback: decode JWT token
    const token = Cookies.get('accessToken')
    return getUserIdFromToken(token)
  }, [user])

  // Filter state
  const { type, sortBy, search, myVotes, updateType, updateSortBy, updateSearch, toggleMyVotes, getFilterObject } =
    useFeedbackFilter()

  // Feedback data
  const { feedback, isLoading, pagination, filter, updateFilter, updateFeedbackItem, deleteFeedbackItem } = useFeedback(
    {
      ...getFilterObject(),
      page: 1,
      limit: 10
    }
  )

  // Voting functionality
  const { isVoting, handleUpvote, handleDownvote } = useFeedbackVoting()

  // Submission functionality
  const submissionHook = useFeedbackSubmission()
  const { isSubmitting, similarFeedback, isSearchingSimilar, handleTitleChange, submitFeedback, clearSimilar } =
    submissionHook

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSupportersModal, setShowSupportersModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [supporters, setSupporters] = useState<FeedbackUser[]>([])
  const [supportersTotal, setSupportersTotal] = useState(0)
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update filter when filter state changes
  React.useEffect(() => {
    updateFilter({
      type: type === 'all' ? undefined : type,
      status: undefined,
      sortBy,
      search: search.trim() || undefined,
      myVotes: myVotes || undefined,
      page: 1
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, sortBy, search, myVotes])

  /**
   * Handle upvote
   */
  const handleUpvoteClick = (feedbackId: number) => {
    const item = feedback.find(f => f.id === feedbackId)
    if (!item) return

    handleUpvote(feedbackId, item.user_vote, item, updatedItem => {
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
      item,
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

  /**
   * Handle delete button click - opens confirmation modal
   */
  const handleDeleteClick = (feedbackId: number) => {
    const item = feedback.find(f => f.id === feedbackId)
    if (!item) return
    setFeedbackToDelete(item)
    setShowDeleteModal(true)
  }

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async (feedbackItem: FeedbackItem) => {
    setIsDeleting(true)
    try {
      await deleteFeedbackItem(feedbackItem.id)
      setShowDeleteModal(false)
      setFeedbackToDelete(null)
    } finally {
      setIsDeleting(false)
    }
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
          onClick={() => {
            clearSimilar()
            setShowCreateModal(true)
          }}
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
        onDelete={handleDeleteClick}
        currentUserId={currentUserId}
        isVoting={isVoting}
      />

      {/* Floating Action Button - Mobile (positioned above sidebar toggle to avoid overlap) */}
      <button
        type='button'
        onClick={() => {
          clearSimilar()
          setShowCreateModal(true)
        }}
        className='lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors z-10'
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

      {/* Delete Feedback Modal */}
      <DeleteFeedbackModal
        feedback={feedbackToDelete}
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false)
          setFeedbackToDelete(null)
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default FeedbackBoard
