/**
 * ChangelogEntry component
 * @description Molecule component for displaying individual changelog entries with expand/collapse functionality
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiPriceTagLine,
} from "react-icons/ri";
import { ChangelogEntryProps } from "@/interfaces/changelog";
import ChangelogCategoryBadge from "@/components/atoms/ChangelogCategoryBadge";
import ChangelogDateDisplay from "@/components/atoms/ChangelogDateDisplay";
import ChangelogVersionBadge from "@/components/atoms/ChangelogVersionBadge";

/**
 * ChangelogEntry component with expandable content and smooth animations
 * @param props - Component properties
 * @returns ChangelogEntry component
 */
const ChangelogEntry: React.FC<ChangelogEntryProps> = ({
  entry,
  defaultExpanded = false,
  showFullContent = false,
  className = "",
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  // Get preview content (first 150 characters)
  const getPreviewContent = (content: string) => {
    if (content.length <= 150) return content;
    return content.substring(0, 150) + "...";
  };

  const shouldShowToggle = !showFullContent && entry.content.length > 150;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Entry Header */}
      <div className="p-6 pb-4">
        {/* Date and Version Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <RiCalendarLine className="w-4 h-4 text-gray-400" />
            <ChangelogDateDisplay date={entry.frontmatter.date} format="long" />
          </div>
          <ChangelogVersionBadge
            version={entry.frontmatter.version}
            size="sm"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
          {entry.frontmatter.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {entry.frontmatter.summary}
        </p>

        {/* Categories and Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {entry.frontmatter.category.map((category, index) => (
            <ChangelogCategoryBadge key={index} category={category} size="sm" />
          ))}

          {entry.frontmatter.tags && entry.frontmatter.tags.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-1">
                <RiPriceTagLine className="w-3 h-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {entry.frontmatter.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Toggle Button */}
        {shouldShowToggle && (
          <button
            onClick={handleToggle}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <RiArrowRightSLine className="w-4 h-4" />
            </motion.div>
            <span>{isExpanded ? "Show less" : "Read more"}</span>
          </button>
        )}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {(isExpanded || showFullContent) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="border-t border-gray-100 pt-4">
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: entry.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Content for Non-Expandable */}
      {!showFullContent && !isExpanded && shouldShowToggle && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-100 pt-4">
            <div className="text-gray-700 text-sm leading-relaxed">
              {getPreviewContent(entry.content)}
            </div>
          </div>
        </div>
      )}

      {/* Show full content if it's short */}
      {!shouldShowToggle && !showFullContent && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-100 pt-4">
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: entry.content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {entry.frontmatter.featured && (
        <div className="absolute top-4 right-4">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}
    </motion.article>
  );
};

export default ChangelogEntry;
