import React, { useState } from "react";
import { TimePeriod } from "@/interfaces/dashboard";

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
  className?: string;
}

/**
 * TimePeriodSelector Component
 * Allows users to select a time period for dashboard data
 */
const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selected,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (period: TimePeriod) => {
    onChange(period);
    setIsOpen(false);
  };

  const formatLabel = (period: TimePeriod) => {
    switch (period) {
      case "7":
        return "Last 7 days";
      case "14":
        return "Last 14 days";
      case "30":
        return "Last 30 days";
      case "90":
        return "Last 90 days";
      case "custom":
        return "Custom range";
      default:
        return "Select period";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{formatLabel(selected)}</span>
        <svg
          className={`w-5 h-5 ml-2 -mr-1 text-gray-400 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul
            className="max-h-60 py-1 overflow-auto text-base rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            tabIndex={-1}
            role="listbox"
            aria-labelledby="options-menu"
          >
            {(["7", "14", "30", "90"] as TimePeriod[]).map((period) => (
              <li
                key={period}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                  period === selected
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-900"
                }`}
                onClick={() => handleSelect(period)}
                role="option"
                aria-selected={period === selected}
              >
                <span className="block truncate">{formatLabel(period)}</span>
                {period === selected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
            <li
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                "custom" === selected
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-900"
              }`}
              onClick={() => handleSelect("custom")}
              role="option"
              aria-selected={"custom" === selected}
            >
              <span className="block truncate">Custom range</span>
              {"custom" === selected && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimePeriodSelector;
