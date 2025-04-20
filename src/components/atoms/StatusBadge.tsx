import React from "react";

/**
 * Prop types for StatusBadge component
 */
interface StatusBadgeProps {
  /**
   * Status value to display
   */
  status: "active" | "expired" | "inactive";
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * StatusBadge Component
 * @description Displays a status indicator badge with appropriate styling based on status
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  // Determine badge styling based on status
  const getBadgeClasses = () => {
    switch (status) {
      case "active":
        return "bg-[#E8F5E9] text-[#388E3C]";
      case "expired":
        return "bg-[#FFEBEE] text-[#D32F2F]";
      case "inactive":
        return "bg-[#ECEFF1] text-[#607D8B]";
      default:
        return "bg-[#E0E0E0] text-[#333333]";
    }
  };

  // Get display text for status
  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expired";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeClasses()} ${className}`}
    >
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;
