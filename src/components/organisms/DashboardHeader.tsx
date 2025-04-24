import React from "react";

/**
 * Prop types for DashboardHeader component
 */
interface DashboardHeaderProps {
  /**
   * User's display name
   */
  userName?: string;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * DashboardHeader Component
 * @description Header section for the dashboard with welcome message
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "User",
  className = "",
}) => {
  // Format the current date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className={`py-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Welcome, {userName}</h1>
          <p className="text-sm text-[#607D8B]">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
