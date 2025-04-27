import React from "react";
import { TimePeriod } from "@/interfaces/dashboard";

interface DashboardHeaderProps {
  title?: string;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * DashboardHeader Component
 * Header for the dashboard with title, time period selector and refresh button
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Analytics Dashboard",
  className = "",
}) => {
  return (
    <header className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default DashboardHeader;
