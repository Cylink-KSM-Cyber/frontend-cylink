"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={className}
    >
      <Link
        href={url}
        className="relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-black/20 group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background animation on hover */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{
            scale: isHovered ? 0.97 : 1,
            backgroundColor: isHovered
              ? "rgba(0, 0, 0, 0.85)"
              : "rgba(0, 0, 0, 1)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Japanese-inspired decorative accent lines */}
        <motion.span
          className="absolute top-0 left-0 w-full h-[1px] bg-white/20"
          animate={{
            scaleX: isHovered ? 1.05 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.span
          className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"
          animate={{
            scaleX: isHovered ? 1.05 : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.span
          className="absolute left-0 top-0 h-full w-[1px] bg-white/20"
          animate={{
            scaleY: isHovered ? 1.05 : 1,
            opacity: isHovered ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.span
          className="absolute right-0 top-0 h-full w-[1px] bg-white/10"
          animate={{
            scaleY: isHovered ? 1.05 : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Button text and animation */}
        <motion.span
          className="relative z-10 flex items-center"
          animate={{
            scale: isHovered ? 1.03 : 1,
            x: isHovered ? 2 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {text}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            animate={{
              x: isHovered ? [0, 5, 0] : [0, 3, 0],
              scale: isHovered ? 1.2 : 1,
              transition: {
                duration: isHovered ? 0.8 : 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </motion.svg>
        </motion.span>

        {/* Animated shine effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Pulse effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="absolute inset-0 rounded-md"
              initial={{ scale: 0.9, opacity: 0.3 }}
              animate={{ scale: 1.1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ border: "1px solid rgba(255,255,255,0.5)" }}
            />
          )}
        </AnimatePresence>

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

        {/* Particle effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0.8,
                  }}
                  animate={{
                    x:
                      Math.random() > 0.5
                        ? Math.random() * 50
                        : Math.random() * -50,
                    y:
                      Math.random() > 0.5
                        ? Math.random() * 30
                        : Math.random() * -30,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  style={{
                    left: `${45 + Math.random() * 10}%`,
                    top: `${45 + Math.random() * 10}%`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
};

export default HeroCallToAction;
