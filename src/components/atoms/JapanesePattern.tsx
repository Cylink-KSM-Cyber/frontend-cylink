/**
 * JapanesePattern component
 * @description A subtle Japanese-inspired pattern for backgrounds
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { JapanesePatternProps } from "@/interfaces/navbar";

/**
 * JapanesePattern component for subtle background patterns
 * @param props - Component properties
 * @returns JapanesePattern component
 */
const JapanesePattern: React.FC<JapanesePatternProps> = ({
  className = "",
  opacity = 5,
  animated = false,
  pattern = "dots",
}) => {
  // Pattern definitions
  const patterns = {
    dots: (
      <pattern
        id="jp-dots-pattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1" fill="currentColor" />
      </pattern>
    ),
    lines: (
      <pattern
        id="jp-lines-pattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="10"
          x2="20"
          y2="10"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </pattern>
    ),
    grid: (
      <pattern
        id="jp-grid-pattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </pattern>
    ),
    asanoha: (
      <pattern
        id="jp-asanoha-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(0.5)"
      >
        <path
          d="M20,0 L40,20 L20,40 L0,20 Z M20,10 L30,20 L20,30 L10,20 Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </pattern>
    ),
  };

  const patternElement = patterns[pattern];
  const patternId = `jp-${pattern}-pattern`;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <motion.svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ opacity: opacity / 100 }}
        animate={
          animated
            ? {
                opacity: [opacity / 100, (opacity * 1.5) / 100, opacity / 100],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      >
        <defs>{patternElement}</defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </motion.svg>
    </div>
  );
};

export default JapanesePattern;
