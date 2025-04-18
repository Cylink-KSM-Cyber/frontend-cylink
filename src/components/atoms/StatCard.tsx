import React, { useEffect, useState } from "react";
import "@/styles/statsSummary.css";
import "@/styles/totalClicks.css";

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

    // Ensure trend is a number
    const trendValue =
      typeof trend === "number" ? trend : parseFloat(trend as string) || 0;

    // Log trend value for debugging
    console.log(
      "StatCard - rendering trend:",
      trendValue,
      "original:",
      trend,
      "type:",
      typeof trend
    );

    const isPositive = trendValue > 0;
    const isNegative = trendValue < 0;

    let trendClass = "trend-indicator trend-indicator-neutral";
    if (isPositive) {
      trendClass = "trend-indicator trend-indicator-positive";
    } else if (isNegative) {
      trendClass = "trend-indicator trend-indicator-negative";
    }

    let trendIcon = "→"; // Neutral icon by default
    if (isPositive) {
      trendIcon = "↑";
    } else if (isNegative) {
      trendIcon = "↓";
    }

    // Create tooltip text
    let tooltipText = "No change from previous period";
    if (isPositive) {
      tooltipText = "Increase from previous period";
    } else if (isNegative) {
      tooltipText = "Decrease from previous period";
    }

    return (
      <span className={`tooltip ${trendClass}`}>
        {trendIcon} {Math.abs(trendValue).toFixed(1)}%
        <span className="tooltip-text">{tooltipText}</span>
      </span>
    );
  };

  // Format the description to highlight the average clicks per URL
  const formattedDescription = () => {
    if (!description || !type || type !== "total-clicks") {
      return description;
    }

    // Check if the description contains "Avg." - if so, parse and format
    if (description.includes("Avg.")) {
      const parts = description.split("Avg.");
      const avgValue = parts[1].trim().split(" ")[0];
      const rest = parts[1].trim().substring(avgValue.length);

      // Check if avgValue is a valid number
      const isValidNumber = !isNaN(parseFloat(avgValue));

      return (
        <>
          Avg.{" "}
          <span className="avg-clicks font-medium text-emerald-600">
            {isValidNumber ? avgValue : "0.00"}
          </span>
          {rest}
        </>
      );
    }

    return description;
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
            <p className="text-xs text-[#607D8B]">{formattedDescription()}</p>
          )}
          {getTrendDisplay()}
        </div>
        {icon && <div className="text-[#333333] stat-card-icon">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
