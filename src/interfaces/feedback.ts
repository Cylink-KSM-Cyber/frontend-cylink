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
export type DownvoteReason =
  | 'duplicate'
  | 'not_reproducible'
  | 'not_useful'
  | 'spam'
  | 'off_topic'
  | 'unclear'
  | 'other'

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
  use_case?: string
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
 * Optional fields available for detailed bug reports or feature requests
 */
export interface CreateFeedbackFormData {
  title: string
  description: string
  type: FeedbackType
  tags?: string[]
  /** Use case description for feature requests */
  use_case?: string
  /** Steps to reproduce for bug reports */
  reproduction_steps?: string
  /** Expected behavior for bug reports */
  expected_behavior?: string
  /** Actual behavior observed for bug reports */
  actual_behavior?: string
}

/**
 * Create Feedback API Request Interface
 * Matches the backend POST /api/v1/feedback request body
 */
export interface CreateFeedbackApiRequest {
  title: string
  description: string
  type: FeedbackType
  tags?: string[]
  use_case?: string
  reproduction_steps?: string
  expected_behavior?: string
  actual_behavior?: string
}

/**
 * Create Feedback API Response Interface
 * Matches the backend POST /api/v1/feedback response
 */
export interface CreateFeedbackApiResponse {
  status: number
  message: string
  data: FeedbackItem
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

/**
 * Vote API Request Interface
 * Matches POST /api/v1/feedback/{id}/vote request body
 */
export interface VoteApiRequest {
  vote_type: VoteType
  reason?: DownvoteReason
  comment?: string | null
}

/**
 * Vote API Response Data Interface
 * Matches POST /api/v1/feedback/{id}/vote response data
 */
export interface VoteApiResponseData {
  id: number
  upvotes: number
  downvotes: number
  score: number
  user_vote: VoteType | null
  voters: FeedbackUser[]
  total_voters: number
}

/**
 * Vote API Response Interface
 * Matches POST /api/v1/feedback/{id}/vote response
 */
export interface VoteApiResponse {
  status: number
  message: string
  data: VoteApiResponseData
}
