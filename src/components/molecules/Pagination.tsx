import React from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

/**
 * Prop types for Pagination component
 */
interface PaginationProps {
  /**
   * Current page number (1-based)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Function to call when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * Pagination Component
 * @description Provides pagination controls for navigating through multi-page data
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // If there's only one page or less, don't render pagination
  if (totalPages <= 1) {
    return null;
  }

  // Calculate range of page numbers to display
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Common button styles
  const buttonClasses =
    "flex items-center justify-center h-8 w-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1";
  const activeButtonClasses = "bg-black text-white";
  const inactiveButtonClasses = "bg-white text-[#333333] hover:bg-[#F5F5F5]";
  const disabledButtonClasses = "bg-white text-gray-300 cursor-not-allowed";

  return (
    <nav className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses
          }`}
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? disabledButtonClasses
              : inactiveButtonClasses
          }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <div>
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {/* Previous page button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`${buttonClasses} rounded-l-md ${
                currentPage === 1
                  ? disabledButtonClasses
                  : inactiveButtonClasses
              }`}
              aria-label="Previous page"
            >
              <RiArrowLeftSLine className="h-5 w-5" />
            </button>

            {/* First page button, with ellipsis if needed */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={`${buttonClasses} ${inactiveButtonClasses}`}
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className={`${buttonClasses} ${inactiveButtonClasses}`}>
                    ...
                  </span>
                )}
              </>
            )}

            {/* Page number buttons */}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`${buttonClasses} ${
                  currentPage === pageNumber
                    ? activeButtonClasses
                    : inactiveButtonClasses
                }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}

            {/* Last page button, with ellipsis if needed */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] <
                  totalPages - 1 && (
                  <span className={`${buttonClasses} ${inactiveButtonClasses}`}>
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`${buttonClasses} ${inactiveButtonClasses}`}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next page button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`${buttonClasses} rounded-r-md ${
                currentPage === totalPages
                  ? disabledButtonClasses
                  : inactiveButtonClasses
              }`}
              aria-label="Next page"
            >
              <RiArrowRightSLine className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
