import {
  FeedbackApiResponse,
  FeedbackFilter,
  FeedbackItem,
  CreateFeedbackFormData,
  VoteType,
  DownvoteFormData,
  VotersResponse,
  SimilarFeedbackResponse
} from '@/interfaces/feedback'
import logger from '@/utils/logger'
// Import fakedb data
import fakeData from '@/fakedb/feedback.json'
/**
 * Feedback Service
 * @description Service for interacting with feedback-related operations
 * Uses fakedb strategy until backend API is ready
 */
const STORAGE_KEY = 'cylink_feedback_data'
/**
 * Get feedback data from localStorage or use default fakedb
 */
const getFeedbackData = () => {
  if (globalThis.window === undefined) return fakeData

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      logger.error('Failed to parse stored feedback data', e)
      return fakeData
    }
  }
  return fakeData
}
/**
 * Save feedback data to localStorage
 */
const saveFeedbackData = (data: typeof fakeData) => {
  if (globalThis.window === undefined) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
/**
 * Get current user ID (mock)
 */
const getCurrentUserId = (): number => {
  // In real implementation, get from auth context
  return 1
}
/**
 * Calculate Wilson Score for trending algorithm
 */
const calculateWilsonScore = (upvotes: number, downvotes: number): number => {
  const n = upvotes + downvotes
  if (n === 0) return 0

  const z = 1.96 // 95% confidence
  const phat = upvotes / n

  return (phat + (z * z) / (2 * n) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n)
}
/**
 * Enrich feedback item with vote data and supporters
 */
const enrichFeedbackItem = (
  item: (typeof fakeData.feedback)[0],
  data: typeof fakeData,
  currentUserId: number
): FeedbackItem => {
  // Get all votes for this feedback
  const feedbackVotes = data.votes.filter(v => v.feedback_id === item.id)

  // Get upvoters for facepile (first 5)
  const upvoters = feedbackVotes
    .filter(v => v.vote_type === 'upvote')
    .map(v => data.users.find(u => u.id === v.user_id))
    .filter((u): u is (typeof data.users)[0] => u !== undefined)
    .slice(0, 5)
    .map(u => ({ ...u, avatar_url: u.avatar_url ?? undefined }))

  // Get current user's vote
  const userVote = feedbackVotes.find(v => v.user_id === currentUserId)

  // Get author
  const author = data.users.find(u => u.id === item.user_id)

  return {
    ...item,
    type: item.type as 'bug' | 'feature',
    status: item.status as 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'closed',
    voters: upvoters,
    total_voters: feedbackVotes.filter(v => v.vote_type === 'upvote').length,
    user_vote: userVote?.vote_type as VoteType | undefined,
    author: author ? { ...author, avatar_url: author.avatar_url ?? undefined } : undefined
  }
}
/**
 * Fetch feedback items with filtering and sorting
 */
export const fetchFeedback = async (filter: Partial<FeedbackFilter> = {}): Promise<FeedbackApiResponse> => {
  logger.debug('Fetching feedback with filter', { filter })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const data = getFeedbackData()
  const currentUserId = getCurrentUserId()

  let items = data.feedback.map((item: (typeof fakeData.feedback)[0]) => enrichFeedbackItem(item, data, currentUserId))

  // Apply filters
  if (filter.type && filter.type !== 'all') {
    items = items.filter((item: FeedbackItem) => item.type === filter.type)
  }

  if (filter.status && filter.status !== 'all') {
    items = items.filter((item: FeedbackItem) => item.status === filter.status)
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase()
    items = items.filter(
      (item: FeedbackItem) =>
        item.title.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower)
    )
  }

  if (filter.myVotes) {
    items = items.filter((item: FeedbackItem) => item.user_vote !== undefined)
  }

  // Apply sorting
  const sortBy = filter.sortBy || 'trending'
  if (sortBy === 'trending') {
    // Wilson Score algorithm
    items.sort((a: FeedbackItem, b: FeedbackItem) => {
      const scoreA = calculateWilsonScore(a.upvotes, a.downvotes)
      const scoreB = calculateWilsonScore(b.upvotes, b.downvotes)
      return scoreB - scoreA
    })
  } else if (sortBy === 'top_voted') {
    items.sort((a: FeedbackItem, b: FeedbackItem) => b.score - a.score)
  } else if (sortBy === 'newest') {
    items.sort(
      (a: FeedbackItem, b: FeedbackItem) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  // Apply pagination
  const page = filter.page || 1
  const limit = filter.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    status: 200,
    message: 'Feedback fetched successfully',
    data: paginatedItems,
    pagination: {
      total: items.length,
      page,
      limit,
      total_pages: Math.ceil(items.length / limit)
    }
  }
}
/**
 * Create new feedback item
 */
export const createFeedback = async (
  formData: CreateFeedbackFormData
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  logger.info('Creating feedback', { formData })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const data = getFeedbackData()
  const currentUserId = getCurrentUserId()

  const newId = Math.max(...data.feedback.map((f: any) => f.id), 0) + 1
  const now = new Date().toISOString()

  const newFeedback: any = {
    id: newId,
    title: formData.title,
    description: formData.description,
    type: formData.type,
    status: 'open' as const,
    user_id: currentUserId,
    created_at: now,
    updated_at: now,
    upvotes: 1, // Creator auto-upvotes their own feedback
    downvotes: 0,
    score: 1, // Score starts at 1 from creator's upvote
    tags: formData.tags || []
  }

  data.feedback.push(newFeedback)

  // Auto-upvote: Add vote record for the creator
  const newVoteId = Math.max(...data.votes.map((v: any) => v.id), 0) + 1
  data.votes.push({
    id: newVoteId,
    feedback_id: newId,
    user_id: currentUserId,
    vote_type: 'upvote',
    created_at: now
  })

  saveFeedbackData(data)

  const enrichedItem = enrichFeedbackItem(newFeedback, data, currentUserId)

  return {
    status: 201,
    message: 'Feedback created successfully',
    data: enrichedItem
  }
}
/**
 * Vote on feedback item
 */
export const voteFeedback = async (
  feedbackId: number,
  voteType: VoteType,
  downvoteData?: DownvoteFormData
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  logger.info('Voting on feedback', { feedbackId, voteType, downvoteData })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const data = getFeedbackData()
  const currentUserId = getCurrentUserId()

  // Find feedback item
  const feedbackIndex = data.feedback.findIndex((f: any) => f.id === feedbackId)
  if (feedbackIndex === -1) {
    throw new Error('Feedback not found')
  }

  // Check if user already voted
  const existingVoteIndex = data.votes.findIndex(
    (v: any) => v.feedback_id === feedbackId && v.user_id === currentUserId
  )

  if (existingVoteIndex !== -1) {
    // Remove old vote counts
    const oldVote = data.votes[existingVoteIndex]
    if (oldVote.vote_type === 'upvote') {
      data.feedback[feedbackIndex].upvotes--
    } else {
      data.feedback[feedbackIndex].downvotes--
    }

    // Remove old vote
    data.votes.splice(existingVoteIndex, 1)
  }

  // Add new vote
  const newVote: any = {
    id: Math.max(...data.votes.map((v: any) => v.id), 0) + 1,
    feedback_id: feedbackId,
    user_id: currentUserId,
    vote_type: voteType,
    created_at: new Date().toISOString(),
    ...(voteType === 'downvote' &&
      downvoteData && {
        reason: downvoteData.reason,
        comment: downvoteData.comment
      })
  }

  data.votes.push(newVote)

  // Update vote counts
  if (voteType === 'upvote') {
    data.feedback[feedbackIndex].upvotes++
  } else {
    data.feedback[feedbackIndex].downvotes++
  }

  data.feedback[feedbackIndex].score = data.feedback[feedbackIndex].upvotes - data.feedback[feedbackIndex].downvotes

  saveFeedbackData(data)

  const enrichedItem = enrichFeedbackItem(data.feedback[feedbackIndex], data, currentUserId)

  return {
    status: 200,
    message: 'Vote recorded successfully',
    data: enrichedItem
  }
}
/**
 * Remove vote from feedback item
 */
export const removeVote = async (
  feedbackId: number
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  logger.info('Removing vote from feedback', { feedbackId })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const data = getFeedbackData()
  const currentUserId = getCurrentUserId()

  // Find feedback item
  const feedbackIndex = data.feedback.findIndex((f: any) => f.id === feedbackId)
  if (feedbackIndex === -1) {
    throw new Error('Feedback not found')
  }

  // Find user's vote
  const voteIndex = data.votes.findIndex((v: any) => v.feedback_id === feedbackId && v.user_id === currentUserId)

  if (voteIndex === -1) {
    throw new Error('Vote not found')
  }

  const vote = data.votes[voteIndex]

  // Update vote counts
  if (vote.vote_type === 'upvote') {
    data.feedback[feedbackIndex].upvotes--
  } else {
    data.feedback[feedbackIndex].downvotes--
  }

  data.feedback[feedbackIndex].score = data.feedback[feedbackIndex].upvotes - data.feedback[feedbackIndex].downvotes

  // Remove vote
  data.votes.splice(voteIndex, 1)

  saveFeedbackData(data)

  const enrichedItem = enrichFeedbackItem(data.feedback[feedbackIndex], data, currentUserId)

  return {
    status: 200,
    message: 'Vote removed successfully',
    data: enrichedItem
  }
}
/**
 * Fetch voters for a feedback item
 */
export const fetchVoters = async (feedbackId: number): Promise<VotersResponse> => {
  logger.debug('Fetching voters for feedback', { feedbackId })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const data = getFeedbackData()

  const votes = data.votes.filter((v: any) => v.feedback_id === feedbackId && v.vote_type === 'upvote')
  const voters = votes
    .map((v: any) => data.users.find((u: any) => u.id === v.user_id))
    .filter((u: (typeof data.users)[0] | undefined): u is (typeof data.users)[0] => u !== undefined)
    .map((u: (typeof data.users)[0]) => ({ ...u, avatar_url: u.avatar_url ?? undefined }))

  return {
    status: 200,
    message: 'Voters fetched successfully',
    data: {
      voters,
      total: voters.length
    }
  }
}
/**
 * Search for similar feedback items (duplicate detection)
 */
export const searchSimilar = async (title: string): Promise<SimilarFeedbackResponse> => {
  logger.debug('Searching for similar feedback', { title })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150))

  const data = getFeedbackData()
  const currentUserId = getCurrentUserId()

  const titleLower = title.toLowerCase()
  const words = titleLower.split(' ').filter(w => w.length > 2)

  const similar = data.feedback
    .map((item: any) => {
      const itemTitleLower = item.title.toLowerCase()
      const matchCount = words.filter(word => itemTitleLower.includes(word)).length
      return { item, matchCount }
    })
    .filter(({ matchCount }: { matchCount: number }) => matchCount > 0)
    .sort((a: any, b: any) => b.matchCount - a.matchCount)
    .slice(0, 5)
    .map(({ item }: { item: any }) => enrichFeedbackItem(item, data, currentUserId))

  return {
    status: 200,
    message: 'Similar feedback found',
    data: similar
  }
}
/**
 * Delete feedback item
 */
export const deleteFeedback = async (feedbackId: number): Promise<{ status: number; message: string }> => {
  logger.info('Deleting feedback', { feedbackId })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const data = getFeedbackData()

  const feedbackIndex = data.feedback.findIndex((f: any) => f.id === feedbackId)
  if (feedbackIndex === -1) {
    throw new Error('Feedback not found')
  }

  // Remove feedback
  data.feedback.splice(feedbackIndex, 1)

  // Remove associated votes
  data.votes = data.votes.filter((v: any) => v.feedback_id !== feedbackId)

  saveFeedbackData(data)

  return {
    status: 200,
    message: 'Feedback deleted successfully'
  }
}
