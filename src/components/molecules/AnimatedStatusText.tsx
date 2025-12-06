/**
 * Animated Status Text Component
 * 
 * Cycles through dynamic status messages with smooth fade transitions.
 * Designed to engage Gen Z users during the interstitial countdown.
 * 
 * @module src/components/molecules/AnimatedStatusText
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedStatusTextProps } from "@/interfaces/interstitial";

const AnimatedStatusText: React.FC<AnimatedStatusTextProps> = ({
  messages,
  interval = 2500,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Don't set up interval if there's only one message
    if (messages.length <= 1) {
      return;
    }

    // Cycle through messages at specified interval
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [messages.length, interval]);

  // Get current message
  const currentMessage = messages[currentIndex] || messages[0];

  return (
    <div
      className={`animated-status-text flex items-center justify-center min-h-[60px] ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="text-center"
        >
          <p className="text-base md:text-lg text-gray-700 font-medium px-4">
            {currentMessage}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Optional loading dots indicator */}
      <motion.div
        className="flex gap-1 ml-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[0, 1, 2].map((dotIndex) => (
          <motion.span
            key={dotIndex}
            className="w-1.5 h-1.5 bg-gray-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: dotIndex * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedStatusText;

