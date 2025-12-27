/**
 * Feedback-related TypeScript interfaces
 * @description Defines interfaces for feedback entities, forms, and API responses
 */

/***
 * Feedback Type Enum
 */
export type FeedbackType = 'bug' | 'feature'

/**
 * Feedback Status Enum
 */
export type FeedbackStatus = 'open' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'closed'

/**
 * Vote Type Enum
 */
export type VoteType = 'upvote' | 'downvote'

/**
 * Downvote Reason Enum
 */
export type DownvoteReason = 'duplicate' | 'not_reproducible' | 'spam' | 'off_topic' | 'unclear' | 'other'

/**
 * User Interface (simplified for facepile)
 */
export interface FeedbackUser {
  id: number
  name: string
  email: string
  avatar_url?: string
}

/**
 * Vote Interface
 */
export interface FeedbackVote {
  id: number
  feedback_id: number
  user_id: number
  vote_type: VoteType
  reason?: DownvoteReason
  comment?: string
  created_at: string
  user?: FeedbackUser
}
/**
 * Feedback Item Interface
 */
export interface FeedbackItem {
  id: number
  title: string
  description: string
  type: FeedbackType
  status: FeedbackStatus
  user_id: number
  created_at: string
  updated_at: string
  upvotes: number
  downvotes: number
  score: number // upvotes - downvotes
  voters: FeedbackUser[] // First 5 supporters for facepile
  total_voters: number // Total count for +N display
  user_vote?: VoteType // Current user's vote
  author?: FeedbackUser
  tags?: string[]
}
/**
 * Feedback Filter Interface
 */
export interface FeedbackFilter {
  search?: string
  type?: FeedbackType | 'all'
  status?: FeedbackStatus | 'all'
  sortBy?: 'trending' | 'top_voted' | 'newest'
  myVotes?: boolean
  page: number
  limit: number
}
/**
 * Feedback API Response Interface
 */
export interface FeedbackApiResponse {
  status: number
  message: string
  data: FeedbackItem[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}
/**
 * Create Feedback Form Data Interface
 * Simplified to essential fields to encourage user participation
 */
export interface CreateFeedbackFormData {
  title: string
  description: string
  type: FeedbackType
  tags?: string[]
}
/**
 * Downvote Form Data Interface
 */
export interface DownvoteFormData {
  reason: DownvoteReason
  comment?: string
}
/**
 * Voters Response Interface
 */
export interface VotersResponse {
  status: number
  message: string
  data: {
    voters: FeedbackUser[]
    total: number
  }
}
/**
 * Similar Feedback Response Interface
 */
export interface SimilarFeedbackResponse {
  status: number
  message: string
  data: FeedbackItem[]
}
