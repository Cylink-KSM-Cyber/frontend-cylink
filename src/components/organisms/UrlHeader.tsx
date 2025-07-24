import React from "react";

/**
 * Prop types for DashboardHeader component
 */
interface UrlHeaderProps {
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * DashboardHeader Component
 * @description Header section for the dashboard with welcome message, search, and create button
 */
const UrlHeader: React.FC<UrlHeaderProps & { "data-tour-id"?: string }> = ({
  className = "",
  "data-tour-id": dataTourId,
}) => {
  return (
    <div
      className={`py-6 ${className}`}
      {...(dataTourId ? { "data-tour-id": dataTourId } : {})}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-black">URL Management</h1>
          <p className="text-sm text-[#607D8B]">
            Manage all your shortened URLs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UrlHeader;
