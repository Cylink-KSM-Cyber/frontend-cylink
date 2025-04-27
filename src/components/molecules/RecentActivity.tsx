import React from "react";
import { RecentActivityItem } from "@/interfaces/dashboard";
import { RiLink, RiQrCodeLine, RiBarChartLine } from "react-icons/ri";

interface RecentActivityProps {
  items: RecentActivityItem[];
  isLoading: boolean;
  isError: boolean;
  className?: string;
}

/**
 * RecentActivity Component
 * Displays a timeline of recent URL-related activities
 */
const RecentActivity: React.FC<RecentActivityProps> = ({
  items,
  isLoading,
  isError,
  className = "",
}) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    }
  };

  // Get icon based on activity type
  const getActivityIcon = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "url_created":
        return <RiLink className="w-5 h-5 text-blue-500" />;
      case "url_clicked":
        return <RiBarChartLine className="w-5 h-5 text-green-500" />;
      case "qr_generated":
        return <RiQrCodeLine className="w-5 h-5 text-purple-500" />;
      default:
        return <RiLink className="w-5 h-5 text-gray-500" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex">
              <div className="mr-3 w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-2.5 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="flex items-center justify-center h-48 text-red-500">
          <p>Failed to load activity data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p>No recent activity.</p>
          <p className="text-sm mt-2">
            Create and share URLs to see activity here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex">
            <div className="mr-3 mt-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                {getActivityIcon(item.type)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm">{item.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
