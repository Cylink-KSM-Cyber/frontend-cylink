"use client";

import React from "react";
import { RiFilter2Line, RiListCheck2 } from "react-icons/ri";

/**
 * Filter options interface
 */
export interface FilterOptions {
  status?: string;
  limit?: number;
  // You can add more filter types here in the future
}

/**
 * Props for the UrlFilter component
 */
interface UrlFilterProps {
  /**
   * Current filter options
   */
  filters: FilterOptions;
  /**
   * Function to call when any filter changes
   */
  onFilterChange: (
    filterType: keyof FilterOptions,
    value: string | number
  ) => void;
}

/**
 * URL Filter Component
 * @description A component that provides filtering and sorting controls for URLs with enhanced styling
 */
const UrlFilter: React.FC<UrlFilterProps> = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange("status", value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    onFilterChange("limit", value);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Status Filter */}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-blue-500">
          <RiFilter2Line className="w-5 h-5" />
        </div>
        <select
          value={filters.status || "all"}
          onChange={handleStatusChange}
          className="bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 cursor-pointer transition-all duration-200 appearance-none"
        >
          <option value="all" className="py-1">
            All Status
          </option>
          <option value="active" className="text-green-600 py-1">
            Active
          </option>
          <option value="expired" className="text-red-600 py-1">
            Expired
          </option>
          <option value="inactive" className="text-gray-600 py-1">
            Inactive
          </option>
        </select>
        <div className="absolute right-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Limit Filter */}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-purple-500">
          <RiListCheck2 className="w-5 h-5" />
        </div>
        <select
          value={filters.limit || 10}
          onChange={handleLimitChange}
          className="bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm shadow-sm hover:border-purple-400 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 cursor-pointer transition-all duration-200 appearance-none"
        >
          <option value={5} className="py-1">
            5 per page
          </option>
          <option value={10} className="py-1">
            10 per page
          </option>
          <option value={25} className="py-1">
            25 per page
          </option>
          <option value={50} className="py-1">
            50 per page
          </option>
          <option value={100} className="py-1">
            100 per page
          </option>
        </select>
        <div className="absolute right-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UrlFilter;
