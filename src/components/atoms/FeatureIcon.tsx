"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

/**
 * Props for the FeatureIcon component
 * @interface FeatureIconProps
 */
interface FeatureIconProps {
  /** The icon component to display */
  icon: IconType;
  /** Additional CSS classes */
  className?: string;
  /** The size of the icon in pixels */
  size?: number;
  /** Whether to animate the icon on hover */
  animateOnHover?: boolean;
  /** Whether to animate the icon when it comes into view */
  animateOnView?: boolean;
}

/**
 * FeatureIcon component
 * @description A styled icon component for features with optional animations
 * @param props - Component properties
 * @returns FeatureIcon component
 */
const FeatureIcon: React.FC<FeatureIconProps> = ({
  icon: Icon,
  className = "",
  size = 48,
  animateOnHover = true,
  animateOnView = true,
}) => {
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: -5 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: animateOnHover
      ? {
          scale: 1.15,
          rotate: 0,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }
      : {},
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Enhanced background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-200/80 to-white/90 backdrop-blur-lg rounded-full shadow-md"
        variants={{
          initial: { scale: 0.6, opacity: 0 },
          animate: {
            scale: 1,
            opacity: animateOnView ? 1 : 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: 0.1,
            },
          },
          hover: animateOnHover
            ? {
                scale: 1.15,
                opacity: 1,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
      />

      {/* Subtle inner ring */}
      <motion.div
        className="absolute inset-[15%] border border-gray-400/20 rounded-full"
        variants={{
          initial: { scale: 0.7, opacity: 0 },
          animate: {
            scale: 1,
            opacity: 0.7,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2,
            },
          },
          hover: animateOnHover
            ? {
                scale: 0.9,
                opacity: 0.9,
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
      />

      {/* Icon component with stronger presence */}
      <motion.div className="relative z-10" variants={iconVariants}>
        <Icon size={size} className="text-gray-800" />
      </motion.div>

      {/* Enhanced outer decorative ring */}
      <motion.div
        className="absolute inset-[-5%] border-2 border-gray-300/30 rounded-full"
        variants={{
          initial: { scale: 1.2, opacity: 0 },
          animate: {
            scale: 1,
            opacity: animateOnView ? 0.8 : 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2,
            },
          },
          hover: animateOnHover
            ? {
                scale: 1.3,
                opacity: 0.3,
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
      />

      {/* Pulse effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/0"
        variants={{
          initial: { scale: 1, opacity: 0 },
          animate: { scale: 1, opacity: 0 },
          hover: animateOnHover
            ? {
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }
            : {},
        }}
      />
    </motion.div>
  );
};

export default FeatureIcon;
