import React from "react";
import { UrlFilter as FilterInterface } from "@/interfaces/url";

/**
 * Props for the UrlFilter component
 */
interface UrlFilterProps {
  filter: FilterInterface;
  onFilterChange: (newFilter: Partial<FilterInterface>) => void;
}

/**
 * URL Filter Component
 * @description A component that provides filtering and sorting controls for URLs
 */
const UrlFilter = ({ filter, onFilterChange }: UrlFilterProps) => {
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const validValue = ["created_at", "clicks", "title"].includes(value)
      ? (value as FilterInterface["sortBy"])
      : "created_at";

    onFilterChange({ sortBy: validValue });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const validValue = ["asc", "desc"].includes(value)
      ? (value as FilterInterface["sortOrder"])
      : "desc";

    onFilterChange({ sortOrder: validValue });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ limit: Number(e.target.value), page: 1 });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label
          htmlFor="sortBy"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort By
        </label>
        <select
          id="sortBy"
          value={filter.sortBy || "created_at"}
          onChange={handleSortByChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
        >
          <option value="created_at">Created Date</option>
          <option value="clicks">Clicks</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="sortOrder"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort Order
        </label>
        <select
          id="sortOrder"
          value={filter.sortOrder || "desc"}
          onChange={handleSortOrderChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="limit"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Items Per Page
        </label>
        <select
          id="limit"
          value={filter.limit}
          onChange={handleLimitChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default UrlFilter;
