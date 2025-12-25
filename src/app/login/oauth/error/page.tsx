'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

/**
 * OAuth Error Page
 * @description Displays error messages for OAuth authentication failures
 * @returns OAuth error page component
 */
const OAuthErrorPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const errorType = searchParams.get('error')
  const email = searchParams.get('email')

  const getErrorDetails = () => {
    switch (errorType) {
      case 'not_registered':
        return {
          title: 'Account Not Registered',
          message: email
            ? `The email address ${email} is not registered in our system. Please create an account first.`
            : 'This Google account is not registered in our system. Please create an account first.',
          showRegisterButton: true
        }
      case 'access_denied':
        return {
          title: 'Access Denied',
          message: 'You denied access to your Google account. Please try again and grant the necessary permissions.',
          showRegisterButton: false
        }
      case 'no_code':
        return {
          title: 'Authentication Error',
          message: 'No authorization code was received from Google. Please try again.',
          showRegisterButton: false
        }
      case 'initialization_failed':
        return {
          title: 'Initialization Failed',
          message: 'Failed to initialize Google OAuth. Please try again later.',
          showRegisterButton: false
        }
      case 'authentication_failed':
        return {
          title: 'Authentication Failed',
          message: 'An error occurred during authentication. Please try again.',
          showRegisterButton: false
        }
      default:
        return {
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please try again.',
          showRegisterButton: false
        }
    }
  }

  const errorDetails = getErrorDetails()

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full'
      >
        {/* Error Icon */}
        <div className='mb-8 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4'>
            <svg className='w-10 h-10 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-black mb-3'>{errorDetails.title}</h1>
          <p className='text-gray-600 leading-relaxed'>{errorDetails.message}</p>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          {errorDetails.showRegisterButton && (
            <Link
              href='/register'
              className='block w-full px-6 py-3 bg-black text-white text-center rounded font-medium hover:bg-gray-800 transition-colors'
            >
              Create Account
            </Link>
          )}

          <button
            onClick={() => router.push('/login')}
            className={`w-full px-6 py-3 rounded font-medium transition-colors ${
              errorDetails.showRegisterButton
                ? 'bg-white text-black border-2 border-black hover:bg-gray-50'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Back to Login
          </button>
        </div>

        {/* Help Text */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500'>
            Need help?{' '}
            <Link href='/support' className='text-black font-medium hover:underline'>
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default OAuthErrorPage
