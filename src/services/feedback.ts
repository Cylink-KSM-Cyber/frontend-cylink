import {
  FeedbackApiResponse,
  FeedbackFilter,
  FeedbackItem,
  CreateFeedbackFormData,
  CreateFeedbackApiResponse,
  VoteType,
  DownvoteFormData,
  VotersResponse,
  SimilarFeedbackResponse,
  VoteApiRequest,
  VoteApiResponse,
  VoteApiResponseData,
  DeleteFeedbackApiResponse
} from '@/interfaces/feedback'
import logger from '@/utils/logger'
// Import fakedb data
import fakeData from '@/fakedb/feedback.json'
import { get, post, del } from './api'
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
 * @deprecated Will use auth context when other operations are migrated
 */
const getCurrentUserId = (): number => {
  // In real implementation, get from auth context
  return 1
}

/**
 * API Configuration
 */
const FEEDBACK_API_ENDPOINT = '/api/v1/feedback'

/**
 * Map frontend sortBy values to backend sortBy values
 */
const SORT_BY_MAP: Record<string, string> = {
  trending: 'trending',
  top_voted: 'top_voted',
  newest: 'newest'
}

/**
 * Build query parameters for feedback API
 * @param filter - Feedback filter parameters
 * @returns URLSearchParams object with properly formatted query string
 */
const buildFeedbackQueryParams = (filter: Partial<FeedbackFilter>): URLSearchParams => {
  const query = {
    sortBy: SORT_BY_MAP[filter.sortBy ?? 'newest'] ?? 'newest',
    page: String(filter.page ?? 1),
    limit: String(filter.limit ?? 10),
    ...(filter.type && filter.type !== 'all' && { type: filter.type }),
    ...(filter.status && filter.status !== 'all' && { status: filter.status }),
    ...(filter.search?.trim() && { search: filter.search.trim() }),
    ...(filter.myVotes !== undefined && { myVotes: String(filter.myVotes) })
  }

  return new URLSearchParams(query)
}

/**
 * Fetch feedback items from the real API
 * @param filter - Filter parameters for the feedback query
 * @returns Promise with the API response
 * @throws Error if the API call fails
 */
export const fetchFeedbackFromApi = async (filter: Partial<FeedbackFilter> = {}): Promise<FeedbackApiResponse> => {
  const queryString = buildFeedbackQueryParams(filter).toString()
  const endpoint = `${FEEDBACK_API_ENDPOINT}?${queryString}`

  try {
    const response = await get<FeedbackApiResponse>(endpoint)

    // If valid response with data, return it
    if (response?.status === 200 && response.data?.length) {
      return response
    }

    // Fallback Return empty state if response is missing or empty
    return {
      status: 200,
      message: 'No feedback found',
      data: [],
      pagination: { total: 0, page: filter.page ?? 1, limit: filter.limit ?? 10, total_pages: 0 }
    }
  } catch (error) {
    logger.error('Failed to fetch feedback', { error, filter })
    throw error
  }
}

/**
 * Fetch feedback items with filtering and sorting
 * Uses the real backend API
 *
 * @param filter - Filter parameters for the feedback query
 * @returns Promise with the API response containing feedback items and pagination
 */
export const fetchFeedback = async (filter: Partial<FeedbackFilter> = {}): Promise<FeedbackApiResponse> => {
  return fetchFeedbackFromApi(filter)
}

/**
 * Enrich feedback item with vote data and supporters
 * Used by fakedb operations (createFeedback, voteFeedback, etc.)
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
 * Submit feedback to the real API
 * @param formData - Feedback form data to submit
 * @returns Promise with the API response
 * @throws Error if the API call fails or returns invalid response
 */
export const submitFeedbackToApi = async (formData: CreateFeedbackFormData): Promise<CreateFeedbackApiResponse> => {
  try {
    const response = await post<CreateFeedbackApiResponse>(FEEDBACK_API_ENDPOINT, formData)

    if (!response?.data) throw new Error('Invalid response from server')

    return response
  } catch (error) {
    logger.error('Failed to submit feedback', { error, formData })
    throw error
  }
}

/**
 * Create new feedback item
 * Uses the real backend API
 * @param formData - Feedback form data
 * @returns Promise with the created feedback item
 */
export const createFeedback = async (
  formData: CreateFeedbackFormData
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  const response = await submitFeedbackToApi(formData)

  return {
    status: response.status,
    message: response.message,
    data: response.data
  }
}
/**
 * Submit a vote to the real API
 * @param feedbackId - Feedback ID to vote on
 * @param voteData - Vote request data
 * @returns Promise with the API response
 * @throws Error if the API call fails
 */
export const submitVoteToApi = async (feedbackId: number, voteData: VoteApiRequest): Promise<VoteApiResponse> => {
  const endpoint = `${FEEDBACK_API_ENDPOINT}/${feedbackId}/vote`

  try {
    const response = await post<VoteApiResponse>(endpoint, voteData)

    if (!response?.data) {
      throw new Error('Invalid response from server')
    }

    return response
  } catch (error) {
    logger.error('Failed to submit vote', { error, feedbackId, voteData })
    throw error
  }
}

/**
 * Vote on feedback item
 * Uses the real backend API
 * @param feedbackId - ID of the feedback to vote on
 * @param voteType - Type of vote (upvote/downvote)
 * @param downvoteData - Optional downvote reason data
 * @returns Promise with vote response
 */
export const voteFeedback = async (
  feedbackId: number,
  voteType: VoteType,
  downvoteData?: DownvoteFormData
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  const voteData: VoteApiRequest = {
    vote_type: voteType,
    ...(voteType === 'downvote' &&
      downvoteData && {
        reason: downvoteData.reason,
        comment: downvoteData.comment ?? null
      })
  }

  const response = await submitVoteToApi(feedbackId, voteData)

  // Transform VoteApiResponse to match expected return type
  return {
    status: response.status,
    message: response.message,
    data: {
      id: response.data.id,
      upvotes: response.data.upvotes,
      downvotes: response.data.downvotes,
      score: response.data.score,
      user_vote: response.data.user_vote ?? undefined,
      voters: response.data.voters,
      total_voters: response.data.total_voters
    } as FeedbackItem
  }
}
/**
 * Remove vote from feedback item
 * Uses the real backend API
 * @param feedbackId - ID of the feedback to remove vote from
 * @returns Promise with updated feedback item
 */
export const removeVote = async (
  feedbackId: number
): Promise<{ status: number; message: string; data: FeedbackItem }> => {
  const endpoint = `${FEEDBACK_API_ENDPOINT}/${feedbackId}/vote`

  try {
    const response = await del<{ status: number; message: string; data: VoteApiResponseData }>(endpoint)

    if (!response?.data) {
      throw new Error('Invalid response from server')
    }

    const updatedData: Partial<FeedbackItem> = {
      id: response.data.id,
      upvotes: response.data.upvotes,
      downvotes: response.data.downvotes,
      score: response.data.score,
      user_vote: response.data.user_vote ?? undefined,
      voters: response.data.voters,
      total_voters: response.data.total_voters
    }

    return {
      status: response.status,
      message: response.message,
      data: updatedData as FeedbackItem
    }
  } catch (error) {
    logger.error('Failed to remove vote', { error, feedbackId })
    throw error
  }
}
/**
 * Fetch voters for a feedback item from the real API
 * @param feedbackId - ID of the feedback to fetch voters for
 * @param search - Optional search query to filter voters by name or email
 * @returns Promise with voters response
 * @throws Error if the API call fails
 */
export const fetchVoters = async (feedbackId: number, search?: string): Promise<VotersResponse> => {
  const queryParams = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
  const endpoint = `${FEEDBACK_API_ENDPOINT}/${feedbackId}/voters${queryParams}`

  try {
    const response = await get<VotersResponse>(endpoint)

    if (!response?.data) {
      return {
        status: 200,
        message: 'No voters found',
        data: { voters: [], total: 0 }
      }
    }

    return response
  } catch (error) {
    logger.error('Failed to fetch voters', { error, feedbackId, search })
    throw error
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
 * Delete feedback item from the real API
 * @param feedbackId - Feedback ID to delete
 * @returns Promise with delete response
 * @throws Error if the API call fails
 */
export const deleteFeedback = async (feedbackId: number): Promise<{ status: number; message: string }> => {
  const endpoint = `${FEEDBACK_API_ENDPOINT}/${feedbackId}`

  try {
    const response = await del<DeleteFeedbackApiResponse>(endpoint)
    return {
      status: response.status,
      message: response.message
    }
  } catch (error) {
    logger.error('Failed to delete feedback', { error, feedbackId })
    throw error
  }
}
