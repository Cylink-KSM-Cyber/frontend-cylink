import React from "react";

/**
 * Prop types for StatCard component
 */
interface StatCardProps {
  /**
   * Title of the stat card
   */
  title: string;
  /**
   * Value to display
   */
  value: string | number;
  /**
   * Optional description or secondary text
   */
  description?: string;
  /**
   * Optional trend value to display (e.g. +12.5%)
   */
  trend?: number;
  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * StatCard Component
 * @description Displays a single statistic in a card format
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className = "",
}) => {
  // Determine trend color and icon
  const getTrendDisplay = () => {
    if (trend === undefined) return null;

    const isPositive = trend > 0;
    const trendColor = isPositive
      ? "text-[#009688]"
      : trend < 0
      ? "text-[#D32F2F]"
      : "text-[#607D8B]";
    const trendIcon = isPositive ? "↑" : trend < 0 ? "↓" : "→";

    return (
      <span className={`text-sm font-medium flex items-center ${trendColor}`}>
        {trendIcon} {Math.abs(trend).toFixed(1)}%
      </span>
    );
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-[#333333] mb-1">{title}</h3>
          <p className="text-2xl font-bold text-black mb-1">{value}</p>
          {description && (
            <p className="text-xs text-[#607D8B]">{description}</p>
          )}
          {getTrendDisplay()}
        </div>
        {icon && <div className="text-[#333333]">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
