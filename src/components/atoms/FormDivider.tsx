'use client'

import React from 'react'

/**
 * Form divider properties
 * @interface FormDividerProps
 */
interface FormDividerProps {
  /**
   * Divider text (default: "OR")
   */
  text?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Form Divider Component
 * @description A horizontal divider with centered text for separating form sections
 * @param props - Form divider properties
 * @returns Form divider component
 */
const FormDivider: React.FC<FormDividerProps> = ({ text = 'OR', className = '' }) => {
  return (
    <div className={`relative my-6 ${className}`}>
      {/* Horizontal line using semantic hr element */}
      <hr className='border-t border-[#E5E7EB]' aria-label={`${text} separator`} />

      {/* Centered text */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='px-3 bg-white text-xs font-medium text-[#6B7280] uppercase'>{text}</span>
      </div>
    </div>
  )
}

export default FormDivider
