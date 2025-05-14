"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Props for the KeyHighlight component
 * @interface KeyHighlightProps
 */
interface KeyHighlightProps {
  /** The text to display */
  text: string;
  /** The delay for the animation */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * KeyHighlight component
 * @description A styled component for displaying key highlight points with animations
 * @param props - Component properties
 * @returns KeyHighlight component
 */
const KeyHighlight: React.FC<KeyHighlightProps> = ({
  text,
  delay = 0,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay,
          ease: "easeOut",
        },
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
    >
      {/* Highlight container with subtle hover effect */}
      <div className="highlight-item relative p-4 overflow-hidden group">
        {/* Background and border styling */}
        <div className="absolute inset-0 bg-gray-800/40 rounded-lg border border-gray-700 group-hover:bg-gray-800/60 transition-all duration-300"></div>

        {/* Japanese-inspired decorative corner accent */}
        <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L24 24"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
            <path
              d="M8 0V8H0"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{
              width: "2rem",
              transition: { duration: 0.4, delay: delay + 0.3 },
            }}
            viewport={{ once: true }}
            className="w-8 h-[1px] bg-gray-400 mb-3"
          />
          <p className="text-gray-100 font-medium leading-relaxed">{text}</p>
        </div>

        {/* Hover indicators */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gray-300/30"
          initial={{ width: 0 }}
          whileHover={{ width: "100%", transition: { duration: 0.3 } }}
        />

        {/* Additional interactive elements */}
        <motion.div
          className="absolute top-0 right-0 w-0 h-[2px] bg-gray-300/30"
          initial={{ width: 0 }}
          whileHover={{
            width: "30%",
            transition: { duration: 0.3, delay: 0.1 },
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-[2px] h-0 bg-gray-300/30"
          initial={{ height: 0 }}
          whileHover={{
            height: "30%",
            transition: { duration: 0.3, delay: 0.2 },
          }}
        />
      </div>
    </motion.div>
  );
};

export default KeyHighlight;
