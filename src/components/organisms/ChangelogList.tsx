/**
 * ChangelogList component
 * @description Organism component for displaying changelog entries in dark timeline layout
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChangelogListProps } from "@/interfaces/changelog";
import ChangelogEntry from "@/components/molecules/ChangelogEntry";

/**
 * ChangelogList component with timeline layout and animations
 * @param props - Component properties
 * @returns ChangelogList component
 */
const ChangelogList: React.FC<ChangelogListProps> = ({
  entries,
  className = "",
}) => {
  // Animation variants for staggered entry appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (entries.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No changelog entries found
        </h3>
        <p className="text-gray-400">
          Changelog entries will appear here once they are published.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-16 ${className}`}
    >
      {entries.map((entry, index) => (
        <motion.div key={entry.id} variants={entryVariants}>
          <ChangelogEntry entry={entry} isLast={index === entries.length - 1} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChangelogList;
