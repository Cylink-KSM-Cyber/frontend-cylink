import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  comparison?: "7" | "14" | "30" | "90" | "custom";
  onDateChange: (startDate: string, endDate: string) => void;
  onComparisonChange: (comparison: "7" | "14" | "30" | "90" | "custom") => void;
  customComparisonStart?: string;
  customComparisonEnd?: string;
  onCustomComparisonChange?: (start: string, end: string) => void;
  className?: string;
}

const comparisonOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "custom", label: "Custom range" },
] as const;

/**
 * Date Range Picker Component
 * @description Provides date range selection with comparison periods
 * @param startDate - Start date in ISO format
 * @param endDate - End date in ISO format
 * @param comparison - Comparison period option
 * @param onDateChange - Callback for date range changes
 * @param onComparisonChange - Callback for comparison period changes
 * @param customComparisonStart - Custom comparison start date
 * @param customComparisonEnd - Custom comparison end date
 * @param onCustomComparisonChange - Callback for custom comparison changes
 * @param className - Additional CSS classes
 * @returns React component
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  comparison,
  onDateChange,
  onComparisonChange,
  customComparisonStart,
  customComparisonEnd,
  onCustomComparisonChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Format date for display
   */
  const formatDate = useCallback((date: string): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  /**
   * Get today's date in ISO format
   */
  const getTodayISO = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  /**
   * Get date N days ago in ISO format
   */
  const getDaysAgoISO = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split("T")[0];
  };

  /**
   * Handle preset period selection
   */
  const handlePresetSelect = useCallback(
    (period: "7" | "14" | "30" | "90") => {
      const end = getTodayISO();
      const start = getDaysAgoISO(parseInt(period));
      onDateChange(start, end);
      onComparisonChange(period);
      setIsOpen(false);
    },
    [onDateChange, onComparisonChange]
  );

  /**
   * Handle custom date range
   */
  const handleCustomRange = useCallback(() => {
    onComparisonChange("custom");
    // Don't close dropdown, let user select dates first
    // If no dates are set, provide default 30-day range
    if (!startDate || !endDate) {
      const end = getTodayISO();
      const start = getDaysAgoISO(30);
      onDateChange(start, end);
    }
  }, [onComparisonChange, onDateChange, startDate, endDate]);

  /**
   * Get display text for current selection
   */
  const getDisplayText = (): string => {
    if (startDate && endDate) {
      if (comparison === "custom") {
        return `${formatDate(startDate)} - ${formatDate(endDate)} (Custom)`;
      }
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    if (comparison && comparison !== "custom") {
      const option = comparisonOptions.find((opt) => opt.value === comparison);
      return option?.label ?? "Select period";
    }
    if (comparison === "custom") {
      return "Custom range - Select dates";
    }
    return "Select date range";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Date Range Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <span>{getDisplayText()}</span>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          <div className="p-2">
            {/* Preset Options */}
            <div className="space-y-1 mb-3">
              {comparisonOptions.slice(0, -1).map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handlePresetSelect(option.value as "7" | "14" | "30" | "90")
                  }
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    comparison === option.value
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={handleCustomRange}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  comparison === "custom"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                Custom range
              </button>

              {/* Custom Date Inputs */}
              {comparison === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate ?? ""}
                      onChange={(e) => {
                        onDateChange(e.target.value, endDate ?? "");
                        // Close dropdown if both dates are now selected
                        if (e.target.value && endDate) {
                          setIsOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate ?? ""}
                      onChange={(e) => {
                        onDateChange(startDate ?? "", e.target.value);
                        // Close dropdown if both dates are now selected
                        if (startDate && e.target.value) {
                          setIsOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Custom Comparison Period */}
                  {onCustomComparisonChange && (
                    <div className="border-t border-gray-200 pt-2 mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Comparison Period
                      </p>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Comparison Start
                          </label>
                          <input
                            type="date"
                            value={customComparisonStart ?? ""}
                            onChange={(e) =>
                              onCustomComparisonChange(
                                e.target.value,
                                customComparisonEnd ?? ""
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Comparison End
                          </label>
                          <input
                            type="date"
                            value={customComparisonEnd ?? ""}
                            onChange={(e) =>
                              onCustomComparisonChange(
                                customComparisonStart ?? "",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setIsOpen(false)}
          aria-label="Close dropdown"
        />
      )}
    </div>
  );
};

export default DateRangePicker;
