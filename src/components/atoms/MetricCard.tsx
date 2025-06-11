import React from "react";
import { motion } from "framer-motion";
import { safeToFixed } from "@/utils/numberFormatting";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  changePercentage?: number;
  icon?: React.ReactNode;
  format?: "number" | "percentage" | "currency";
  loading?: boolean;
  className?: string;
}

/**
 * Metric Card Component
 * @description Displays a metric with title, value, and optional comparison data
 * @param title - The metric title
 * @param value - The current metric value
 * @param previousValue - Previous period value for comparison
 * @param changePercentage - Percentage change from previous period
 * @param icon - Optional icon to display
 * @param format - Value format type
 * @param loading - Loading state
 * @param className - Additional CSS classes
 * @returns React component
 */
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  changePercentage,
  icon,
  format = "number",
  loading = false,
  className = "",
}) => {
  /**
   * Format value based on type
   */
  const formatValue = (val: string | number): string => {
    if (loading) return "...";

    const numVal = typeof val === "string" ? parseFloat(val) : val;

    switch (format) {
      case "percentage":
        return `${safeToFixed(numVal, 2)}%`;
      case "currency":
        return `$${numVal.toLocaleString()}`;
      default:
        return numVal.toLocaleString();
    }
  };

  /**
   * Get change indicator styling
   */
  const getChangeStyle = () => {
    if (!changePercentage || changePercentage === 0) return "text-gray-500";
    return changePercentage > 0 ? "text-green-600" : "text-red-600";
  };

  /**
   * Get change indicator arrow
   */
  const getChangeArrow = () => {
    if (!changePercentage || changePercentage === 0) return null;
    return changePercentage > 0 ? "↗" : "↘";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && <div className="text-gray-400">{icon}</div>}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>

            {changePercentage !== undefined && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${getChangeStyle()}`}>
                  {getChangeArrow()}{" "}
                  {safeToFixed(Math.abs(changePercentage), 1)}%
                </span>
                {previousValue && (
                  <span className="text-xs text-gray-500">
                    vs {formatValue(previousValue)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
