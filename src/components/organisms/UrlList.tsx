"use client";

import React from "react";
import { useUrls } from "@/hooks/useUrls";
import { UrlFilter as FilterType } from "@/interfaces/url";
import UrlItem from "@/components/molecules/UrlItem";
import UrlFilter from "@/components/molecules/UrlFilter";
import Pagination from "@/components/molecules/Pagination";

/**
 * URL List Component
 * @description A component that displays a list of URLs with filtering and pagination
 */
const UrlList = () => {
  const {
    urls,
    isLoading,
    error,
    pagination,
    updateFilter,
    deleteUrl,
    updateUrlStatus,
    refreshUrls,
  } = useUrls();

  const handleFilterChange = (newFilter: Partial<FilterType>) => {
    updateFilter(newFilter);
  };

  const handlePageChange = (page: number) => {
    updateFilter({ page });
  };

  // Show loading state only when initially loading data
  if (isLoading && urls.length === 0) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading URLs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-semibold mb-2">Error loading URLs</h3>
        <p>{error.message}</p>
        <button
          onClick={() => refreshUrls()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Only show empty state when we're not loading and have no URLs
  if (!isLoading && urls.length === 0) {
    console.log("Rendering empty state - urls array is empty and not loading");
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <h3 className="font-semibold mb-2">No URLs Found</h3>
        <p className="text-gray-600">
          You haven&apos;t created any shortened URLs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UrlFilter
        filter={{
          page: pagination.page,
          limit: pagination.limit,
          sortBy: "created_at",
          sortOrder: "desc",
        }}
        onFilterChange={handleFilterChange}
      />

      <div>
        {urls.map((url) => (
          <UrlItem
            key={url.id}
            url={url}
            onDelete={deleteUrl}
            onToggleStatus={updateUrlStatus}
          />
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UrlList;
