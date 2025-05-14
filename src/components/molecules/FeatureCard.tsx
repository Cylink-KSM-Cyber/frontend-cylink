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
      className={`relative overflow-hidden rounded-xl p-8 group ${className}`}
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
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Enhanced Glassmorphism background */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl border border-gray-200/50 rounded-xl z-0 shadow-lg group-hover:bg-white/40 transition-all duration-300"></div>

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/20 to-white/30 rounded-xl blur-xl"></div>
      </div>

      {/* Enhanced Background pattern - Japanese-inspired */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1rem_1rem,rgba(0,0,0,0.05)_0.5rem,transparent_0.5rem)] bg-[length:1.5rem_1.5rem] opacity-20 z-0"></div>

      {/* Subtle geometric accents */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 opacity-20 z-0"
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
            strokeWidth="0.8"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon at the top - larger and more prominent */}
        <div className="mb-8 w-24 h-24">
          <FeatureIcon icon={icon} size={40} className="w-full h-full" />
        </div>

        {/* Title with bottom border accent - enhanced visibility */}
        <div className="relative mb-5 pb-3">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-[2px] bg-gray-400/50"
            initial={{ width: 0 }}
            whileInView={{
              width: 60,
              transition: { delay: animationDelay + 0.3, duration: 0.5 },
            }}
            viewport={{ once: true }}
          />
        </div>

        {/* Description - improved visibility */}
        <p className="text-gray-700 leading-relaxed font-medium">
          {description}
        </p>

        {/* Bottom accent - more visible */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gray-400/30 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { delay: animationDelay + 0.4, duration: 0.6 },
          }}
          viewport={{ once: true }}
        />
      </div>

      {/* Enhanced corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-400/30 rounded-tl-lg"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-400/30 rounded-br-lg"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-300/40"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-300/40"></div>
    </motion.div>
  );
};

export default FeatureCard;
