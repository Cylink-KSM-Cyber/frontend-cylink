"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import KeyHighlight from "@/components/atoms/KeyHighlight";

/**
 * Props for the AboutContent component
 * @interface AboutContentProps
 */
interface AboutContentProps {
  /** The title of the about section */
  title: string;
  /** The description text */
  description: string;
  /** Array of key highlight points */
  highlights: string[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * AboutContent component
 * @description A component displaying the main content of the About section
 * @param props - Component properties
 * @returns AboutContent component
 */
const AboutContent: React.FC<AboutContentProps> = ({
  title,
  description,
  highlights,
  className = "",
}) => {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);

  // Split the title into words for individual animation
  const titleWords = title.split(" ");

  return (
    <div className={`relative z-10 ${className}`}>
      {/* Title with animation */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-white mb-6 relative inline-block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex flex-wrap gap-x-2">
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.1 * index,
                },
              }}
              whileHover={{
                scale: 1.05,
                color: "rgba(255, 255, 255, 0.95)",
                transition: { duration: 0.2 },
              }}
              viewport={{ once: true }}
              className="inline-block cursor-default"
              onMouseEnter={() => setHoveredWord(index)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word}
              {hoveredWord === index && (
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white/30"
                  layoutId="underline"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.span>
          ))}
        </span>

        {/* Decorative underline */}
        <motion.span
          className="absolute -bottom-3 left-0 right-0 h-[2px] bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.h2>

      {/* Description with animation */}
      <motion.div
        className="max-w-3xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </motion.div>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {highlights.map((highlight, index) => (
          <KeyHighlight
            key={index}
            text={highlight}
            delay={0.2 + index * 0.1}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -top-10 -left-10 w-20 h-20 opacity-5 pointer-events-none"
        initial={{ opacity: 0, rotate: -10 }}
        whileInView={{ opacity: 0.05, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Additional decoration */}
      <motion.div
        className="absolute -bottom-10 -right-10 w-24 h-24 opacity-5 pointer-events-none"
        initial={{ opacity: 0, rotate: 10 }}
        whileInView={{ opacity: 0.03, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke="white"
            strokeWidth="0.3"
          />
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="white"
            strokeWidth="0.3"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default AboutContent;
