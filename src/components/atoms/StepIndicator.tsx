"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Props for the StepIndicator component
 * @interface StepIndicatorProps
 */
interface StepIndicatorProps {
  /** The step number (1-based) */
  number: number;
  /** Whether this step is active */
  isActive?: boolean;
  /** Whether this step has been completed */
  isCompleted?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StepIndicator component
 * @description A hexagonal step indicator with animations for the How It Works section
 * @param props - Component properties
 * @returns StepIndicator component
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({
  number,
  isActive = false,
  isCompleted = false,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Hexagonal shape */}
      <div className="relative">
        {/* Outer hexagon */}
        <motion.div
          className={`w-16 h-16 flex items-center justify-center relative ${
            isActive
              ? "text-white"
              : isCompleted
              ? "text-gray-300"
              : "text-gray-400"
          }`}
          animate={{
            scale: isActive ? 1.05 : 1,
            transition: {
              duration: 0.5,
              repeat: isActive ? Infinity : 0,
              repeatType: "reverse",
            },
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{
                pathLength: 1,
                opacity: 1,
                transition: { duration: 1, delay: 0.2 },
              }}
              viewport={{ once: true }}
            />

            {isActive && (
              <motion.path
                d="M50 10L83.3 30V70L50 90L16.7 70V30L50 10Z"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 1 },
                }}
              />
            )}
          </svg>

          {/* Step number */}
          <motion.div
            className={`text-xl font-bold z-10 ${
              isActive
                ? "text-white"
                : isCompleted
                ? "text-gray-300"
                : "text-gray-500"
            }`}
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
              transition: { duration: 1.5, repeat: isActive ? Infinity : 0 },
            }}
          >
            {number}
          </motion.div>
        </motion.div>

        {/* Active indicator glow effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl z-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default StepIndicator;
