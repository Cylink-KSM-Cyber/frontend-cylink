"use client";

import React from "react";

interface URLStatsCardProps {
  activeURLs: number;
  totalClicks?: number;
  avgCTR?: number;
  topPerforming?: string;
  timeFrame?: string;
}

const URLStatsCard: React.FC<URLStatsCardProps> = ({
  activeURLs,
  totalClicks,
  avgCTR,
  topPerforming,
  timeFrame = "this week",
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {/* Active URLs */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-600 text-sm font-medium">Active URLs</h3>
          <div className="w-4 h-4 rounded-full bg-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full m-1"></div>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{activeURLs}</span>
          <p className="text-xs text-gray-500 mt-1">↑ 12% {timeFrame}</p>
        </div>
      </div>

      {/* Total Clicks */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-600 text-sm font-medium">Total Clicks</h3>
          <div className="w-4 h-4 rounded-full bg-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full m-1"></div>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{totalClicks || 0}</span>
          <p className="text-xs text-gray-500 mt-1">↑ 8% {timeFrame}</p>
        </div>
      </div>

      {/* Average CTR */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-600 text-sm font-medium">Avg. CTR</h3>
          <div className="w-4 h-4 rounded-full bg-purple-100">
            <div className="w-2 h-2 bg-purple-500 rounded-full m-1"></div>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{avgCTR || "0%"}</span>
          <p className="text-xs text-gray-500 mt-1">↓ 3% {timeFrame}</p>
        </div>
      </div>

      {/* Top Performing */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-600 text-sm font-medium">Top Performing</h3>
          <div className="w-4 h-4 rounded-full bg-yellow-100">
            <div className="w-2 h-2 bg-yellow-500 rounded-full m-1"></div>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-lg font-medium text-blue-600 truncate block">
            {topPerforming || "No data"}
          </span>
          <p className="text-xs text-gray-500 mt-1">42k clicks</p>
        </div>
      </div>
    </div>
  );
};

export default URLStatsCard;
