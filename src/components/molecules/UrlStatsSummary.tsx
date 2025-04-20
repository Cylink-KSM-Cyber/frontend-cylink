import React from "react";
import { ExtendedDashboardStats } from "../../interfaces/url";
import StatCard from "../atoms/StatCard";

// Icon imports
import {
  RiLineChartLine,
  RiLink,
  RiPercentLine,
  RiStarSLine,
} from "react-icons/ri";
import { useUrlStats } from "@/hooks/useUrlStats";

/**
 * Prop types for StatsSummary component
 */
interface UrlStatsSummaryProps {
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
 * StatsSummary Component
 * @description Displays summary statistics for the dashboard in a grid of cards
 */
const UrlStatsSummary: React.FC<UrlStatsSummaryProps> = ({
  stats,
  isLoading = false,
  className = "",
}) => {
  const { urls } = useUrlStats();

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

  const avgClicksPerUrl =
    stats.totalClicksData?.avg_clicks_per_url ?? stats.averageClicksPerUrl;

  const clicksChangePercentage = stats.totalClicksData?.change_percentage;

  const formattedAvgClicks =
    typeof avgClicksPerUrl === "number" ? avgClicksPerUrl.toFixed(2) : "0.00";

  const totalClicksDisplay =
    typeof stats.totalClicks === "number"
      ? stats.totalClicks.toLocaleString()
      : "0";
  console.log(stats);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <StatCard
        title="Active URLs"
        value={stats.activeUrls}
        description="All time"
        type="active-urls"
        highlightedValue={{
          prefix: "Active",
          value: stats.activeUrls,
          suffix: " URLs",
        }}
        icon={<RiLink className="h-6 w-6" />}
      />

      <StatCard
        title="Total Clicks"
        value={totalClicksDisplay}
        description={`Avg. ${formattedAvgClicks} per URL`}
        trend={clicksChangePercentage} // This would come from the API in a real implementation
        type="total-clicks"
        icon={<RiLineChartLine className="h-6 w-6" />}
      />

      <StatCard
        title="Avg. CTR"
        value={Math.round(stats.totalClicks / stats.totalUrls)}
        description="Click-Through Rate Average Percentage"
        type="average-ctr"
        icon={<RiPercentLine className="h-6 w-6" />}
      />

      <StatCard
        title="Top Performing"
        value={`${urls[0]?.short_code}`}
        description={`Top Performing URL with ${
          stats.totalClicksData?.data?.top_performing_days[0]?.clicks ??
          stats.mostClickedUrl?.clicks
        } clicks`}
        type="top-performing"
        highlightedValue={{
          prefix: "Top Performing URL with",
          value:
            (stats.totalClicksData?.data?.top_performing_days[0]
              ?.clicks as number) ?? stats.mostClickedUrl?.clicks,
          suffix: " clicks",
        }}
        icon={<RiStarSLine className="h-6 w-6" />}
      />
    </div>
  );
};

export default UrlStatsSummary;
