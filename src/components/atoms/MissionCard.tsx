"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Props for the MissionCard component
 * @interface MissionCardProps
 */
interface MissionCardProps {
  /** Icon for the mission card (SVG path) */
  iconPath: string;
  /** Title of the mission */
  title: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MissionCard component
 * @description A styled mission card with glassmorphism effect for the KSM Cyber Security section
 * @param props - Component properties
 * @returns MissionCard component
 */
const MissionCard: React.FC<MissionCardProps> = ({
  iconPath,
  title,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <div className="relative overflow-hidden rounded-xl group">
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-xl border border-purple-100/50 group-hover:bg-white/90 transition-colors duration-300"></div>

        {/* Accent border gradient - top left to bottom right */}
        <div className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[60%] h-[1px] bg-gradient-to-r from-purple-300 to-transparent"></div>
          <div className="absolute top-0 left-0 h-[60%] w-[1px] bg-gradient-to-b from-purple-300 to-transparent"></div>
        </div>

        {/* Accent border gradient - bottom right to top left */}
        <div className="absolute bottom-0 right-0 w-full h-full rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[60%] h-[1px] bg-gradient-to-l from-teal-300 to-transparent"></div>
          <div className="absolute bottom-0 right-0 h-[60%] w-[1px] bg-gradient-to-t from-teal-300 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative p-6 z-10">
          {/* Icon */}
          <div className="mb-4 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-100 to-teal-50 rounded-lg text-blue-900">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-900"
            >
              <path
                d={iconPath}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>

          {/* Decorative element */}
          <motion.div
            className="absolute bottom-3 right-6 w-12 h-12 opacity-10 pointer-events-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#6366F1"
                strokeWidth="1.5"
              />
              <circle cx="50" cy="50" r="35" stroke="#6366F1" strokeWidth="1" />
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke="#6366F1"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="15"
                stroke="#6366F1"
                strokeWidth="0.25"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;
