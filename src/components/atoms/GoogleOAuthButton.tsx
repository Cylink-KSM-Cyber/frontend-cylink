'use client'

import React from 'react'

/**
 * Google OAuth button properties
 * @interface GoogleOAuthButtonProps
 */
interface GoogleOAuthButtonProps {
  /**
   * Click handler for OAuth flow
   */
  onClick?: () => void
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Context variant for analytics
   */
  variant?: 'login' | 'register'
}

/**
 * Google "G" Logo SVG Component
 * @description Official Google "G" logo with correct brand colors
 */
const GoogleLogo: React.FC = () => (
  <svg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <g fill='none' fillRule='evenodd'>
      <path
        d='M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z'
        fill='#4285F4'
      />
      <path
        d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z'
        fill='#34A853'
      />
      <path
        d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z'
        fill='#FBBC05'
      />
      <path
        d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'
        fill='#EA4335'
      />
    </g>
  </svg>
)

/**
 * Google OAuth Button Component
 * @description A button for Google OAuth authentication following official branding guidelines
 * @param props - Google OAuth button properties
 * @returns Google OAuth button component
 */
const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  variant = 'login'
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Placeholder for future backend integration
      console.log(`Google OAuth ${variant} clicked - Backend integration pending`)
    }
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full
        px-4 py-2.5
        bg-black
        rounded
        font-medium text-sm text-white
        inline-flex items-center justify-center
        transition-all duration-200
        hover:bg-[#333333]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={`Continue with Google for ${variant}`}
      data-variant={variant}
    >
      <span className='mr-3'>
        <GoogleLogo />
      </span>{' '}
      Continue with Google
    </button>
  )
}

export default GoogleOAuthButton
