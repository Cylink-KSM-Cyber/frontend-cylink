"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * HeroCallToAction component props interface
 */
interface HeroCallToActionProps {
  /** Text to display on the button */
  text: string;
  /** URL to navigate to when clicked */
  url: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * HeroCallToAction component
 * @description A styled call-to-action button for hero sections
 * @param props - Component properties
 * @returns HeroCallToAction component
 */
const HeroCallToAction: React.FC<HeroCallToActionProps> = ({
  text,
  url,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={className}
    >
      <Link
        href={url}
        className="relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-black/10 group overflow-hidden"
      >
        {/* Japanese-inspired decorative accent lines */}
        <span className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></span>
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></span>
        <span className="absolute left-0 top-0 h-full w-[1px] bg-white/20"></span>
        <span className="absolute right-0 top-0 h-full w-[1px] bg-white/10"></span>

        {/* Button text and animation */}
        <span className="relative z-10 flex items-center">
          {text}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </motion.svg>
        </span>

        {/* Animated shine effect */}
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />

        {/* Subtle background patterns inspired by Japanese design */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="btn-pattern"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#btn-pattern)" />
        </svg>
      </Link>
    </motion.div>
  );
};

export default HeroCallToAction;
