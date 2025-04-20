import React from "react";
// import { UrlStats } from "../../interfaces/url";
import URLStatsCard from "@/components/molecules/URLStatsCard";
import { ExtendedDashboardStats } from "@/interfaces/url";

/**
 * Prop types for URLStatsSummary component
 */
interface URLStatsSummaryProps {
  /**
   * Dashboard statistics data
   */
  stats: ExtendedDashboardStats;
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * URLStatsSummary Component
 * @description Displays summary statistics for the dashboard in a grid of cards
 */
const URLStatsSummary: React.FC<URLStatsSummaryProps> = ({
  stats,
  isLoading = false,
  className = "",
}) => {
  // If loading, show skeleton cards
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <URLStatsCard
        activeURLs={stats.activeUrls}
        totalClicks={stats.totalClicks}
      />
    </div>
  );
};

export default URLStatsSummary;
