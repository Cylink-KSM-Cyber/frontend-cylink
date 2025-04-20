import React from "react";
import { FiLink, FiBarChart2, FiClock, FiStar } from "react-icons/fi";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className="text-gray-600">{icon}</span>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-semibold">{value}</span>
      {trend && (
        <span
          className={`text-sm ${
            trend.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend}
        </span>
      )}
    </div>
  </div>
);

interface UrlStatsProps {
  activeUrls: number;
  totalClicks: number;
  avgCTR: string;
  topPerforming: string;
  activeUrlsTrend?: string;
}

const UrlStats: React.FC<UrlStatsProps> = ({
  activeUrls,
  totalClicks,
  avgCTR,
  topPerforming,
  activeUrlsTrend,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Active URLs"
        value={activeUrls}
        trend={activeUrlsTrend}
        icon={<FiLink className="w-5 h-5" />}
      />
      <StatsCard
        title="Total Clicks"
        value={totalClicks}
        icon={<FiBarChart2 className="w-5 h-5" />}
      />
      <StatsCard
        title="Avg. CTR"
        value={avgCTR}
        icon={<FiClock className="w-5 h-5" />}
      />
      <StatsCard
        title="Top Performing"
        value={topPerforming}
        icon={<FiStar className="w-5 h-5" />}
      />
    </div>
  );
};

export default UrlStats;
