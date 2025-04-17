import React, { useEffect, useState } from "react";
import "@/styles/statsSummary.css";

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
  /**
   * Optional type for styling
   */
  type?: "total-urls" | "total-clicks" | "qr-codes" | "conversion";
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
  type,
}) => {
  // State to track previous value for animation
  const [prevValue, setPrevValue] = useState<string | number>(value);
  const [animate, setAnimate] = useState(false);

  // Watch value changes to trigger animation
  useEffect(() => {
    if (prevValue !== value && prevValue !== 0) {
      setAnimate(true);

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 500);

      setPrevValue(value);
      return () => clearTimeout(timer);
    }

    setPrevValue(value);
  }, [value, prevValue]);

  // Determine trend color and icon
  const getTrendDisplay = () => {
    if (trend === undefined) return null;

    const isPositive = trend > 0;
    const isNegative = trend < 0;

    let trendColor = "text-[#607D8B]"; // Neutral color by default
    if (isPositive) {
      trendColor = "text-[#009688]";
    } else if (isNegative) {
      trendColor = "text-[#D32F2F]";
    }

    let trendIcon = "→"; // Neutral icon by default
    if (isPositive) {
      trendIcon = "↑";
    } else if (isNegative) {
      trendIcon = "↓";
    }

    return (
      <span className={`text-sm font-medium flex items-center ${trendColor}`}>
        {trendIcon} {Math.abs(trend).toFixed(1)}%
      </span>
    );
  };

  // Determine card type styling
  const cardTypeClass = type ? `stat-card-${type}` : "";

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm stat-card ${cardTypeClass} ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-[#333333] mb-1">{title}</h3>
          <p
            className={`text-2xl font-bold text-black mb-1 stat-value ${
              animate ? "number-change" : ""
            }`}
          >
            {value}
          </p>
          {description && (
            <p className="text-xs text-[#607D8B]">{description}</p>
          )}
          {getTrendDisplay()}
        </div>
        {icon && <div className="text-[#333333] stat-card-icon">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
