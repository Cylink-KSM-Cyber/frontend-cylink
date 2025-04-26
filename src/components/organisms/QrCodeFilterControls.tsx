import React, { useState, useRef, useEffect } from "react";
import { QrCodeFilter } from "@/interfaces/qrcode";
import { RiFilterLine, RiArrowUpDownLine, RiCloseLine } from "react-icons/ri";

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

  // Track dropdown states
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Refs for click outside handling
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

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
    { label: "Title (A-Z)", value: "title", order: "asc" as const },
    { label: "Title (Z-A)", value: "title", order: "desc" as const },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle filter dropdown
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById("filter-menu-button")
      ) {
        setFilterDropdownOpen(false);
      }

      // Handle sort dropdown
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node) &&
        event.target !== document.getElementById("sort-menu-button")
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sort change
  const handleSortChange = (option: {
    label: string;
    value: string;
    order: "asc" | "desc";
  }) => {
    setSortOption(option);
    onSortChange(option.value, option.order);
    setSortDropdownOpen(false);
  };

  // Handle logo filter change
  const handleLogoFilterChange = (value: boolean | undefined) => {
    setIncludeLogo(value);
    onFilterChange({ includeLogo: value });
  };

  // Reset all filters
  const resetFilters = () => {
    setIncludeLogo(undefined);
    onFilterChange({ includeLogo: undefined });
    setFilterDropdownOpen(false);
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Filter Section */}
      <div className="flex-shrink-0">
        <div className="relative inline-block text-left">
          <button
            type="button"
            id="filter-menu-button"
            className={`inline-flex justify-center items-center rounded-md border ${
              includeLogo !== undefined
                ? "border-primary-300 bg-primary-50"
                : "border-gray-300 bg-white"
            } shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            aria-expanded={filterDropdownOpen}
            aria-haspopup="true"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <RiFilterLine className="mr-2 h-5 w-5" aria-hidden="true" />
            Filters
            {includeLogo !== undefined && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                1
              </span>
            )}
          </button>

          {/* Filter Dropdown - Redesigned */}
          {filterDropdownOpen && (
            <div
              ref={filterDropdownRef}
              className="absolute left-0 mt-3 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="filter-menu-button"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    Reset All
                  </button>
                </div>

                {/* Logo Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </h4>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={includeLogo === true}
                        onChange={() =>
                          handleLogoFilterChange(
                            includeLogo === true ? undefined : true
                          )
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span>With Logo</span>
                    </label>

                    <label className="flex items-center space-x-2 text-sm ml-4">
                      <input
                        type="checkbox"
                        checked={includeLogo === false}
                        onChange={() =>
                          handleLogoFilterChange(
                            includeLogo === false ? undefined : false
                          )
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span>Without Logo</span>
                    </label>
                  </div>
                </div>

                {/* Apply/Reset Buttons */}
                <div className="flex justify-end pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-900"
                    onClick={() => setFilterDropdownOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sort Section */}
      <div className="flex-shrink-0">
        <div className="relative inline-block text-left">
          <button
            type="button"
            id="sort-menu-button"
            className="inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-expanded={sortDropdownOpen}
            aria-haspopup="true"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <RiArrowUpDownLine className="mr-2 h-5 w-5" aria-hidden="true" />
            {sortOption.label}
          </button>

          {/* Sort Dropdown - Redesigned */}
          {sortDropdownOpen && (
            <div
              ref={sortDropdownRef}
              className="absolute right-0 mt-3 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="sort-menu-button"
            >
              <div className="py-1" role="none">
                <div className="px-3 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Sort By</h3>
                </div>
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value}-${option.order}`}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      sortOption.value === option.value &&
                      sortOption.order === option.order
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    role="menuitem"
                    onClick={() => handleSortChange(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {includeLogo !== undefined && (
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-800 border border-primary-200">
            {includeLogo ? "With Logo" : "Without Logo"}
            <button
              className="ml-2 text-primary-500 hover:text-primary-700"
              onClick={() => handleLogoFilterChange(undefined)}
              aria-label="Remove filter"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeFilterControls;
