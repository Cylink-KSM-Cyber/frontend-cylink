"use client";

import React from "react";
import { ChangelogEntryProps } from "@/interfaces/changelog";
import ChangelogCategoryBadge from "@/components/atoms/ChangelogCategoryBadge";
import { processMarkdownContent } from "@/utils/markdownProcessor";

/**
 * ChangelogEntry component for responsive timeline layout
 *
 * Features:
 * - Mobile: Single column with date/version above category badges
 * - Desktop: Two-column layout with date/version on the left
 * - Safe HTML rendering from controlled MDX content sources
 * - Timeline layout with responsive design
 * - Category badges and markdown content processing
 *
 * @param props - Component properties
 * @returns ChangelogEntry component
 */
const ChangelogEntry: React.FC<ChangelogEntryProps> = ({
  entry,
  isLast = false,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line - Desktop only */}
      {!isLast && (
        <div className="hidden md:block absolute left-[76px] top-8 bottom-0 w-px bg-gray-300"></div>
      )}

      {/* Mobile Layout: Single Column */}
      <div className="block md:hidden">
        {/* Date and Version - Mobile */}
        <div className="mb-4">
          <div className="text-gray-500 text-sm mb-2">
            {new Date(entry.frontmatter.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full text-sm font-medium">
            {entry.frontmatter.version.split(".").slice(0, 2).join(".")}
          </div>
        </div>

        {/* Category badges - Mobile */}
        <div className="flex flex-wrap gap-2 mb-6">
          {entry.frontmatter.category.map((cat) => (
            <ChangelogCategoryBadge key={cat} category={cat} size="sm" />
          ))}
        </div>

        {/* Content - Mobile */}
        <div className="prose prose-gray prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: processMarkdownContent(entry.content),
            }}
          />
        </div>
      </div>

      {/* Desktop Layout: Two Columns */}
      <div className="hidden md:flex gap-8">
        {/* Date and Version Column - Desktop */}
        <div className="flex-shrink-0 w-32">
          <div className="text-gray-500 text-sm mb-1">
            {new Date(entry.frontmatter.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full text-sm font-medium">
            {entry.frontmatter.version.split(".").slice(0, 2).join(".")}
          </div>
        </div>

        {/* Content Column - Desktop */}
        <div className="flex-1 min-w-0">
          {/* Category badges - Desktop */}
          <div className="flex flex-wrap gap-2 mb-6">
            {entry.frontmatter.category.map((cat) => (
              <ChangelogCategoryBadge key={cat} category={cat} size="sm" />
            ))}
          </div>

          {/* Content - Desktop */}
          <div className="prose prose-gray prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html: processMarkdownContent(entry.content),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogEntry;
