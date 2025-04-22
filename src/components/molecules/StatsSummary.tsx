import React from "react";
import StatCard from "../atoms/StatCard";
import { ExtendedDashboardStats } from "../../interfaces/url";

// Icon imports
import {
  RiLink,
  RiLineChartLine,
  RiQrCodeLine,
  RiPercentLine,
} from "react-icons/ri";

/**
 * Prop types for StatsSummary component
 */
interface StatsSummaryProps {
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
const StatsSummary: React.FC<StatsSummaryProps> = ({
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

  // Get the average clicks per URL and change percentage from total clicks data
  const avgClicksPerUrl =
    stats.totalClicksData?.avg_clicks_per_url ?? stats.averageClicksPerUrl;
  const clicksChangePercentage = stats.totalClicksData?.change_percentage;

  // Get conversion data if available
  const conversionChangePercentage = stats.conversionData?.changePercentage;
  const totalConversions = stats.conversionData?.totalConversions;
  const topClicksCount =
    stats.conversionData?.topClicksCount ?? stats.mostClickedUrl?.clicks;

  // Ensure avgClicksPerUrl is properly formatted as a number
  const formattedAvgClicks =
    typeof avgClicksPerUrl === "number" ? avgClicksPerUrl.toFixed(2) : "0.00";

  // Format totalClicks for display
  const totalClicksDisplay =
    typeof stats.totalClicks === "number"
      ? stats.totalClicks.toLocaleString()
      : "0";

  // Use QR codes created today or fallback to urlsCreatedToday
  const qrCodesCreatedToday =
    stats.qrCodesCreatedToday ?? stats.urlsCreatedToday;

  // Log values for debugging only in development
  if (process.env.NODE_ENV === "development") {
    console.log(
      "StatsSummary - avgClicksPerUrl:",
      avgClicksPerUrl,
      "type:",
      typeof avgClicksPerUrl
    );
    console.log("StatsSummary - formattedAvgClicks:", formattedAvgClicks);
    console.log(
      "StatsSummary - totalClicks:",
      stats.totalClicks,
      "type:",
      typeof stats.totalClicks
    );
    console.log(
      "StatsSummary - clicksChangePercentage:",
      clicksChangePercentage
    );
    console.log(
      "StatsSummary - conversionChangePercentage:",
      conversionChangePercentage
    );
    console.log("StatsSummary - topClicksCount:", topClicksCount);
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      <StatCard
        title="Total URLs"
        value={stats.totalUrls}
        description="All time"
        icon={<RiLink className="h-6 w-6" />}
        type="total-urls"
        highlightedValue={{
          prefix: "Active",
          value: stats.activeUrls,
          suffix: " URLs",
        }}
      />

      <StatCard
        title="Total Clicks"
        value={totalClicksDisplay}
        description={`Avg. ${formattedAvgClicks} per URL`}
        trend={clicksChangePercentage}
        icon={<RiLineChartLine className="h-6 w-6" />}
        type="total-clicks"
      />

      <StatCard
        title="QR Codes"
        value={stats.qrCodesGenerated}
        description="Generated"
        icon={<RiQrCodeLine className="h-6 w-6" />}
        type="qr-codes"
        highlightedValue={{
          prefix: "Today",
          value: qrCodesCreatedToday,
          suffix: " new",
        }}
      />

      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        description={
          totalConversions
            ? `${totalConversions} conversions`
            : "Clicks to conversions"
        }
        trend={
          conversionChangePercentage !== undefined
            ? conversionChangePercentage
            : 2.5
        }
        icon={<RiPercentLine className="h-6 w-6" />}
        type="conversion"
        highlightedValue={{
          prefix: "Top",
          value: topClicksCount || 0,
          suffix: " clicks",
        }}
      />
    </div>
  );
};

export default StatsSummary;
