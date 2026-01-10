'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * Vote Counter Props
 */
interface VoteCounterProps {
  /**
   * Vote count to display
   */
  count: number

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Vote Counter Component
 * @description Displays vote count with animation
 */
const VoteCounter: React.FC<VoteCounterProps> = ({ count, className = '' }) => {
  const getColorClass = () => {
    if (count > 0) return 'text-green-600'
    if (count < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <motion.div
      key={count}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.3 }}
      className={`text-center ${className}`}
    >
      <span className={`text-lg font-bold ${getColorClass()}`}>{count}</span>
    </motion.div>
  )
}

export default VoteCounter
