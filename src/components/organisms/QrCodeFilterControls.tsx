import React, { useState } from "react";
import { QrCodeFilter } from "@/interfaces/qrcode";
import { RiFilterLine, RiArrowUpDownLine } from "react-icons/ri";

/**
 * Props for QrCodeFilterControls component
 */
interface QrCodeFilterControlsProps {
  /**
   * Function to call when filter changes
   */
  onFilterChange: (filter: Partial<QrCodeFilter>) => void;
  /**
   * Function to call when sort changes
   */
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * QrCodeFilterControls Component
 * @description Provides UI for filtering and sorting QR codes
 */
const QrCodeFilterControls: React.FC<QrCodeFilterControlsProps> = ({
  onFilterChange,
  onSortChange,
  className = "",
}) => {
  // Track active filters
  const [includeLogo, setIncludeLogo] = useState<boolean | undefined>(
    undefined
  );

  // Track active sort
  const [sortOption, setSortOption] = useState<{
    label: string;
    value: string;
    order: "asc" | "desc";
  }>({
    label: "Newest First",
    value: "created_at",
    order: "desc",
  });

  // Available sort options
  const sortOptions = [
    { label: "Newest First", value: "created_at", order: "desc" as const },
    { label: "Oldest First", value: "created_at", order: "asc" as const },
    { label: "Most Scans", value: "clicks", order: "desc" as const },
    { label: "Least Scans", value: "clicks", order: "asc" as const },
    { label: "Title (A-Z)", value: "title", order: "asc" as const },
    { label: "Title (Z-A)", value: "title", order: "desc" as const },
  ];

  // Handle sort change
  const handleSortChange = (option: {
    label: string;
    value: string;
    order: "asc" | "desc";
  }) => {
    setSortOption(option);
    onSortChange(option.value, option.order);
  };

  // Handle logo filter change
  const handleLogoFilterChange = (value: boolean | undefined) => {
    setIncludeLogo(value);
    onFilterChange({ includeLogo: value });
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Filter Section */}
      <div className="flex-shrink-0">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              id="filter-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => {
                const menu = document.getElementById("filter-dropdown");
                if (menu) {
                  menu.classList.toggle("hidden");
                }
              }}
            >
              <RiFilterLine className="mr-2 h-5 w-5" aria-hidden="true" />
              Filters
              {includeLogo !== undefined && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdown */}
          <div
            id="filter-dropdown"
            className="hidden origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="filter-menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              {/* Logo Filter */}
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-700">Logo</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className={`px-3 py-1 rounded-full text-xs ${
                      includeLogo === true
                        ? "bg-primary-100 text-primary-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() =>
                      handleLogoFilterChange(
                        includeLogo === true ? undefined : true
                      )
                    }
                  >
                    With Logo
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs ${
                      includeLogo === false
                        ? "bg-primary-100 text-primary-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() =>
                      handleLogoFilterChange(
                        includeLogo === false ? undefined : false
                      )
                    }
                  >
                    Without Logo
                  </button>
                </div>
              </div>

              {/* Reset Filters Button */}
              <div className="px-4 py-2">
                <button
                  className="text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => {
                    setIncludeLogo(undefined);
                    onFilterChange({ includeLogo: undefined });
                    // Close dropdown
                    const menu = document.getElementById("filter-dropdown");
                    if (menu) {
                      menu.classList.add("hidden");
                    }
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex-shrink-0">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              id="sort-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => {
                const menu = document.getElementById("sort-dropdown");
                if (menu) {
                  menu.classList.toggle("hidden");
                }
              }}
            >
              <RiArrowUpDownLine className="mr-2 h-5 w-5" aria-hidden="true" />
              {sortOption.label}
            </button>
          </div>

          {/* Sort Dropdown */}
          <div
            id="sort-dropdown"
            className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="sort-menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              {sortOptions.map((option) => (
                <button
                  key={`${option.value}-${option.order}`}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    sortOption.value === option.value &&
                    sortOption.order === option.order
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    handleSortChange(option);
                    // Close dropdown
                    const menu = document.getElementById("sort-dropdown");
                    if (menu) {
                      menu.classList.add("hidden");
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {includeLogo !== undefined && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
            {includeLogo ? "With Logo" : "Without Logo"}
            <button
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleLogoFilterChange(undefined)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeFilterControls;
