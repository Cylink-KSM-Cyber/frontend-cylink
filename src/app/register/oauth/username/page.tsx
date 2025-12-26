'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthService from '@/services/auth'
import { useOAuthTracking } from '@/hooks/useOAuthTracking'

/**
 * Username selection schema
 */
const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
})

type UsernameFormValues = z.infer<typeof usernameSchema>

/**
 * OAuth Username Selection Page
 * @description Allows users to choose their username after Google OAuth registration
 */
export default function OAuthUsernamePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const { trackUsernameSelectionViewed, trackUsernameSubmitted, trackOAuthSuccess, trackOAuthError } =
    useOAuthTracking()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: ''
    }
  })

  const username = watch('username')

  // Track page view on mount
  useEffect(() => {
    trackUsernameSelectionViewed(!!token)
  }, [trackUsernameSelectionViewed, token])

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsCheckingAvailability(true)
      try {
        // TODO: Implement actual username availability check API
        // For now, just simulate
        await new Promise(resolve => setTimeout(resolve, 500))
        setUsernameAvailable(true)
      } catch (err) {
        setUsernameAvailable(false)
      } finally {
        setIsCheckingAvailability(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push('/login/oauth/error?error=invalid_token&flow=register')
    }
  }, [token, router])

  const onSubmit = async (data: UsernameFormValues) => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    // Track username submission
    trackUsernameSubmitted(data.username, usernameAvailable || false)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5123'
      const response = await fetch(`${backendUrl}/api/v1/auth/oauth/google/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          username: data.username
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      // Save tokens
      AuthService.saveTokens(result.data.token.access, result.data.token.refresh, true)

      // Track success
      trackOAuthSuccess('register', result.data.user?.id?.toString(), result.data.user?.email, data.username)

      // Show success state
      setIsLoading(false)
      setIsSuccess(true)

      // Wait 2 seconds before redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'

      // Track error
      trackOAuthError('register', 'completion', 'registration_failed', errorMessage)

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Choose Your Username</h1>
            <p className='text-gray-600 dark:text-gray-400'>Pick a unique username for your CyLink profile</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <Input
                {...register('username')}
                label='Username'
                type='text'
                placeholder='Enter your username'
                error={errors.username?.message}
                disabled={isLoading}
              />

              {/* Username availability indicator */}
              {username && username.length >= 3 && !errors.username && (
                <div className='mt-2 text-sm'>
                  {isCheckingAvailability ? (
                    <span className='text-gray-500'>Checking availability...</span>
                  ) : usernameAvailable ? (
                    <span className='text-green-600'>✓ Username available</span>
                  ) : (
                    <span className='text-red-600'>✗ Username already taken</span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
              </div>
            )}

            <Button type='submit' variant='primary' fullWidth disabled={isLoading || isSuccess || !usernameAvailable}>
              {isSuccess
                ? '✓ Registration Successful! Redirecting...'
                : isLoading
                ? 'Creating Account...'
                : 'Complete Registration'}
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Your username will be used for your custom short link:
              <br />
              <span className='font-mono text-primary-600 dark:text-primary-400'>
                cylink.id/{username || 'username'}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
