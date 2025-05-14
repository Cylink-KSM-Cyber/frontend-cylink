"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Props for the StatisticCard component
 * @interface StatisticCardProps
 */
interface StatisticCardProps {
  /** The numerical value to display */
  value: number;
  /** The label for the statistic */
  label: string;
  /** Icon SVG path */
  iconPath: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StatisticCard component
 * @description A card displaying a numerical statistic with animation
 * @param props - Component properties
 * @returns StatisticCard component
 */
const StatisticCard: React.FC<StatisticCardProps> = ({
  value,
  label,
  iconPath,
  delay = 0,
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  // Animate the counter when in view
  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const duration = 1500; // milliseconds
      const increment = Math.ceil(value / (duration / 16)); // rough approximation for 60fps

      const timer = setTimeout(() => {
        const counter = setInterval(() => {
          startValue += increment;

          if (startValue > value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(startValue);
          }
        }, 16);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Enhanced Card with glassmorphism */}
      <div className="relative w-64 h-64 px-6 py-6 rounded-xl overflow-hidden group flex flex-col items-center justify-center">
        {/* Enhanced glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-xl border border-white/30 group-hover:from-white/90 group-hover:to-white/70 transition-all duration-300"></div>

        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-teal-200/50 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-teal-400/10 blur-xl"></div>
        </div>

        {/* Inner border glow on hover */}
        <div className="absolute inset-[3px] rounded-lg border border-transparent group-hover:border-indigo-200/50 transition-all duration-300"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* Icon container with enhanced hover effects */}
          <div className="relative mb-4 transition-all duration-300 group-hover:transform group-hover:translate-y-[-5px]">
            {/* Icon background with pulse effect */}
            <div className="absolute inset-[-4px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-md opacity-70 group-hover:opacity-90 group-hover:blur-lg transition-all duration-300"></div>

            {/* Icon container */}
            <div className="relative z-10 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-full border border-blue-100/70 text-blue-900 shadow-sm group-hover:shadow-blue-100/50 transition-all duration-300">
              {/* Glowing ring on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-300/0 group-hover:border-indigo-300/30 group-hover:scale-110 transition-all duration-500"></div>

              {/* Icon */}
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-900 group-hover:text-indigo-700 transition-colors duration-300"
                animate={{ rotate: [0, 0] }} // Initial state for hover animation
                whileHover={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <path
                  d={iconPath}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </div>

          {/* Value with animating counter - enhanced */}
          <div className="text-4xl font-bold text-blue-900 mb-2 statistic-value group-hover:text-indigo-700 transition-colors duration-300">
            {displayValue}
          </div>

          {/* Label - enhanced */}
          <div className="text-sm text-gray-600 uppercase tracking-wider font-medium group-hover:text-indigo-600 transition-colors duration-300 text-center">
            {label}
          </div>

          {/* Animated underline on hover */}
          <motion.div
            className="h-[2px] w-0 mt-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400"
            initial={{ width: 0 }}
            whileHover={{ width: "70%" }}
            transition={{ duration: 0.3 }}
          />

          {/* Decorative particles that animate on hover */}
          <div className="absolute top-2 right-2 w-6 h-6 opacity-20 group-hover:opacity-60 transition-opacity duration-300">
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-purple-400"
              animate={{ rotate: [0, 0] }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="12" cy="12" r="2" />
              <circle cx="4" cy="4" r="1.5" />
              <circle cx="20" cy="4" r="1" />
              <circle cx="4" cy="20" r="1" />
              <circle cx="20" cy="20" r="2" />
            </motion.svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
