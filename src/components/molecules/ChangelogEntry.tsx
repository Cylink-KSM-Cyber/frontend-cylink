/**
 * ChangelogEntry component for light timeline layout
 * @param props - Component properties
 * @returns ChangelogEntry component
 */

"use client";

import React from "react";
import { ChangelogEntryProps } from "@/interfaces/changelog";
import ChangelogCategoryBadge from "@/components/atoms/ChangelogCategoryBadge";
import { processMarkdownContent } from "@/utils/markdownProcessor";

/**
 * ChangelogEntry component for light timeline layout
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
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[76px] top-8 bottom-0 w-px bg-gray-300"></div>
      )}

      <div className="flex gap-8">
        {/* Date and Version Column */}
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

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold mb-6 leading-tight text-gray-900">
            {entry.frontmatter.title}
          </h2>

          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {entry.frontmatter.category.map((cat) => (
              <ChangelogCategoryBadge key={cat} category={cat} size="sm" />
            ))}
          </div>

          {/* Content with Rich Text Hierarchy */}
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
