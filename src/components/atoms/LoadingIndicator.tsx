import React from "react";

interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Color of the loading indicator
   * @default 'primary'
   */
  color?: "primary" | "secondary" | "white";

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LoadingIndicator Component
 * @description A component that displays a loading spinner
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  // Determine color classes
  const colorClasses = {
    primary: "border-t-[#607D8B]",
    secondary: "border-t-[#B0BEC5]",
    white: "border-t-white",
  }[color];

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClasses} ${colorClasses} rounded-full border-2 border-gray-200 animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingIndicator;
