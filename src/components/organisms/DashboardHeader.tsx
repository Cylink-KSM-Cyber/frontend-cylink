import React from "react";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/SearchInput";
import { RiAddLine } from "react-icons/ri";

/**
 * Prop types for DashboardHeader component
 */
interface DashboardHeaderProps {
  /**
   * User's display name
   */
  userName?: string;
  /**
   * Function to call when search input changes
   */
  onSearch?: (value: string) => void;
  /**
   * Function to call when create button is clicked
   */
  onCreateClick?: () => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * DashboardHeader Component
 * @description Header section for the dashboard with welcome message, search, and create button
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "User",
  onSearch,
  onCreateClick,
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
    <div className={`py-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-black">Welcome, {userName}</h1>
          <p className="text-sm text-[#607D8B]">{formattedDate}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {onSearch && (
            <div className="w-full sm:w-auto">
              <SearchInput placeholder="Search URLs..." onSearch={onSearch} />
            </div>
          )}

          {onCreateClick && (
            <Button
              variant="primary"
              onClick={onCreateClick}
              startIcon={<RiAddLine className="h-4 w-4" />}
            >
              Create New URL
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
