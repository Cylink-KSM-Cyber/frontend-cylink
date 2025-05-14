"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import FeatureIcon from "@/components/atoms/FeatureIcon";

/**
 * Props for the FeatureCard component
 * @interface FeatureCardProps
 */
interface FeatureCardProps {
  /** The title of the feature */
  title: string;
  /** The description of the feature */
  description: string;
  /** The icon for the feature */
  icon: IconType;
  /** The delay for the animation in seconds */
  animationDelay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeatureCard component
 * @description A card displaying a feature with a glassmorphism effect
 * @param props - Component properties
 * @returns FeatureCard component
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  animationDelay = 0,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl p-6 group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: animationDelay,
          ease: "easeOut",
        },
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-gray-200/20 rounded-xl z-0 group-hover:bg-white/15 transition-colors duration-300"></div>

      {/* Background pattern - Japanese-inspired */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1rem_1rem,rgba(0,0,0,0.03)_0.5rem,transparent_0.5rem)] bg-[length:1.5rem_1.5rem] opacity-10 z-0"></div>

      {/* Subtle geometric accents */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 z-0"
        initial={{ rotate: 0 }}
        whileHover={{
          rotate: 5,
          transition: { duration: 1.5, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon at the top */}
        <div className="mb-6 w-20 h-20">
          <FeatureIcon icon={icon} size={36} className="w-full h-full" />
        </div>

        {/* Title with bottom border accent */}
        <div className="relative mb-4 pb-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gray-400/30"
            initial={{ width: 0 }}
            whileInView={{
              width: 48,
              transition: { delay: animationDelay + 0.3, duration: 0.5 },
            }}
            viewport={{ once: true }}
          />
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{description}</p>

        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { delay: animationDelay + 0.4, duration: 0.6 },
          }}
          viewport={{ once: true }}
        />
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gray-300/30 rounded-tl-lg"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gray-300/30 rounded-br-lg"></div>
    </motion.div>
  );
};

export default FeatureCard;
