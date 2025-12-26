/**
 * OAuth Tracking Hook
 *
 * Provides centralized tracking functions for Google OAuth login and registration flows.
 * Tracks user journey from button click through completion or error.
 *
 * @module hooks/useOAuthTracking
 */

import { useCallback } from 'react'
import posthogClient from '@/utils/posthogClient'

/**
 * OAuth flow type
 */
type OAuthFlow = 'login' | 'register'

/**
 * OAuth tracking step
 */
type OAuthStep = 'initiation' | 'callback' | 'username_selection' | 'completion'

/**
 * Base OAuth event properties
 */
interface BaseOAuthProperties {
  timestamp: number
  user_agent: string
  referrer: string
  [key: string]: string | number | boolean | null | undefined
}

/**
 * OAuth initiation event properties
 */
interface OAuthInitiatedProperties extends BaseOAuthProperties {
  source: string
  flow: OAuthFlow
}

/**
 * OAuth callback event properties
 */
interface OAuthCallbackProperties extends BaseOAuthProperties {
  has_code: boolean
  has_error: boolean
  flow: OAuthFlow
}

/**
 * OAuth success event properties
 */
interface OAuthSuccessProperties extends BaseOAuthProperties {
  user_id?: string
  email?: string
  flow: OAuthFlow
  username?: string
}

/**
 * OAuth error event properties
 */
interface OAuthErrorProperties extends BaseOAuthProperties {
  error_type: string
  error_message: string
  flow: OAuthFlow
  step: OAuthStep
}

/**
 * Get base event properties
 */
const getBaseProperties = (): BaseOAuthProperties => ({
  timestamp: Date.now(),
  user_agent: typeof globalThis.window !== 'undefined' ? globalThis.window.navigator.userAgent : '',
  referrer:
    typeof globalThis !== 'undefined' && typeof globalThis.document !== 'undefined' ? globalThis.document.referrer : ''
})

/**
 * Custom hook for OAuth tracking
 *
 * @returns OAuth tracking functions
 */
export const useOAuthTracking = () => {
  /**
   * Track OAuth initiation (button click)
   */
  const trackOAuthInitiated = useCallback((flow: OAuthFlow, source: string) => {
    const properties: OAuthInitiatedProperties = {
      ...getBaseProperties(),
      source,
      flow
    }

    posthogClient.captureEvent(`oauth_${flow}_initiated`, properties)
  }, [])

  /**
   * Track OAuth callback received
   */
  const trackOAuthCallback = useCallback((flow: OAuthFlow, hasCode: boolean, hasError: boolean) => {
    const properties: OAuthCallbackProperties = {
      ...getBaseProperties(),
      has_code: hasCode,
      has_error: hasError,
      flow
    }

    posthogClient.captureEvent(`oauth_${flow}_callback_received`, properties)
  }, [])

  /**
   * Track username selection page viewed (register only)
   */
  const trackUsernameSelectionViewed = useCallback((tokenValid: boolean) => {
    const properties = {
      ...getBaseProperties(),
      token_valid: tokenValid,
      flow: 'register' as OAuthFlow
    }

    posthogClient.captureEvent('oauth_username_selection_viewed', properties)
  }, [])

  /**
   * Track username submitted (register only)
   */
  const trackUsernameSubmitted = useCallback((username: string, usernameAvailable: boolean) => {
    const properties = {
      ...getBaseProperties(),
      username_length: username.length,
      username_available: usernameAvailable,
      flow: 'register' as OAuthFlow
    }

    posthogClient.captureEvent('oauth_username_submitted', properties)
  }, [])

  /**
   * Track OAuth success
   */
  const trackOAuthSuccess = useCallback((flow: OAuthFlow, userId?: string, email?: string, username?: string) => {
    const properties: OAuthSuccessProperties = {
      ...getBaseProperties(),
      flow,
      user_id: userId,
      email,
      username
    }

    posthogClient.captureEvent(`oauth_${flow}_success`, properties)
  }, [])

  /**
   * Track OAuth error
   */
  const trackOAuthError = useCallback((flow: OAuthFlow, step: OAuthStep, errorType: string, errorMessage: string) => {
    const properties: OAuthErrorProperties = {
      ...getBaseProperties(),
      error_type: errorType,
      error_message: errorMessage,
      flow,
      step
    }

    posthogClient.captureEvent(`oauth_${flow}_failed`, properties)
  }, [])

  return {
    trackOAuthInitiated,
    trackOAuthCallback,
    trackUsernameSelectionViewed,
    trackUsernameSubmitted,
    trackOAuthSuccess,
    trackOAuthError
  }
}

export default useOAuthTracking
