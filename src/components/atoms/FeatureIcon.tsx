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
          scale: 1.1,
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
      {/* Background circle with blur effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-gray-200/30 to-white/50 backdrop-blur-sm rounded-full"
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
                opacity: 0.8,
                transition: {
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
      />

      {/* Icon component */}
      <motion.div className="relative z-10" variants={iconVariants}>
        <Icon size={size} className="text-gray-900" />
      </motion.div>

      {/* Decorative ring */}
      <motion.div
        className="absolute inset-0 border border-gray-300/20 rounded-full"
        variants={{
          initial: { scale: 1.2, opacity: 0 },
          animate: {
            scale: 1,
            opacity: animateOnView ? 1 : 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2,
            },
          },
          hover: animateOnHover
            ? {
                scale: 1.3,
                opacity: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
      />
    </motion.div>
  );
};

export default FeatureIcon;
