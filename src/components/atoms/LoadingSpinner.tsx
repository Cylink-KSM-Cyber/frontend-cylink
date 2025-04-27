import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

/**
 * Loading Spinner Component
 * Displays an animated loading spinner with customizable size and color
 *
 * @param size - Size of the spinner (small, medium, large)
 * @param color - Color of the spinner
 * @param className - Additional CSS classes
 * @returns React component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "text-blue-600",
  className = "",
}) => {
  // Determine size class
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }[size];

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClass} ${color} animate-spin rounded-full border-2 border-t-transparent`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
