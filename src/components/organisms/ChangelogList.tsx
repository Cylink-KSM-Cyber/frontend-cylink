/**
 * ChangelogList component
 * @description Organism component for displaying a list of changelog entries with pagination and filtering
 */

"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChangelogListProps } from "@/interfaces/changelog";
import ChangelogEntry from "@/components/molecules/ChangelogEntry";
import Button from "@/components/atoms/Button";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

/**
 * ChangelogList component with pagination and smooth animations
 * @param props - Component properties
 * @returns ChangelogList component
 */
const ChangelogList: React.FC<ChangelogListProps> = ({
  entries,
  initialCount = 5,
  enablePagination = true,
  itemsPerPage = 5,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination
  const totalPages = enablePagination
    ? Math.ceil(entries.length / itemsPerPage)
    : 1;

  const visibleEntries = useMemo(() => {
    if (!enablePagination) {
      return entries.slice(0, initialCount);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return entries.slice(startIndex, endIndex);
  }, [entries, currentPage, enablePagination, itemsPerPage, initialCount]);

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;

    setIsLoading(true);

    // Simulate loading for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCurrentPage(page);
    setIsLoading(false);

    // Scroll to top of changelog list
    const element = document.getElementById("changelog-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLoadMore = async () => {
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCurrentPage((prev) => prev + 1);
    setIsLoading(false);
  };

  // Animation variants for staggered entry appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const entryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (entries.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No changelog entries yet
          </h3>
          <p className="text-gray-600">
            Check back later for updates and new features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="changelog-list" className={`space-y-6 ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Entries List */}
      {!isLoading && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {visibleEntries.map((entry, index) => (
            <motion.div key={entry.id} variants={entryVariants} layout>
              <ChangelogEntry
                entry={entry}
                defaultExpanded={index === 0} // Expand first entry by default
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {enablePagination && totalPages > 1 && !isLoading && (
        <div className="flex justify-center items-center space-x-4 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;

              // Show only current page and adjacent pages for large page counts
              if (totalPages > 7) {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`
                        w-8 h-8 rounded-md text-sm font-medium transition-colors duration-200
                        ${
                          isCurrentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              }

              // Show all pages for smaller page counts
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`
                    w-8 h-8 rounded-md text-sm font-medium transition-colors duration-200
                    ${
                      isCurrentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Load More Button (Alternative to pagination) */}
      {!enablePagination &&
        visibleEntries.length < entries.length &&
        !isLoading && (
          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              Load More Entries
            </Button>
          </div>
        )}

      {/* Entry Count */}
      {entries.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4">
          {enablePagination ? (
            <>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, entries.length)} of{" "}
              {entries.length} entries
            </>
          ) : (
            <>
              Showing {visibleEntries.length} of {entries.length} entries
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangelogList;
