import React from "react";
import { DashboardStats } from "@/interfaces/url";
import { RiUser3Line, RiCalendarLine, RiLineChartLine } from "react-icons/ri";

/**
 * Prop types for UserStatsCard component
 */
interface UserStatsCardProps {
  /**
   * User's display name
   */
  userName: string;
  /**
   * Dashboard statistics data
   */
  stats: DashboardStats;
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  /**
   * User join date
   */
  joinDate?: string;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * UserStatsCard Component
 * @description Displays user-specific statistics in a styled card layout
 */
const UserStatsCard: React.FC<UserStatsCardProps> = ({
  userName,
  stats,
  isLoading = false,
  joinDate,
  className = "",
}) => {
  // Format join date if provided
  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // If loading, show skeleton loading state
  if (isLoading) {
    return (
      <div
        className={`bg-white p-6 rounded-lg shadow-sm animate-pulse ${className}`}
      >
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-col">
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* User info section */}
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 mr-4">
          <RiUser3Line className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-black">{userName}</h2>
          <div className="flex items-center text-xs text-gray-500">
            <RiCalendarLine className="mr-1" />
            <span>Member since {formattedJoinDate}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">
            Active URLs
          </span>
          <span className="text-2xl font-bold text-black">
            {stats.activeUrls}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {stats.urlsCreatedToday} created today
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">
            Total Clicks
          </span>
          <span className="text-2xl font-bold text-black">
            {stats.totalClicks.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Avg. {stats.averageClicksPerUrl} per URL
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">
            Conversion Rate
          </span>
          <span className="text-2xl font-bold text-black">
            {stats.conversionRate}%
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Clicks to conversions
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">
            QR Codes
          </span>
          <span className="text-2xl font-bold text-black">
            {stats.qrCodesGenerated}
          </span>
          <span className="text-xs text-gray-500 mt-1">Generated</span>
        </div>
      </div>

      {/* Most clicked URL section */}
      {stats.mostClickedUrl && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Most Clicked URL
          </h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-black truncate max-w-[250px]">
                {stats.mostClickedUrl.shortUrl}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <RiLineChartLine className="mr-1" />
                {stats.mostClickedUrl.clicks} clicks
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate mt-1">
              {stats.mostClickedUrl.originalUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsCard;
