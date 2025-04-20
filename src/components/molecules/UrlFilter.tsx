import React from "react";
import { UrlFilter as FilterInterface } from "@/interfaces/url";
import { RiFilter2Line } from "react-icons/ri";

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
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const validValue = ["active", "expired", "inactive", "all"].includes(value)
      ? (value as FilterInterface["status"])
      : "all";

    onFilterChange({ status: validValue });
  };

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
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E0E0E0] p-2">
        <RiFilter2Line className="text-[#607D8B]" />
        <select
          value={filter.status || "all"}
          onChange={handleStatusChange}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E0E0E0] p-2">
        <select
          value={filter.sortBy || "created_at"}
          onChange={handleSortByChange}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
        >
          <option value="created_at">Created Date</option>
          <option value="clicks">Clicks</option>
          <option value="title">Title</option>
        </select>

        <select
          value={filter.sortOrder || "desc"}
          onChange={handleSortOrderChange}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E0E0E0] p-2">
        <select
          value={filter.limit || 10}
          onChange={handleLimitChange}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default UrlFilter;
