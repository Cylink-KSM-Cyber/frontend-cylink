'use client'

import React from 'react'

/**
 * Segmented Control Option
 */
export interface SegmentedControlOption<T = string> {
  value: T
  label: string
}

/**
 * Segmented Control Props
 */
interface SegmentedControlProps<T = string> {
  /**
   * Available options
   */
  options: SegmentedControlOption<T>[]

  /**
   * Currently selected value
   */
  value: T

  /**
   * Change handler
   */
  onChange: (value: T) => void

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Segmented Control Component
 * @description Horizontal toggle for switching between options
 */
function SegmentedControl<T = string>({ options, value, onChange, className = '' }: SegmentedControlProps<T>) {
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 ${className}`}>
      {options.map(option => {
        const isActive = option.value === value

        return (
          <button
            key={String(option.value)}
            type='button'
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
            `}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
