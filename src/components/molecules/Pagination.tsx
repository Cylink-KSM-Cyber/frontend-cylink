import React from "react";

/**
 * Props for the Pagination component
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
   * Optional CSS class name
   */
  className?: string;
}

/**
 * Pagination Component
 * @description A component that provides pagination controls
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  "data-tour-id": dataTourId,
}: PaginationProps & { "data-tour-id"?: string }) => {
  // Generate simple page range for small pagination
  const getSimpleRange = (total: number) => {
    const pageNumbers = [];
    for (let i = 1; i <= total; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Add start pages with ellipsis if needed
  const addStartPages = (
    startPage: number,
    pageNumbers: (number | string)[]
  ) => {
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }
    }
  };

  // Add end pages with ellipsis if needed
  const addEndPages = (endPage: number, pageNumbers: (number | string)[]) => {
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }
      pageNumbers.push(totalPages);
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer
      return getSimpleRange(totalPages);
    }

    const pageNumbers: (number | string)[] = [];

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    // Adjust if we're near the end
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add start section
    addStartPages(startPage, pageNumbers);

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add end section
    addEndPages(endPage, pageNumbers);

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex justify-center mt-8 ${className ?? ""}`}
      {...(dataTourId ? { "data-tour-id": dataTourId } : {})}
    >
      <nav className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-50"
          }`}
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <React.Fragment
            key={typeof page === "number" ? `page-${page}` : page}
          >
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-50"
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
