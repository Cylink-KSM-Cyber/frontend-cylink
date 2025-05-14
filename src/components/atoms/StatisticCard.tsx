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
    >
      <div className="flex flex-col items-center px-6 py-4">
        <div className="relative mb-3">
          {/* Icon background */}
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-70"></div>

          {/* Icon */}
          <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-full border border-blue-100/50 text-blue-900">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-900"
            >
              <path
                d={iconPath}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Value with animating counter */}
        <div className="text-3xl font-bold text-blue-900 mb-1 statistic-value">
          {displayValue}
        </div>

        {/* Label */}
        <div className="text-sm text-gray-600 uppercase tracking-wider">
          {label}
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-0 left-0 w-6 h-6 opacity-20">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple-400"
          >
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="12" r="2" />
            <circle cx="2" cy="22" r="2" />
            <circle cx="12" cy="2" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="22" r="2" />
            <circle cx="22" cy="2" r="2" />
            <circle cx="22" cy="12" r="2" />
            <circle cx="22" cy="22" r="2" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;
