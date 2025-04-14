import React from "react";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";

/**
 * Props for SidebarToggle component
 */
interface SidebarToggleProps {
  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed: boolean;

  /**
   * Function to toggle sidebar collapsed state
   */
  onToggle: () => void;

  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * SidebarToggle Component
 * @description Toggle button for expanding/collapsing the sidebar
 */
const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
  className = "",
}) => {
  return (
    <button
      id="sidebar-toggle"
      onClick={onToggle}
      className={`
        p-2 rounded-full transition-colors duration-200
        text-[#333333] hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-black
        ${className}
      `}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <RiMenuUnfoldLine className="w-5 h-5" />
      ) : (
        <RiMenuFoldLine className="w-5 h-5" />
      )}
    </button>
  );
};

export default SidebarToggle;
