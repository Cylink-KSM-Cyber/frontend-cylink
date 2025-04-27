import React from "react";
import { KpiCardData } from "@/interfaces/dashboard";

/**
 * KPI Card Component
 * Displays a key performance indicator with trend information
 */
const KpiCard: React.FC<KpiCardData> = ({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  isLoading = false,
  isError = false,
  color = "blue",
}) => {
  // Determine arrow direction and color based on trend value
  const getTrendArrow = () => {
    if (trend === undefined || trend === 0) return null;

    const isPositive = trend > 0;
    return (
      <span
        className={`inline-flex items-center text-sm font-medium ml-1 ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <svg
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {Math.abs(trend).toFixed(1)}%
      </span>
    );
  };

  // Loading state skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-2.5"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded-full w-32 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded-full w-16"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-red-200 h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">{title}</div>
          {Icon && <Icon className="w-6 h-6 text-red-500" />}
        </div>
        <div className="text-red-500 font-medium">Failed to load data</div>
        <div className="text-xs text-gray-400 mt-1">Please try again later</div>
      </div>
    );
  }

  // Colors based on the color prop
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
  };

  const iconColorClass =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        {Icon && <Icon className={`w-5 h-5 ${iconColorClass}`} />}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center text-xs text-gray-500">
        {trendLabel && (
          <>
            <span>{trendLabel}</span>
            {getTrendArrow()}
          </>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
