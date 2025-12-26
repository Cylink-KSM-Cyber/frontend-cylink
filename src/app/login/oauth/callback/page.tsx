'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthService from '@/services/auth'
import { motion } from 'framer-motion'
import { useOAuthTracking } from '@/hooks/useOAuthTracking'

/**
 * OAuth Callback Page
 * @description Handles OAuth callback from Google and processes authentication
 * @returns OAuth callback page component
 */
const OAuthCallbackPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const { trackOAuthCallback, trackOAuthSuccess, trackOAuthError } = useOAuthTracking()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const firstLogin = searchParams.get('first_login') === 'true'
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')

        // Track callback received
        trackOAuthCallback('login', !!code || !!accessToken, !!errorParam)

        if (!accessToken || !refreshToken) {
          // Track error
          trackOAuthError('login', 'callback', 'missing_tokens', 'Authentication failed. Missing tokens.')
          setError('Authentication failed. Missing tokens.')
          setIsProcessing(false)
          return
        }

        // Store tokens using AuthService
        AuthService.saveTokens(accessToken, refreshToken, true)

        // Get user data from stored tokens
        const userData = AuthService.getUser()

        // Track success
        trackOAuthSuccess('login', userData?.id?.toString(), userData?.email)

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } catch (err) {
        console.error('OAuth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during authentication.'

        // Track error
        trackOAuthError('login', 'callback', 'processing_error', errorMessage)

        setError(errorMessage)
        setIsProcessing(false)
      }
    }

    processCallback()
  }, [searchParams, router, trackOAuthCallback, trackOAuthSuccess, trackOAuthError])

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-md w-full text-center'
        >
          <div className='mb-6'>
            <svg className='mx-auto h-16 w-16 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-black mb-4'>Authentication Failed</h1>
          <p className='text-gray-600 mb-8'>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className='w-full px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors'
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center'>
        <div className='mb-6'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black'></div>
        </div>
        <h1 className='text-2xl font-bold text-black mb-2'>Completing Sign In</h1>
        <p className='text-gray-600'>Please wait while we authenticate your account...</p>
      </motion.div>
    </div>
  )
}

export default OAuthCallbackPage
