import React from "react";
import { RiRefreshLine } from "react-icons/ri";
import TimePeriodSelector from "@/components/atoms/TimePeriodSelector";
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
  timePeriod,
  onTimePeriodChange,
  onRefresh,
  isRefreshing = false,
  className = "",
}) => {
  return (
    <header className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          {title}
        </h1>

        <div className="flex items-center space-x-3">
          <TimePeriodSelector
            selected={timePeriod}
            onChange={onTimePeriodChange}
          />

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            title="Refresh data"
          >
            <RiRefreshLine
              className={`w-5 h-5 ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
