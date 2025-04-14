import React from "react";
import Link from "next/link";
import { NavItem } from "@/interfaces/sidebar";

/**
 * Props for SidebarNavItem component
 */
interface SidebarNavItemProps {
  /**
   * Navigation item data
   */
  item: NavItem;

  /**
   * Whether the item is active
   */
  isActive: boolean;

  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed: boolean;

  /**
   * Click handler for the item
   */
  onClick?: () => void;
}

/**
 * SidebarNavItem Component
 * @description Renders a navigation item in the sidebar
 */
const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const { label, path, icon, badge } = item;

  return (
    <Link
      href={path}
      onClick={onClick}
      className={`
        flex items-center gap-x-3 py-2 px-3 my-1 rounded-md
        transition-all duration-200 cursor-pointer group
        ${
          isActive
            ? "bg-gray-100 text-black font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-black"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="flex items-center justify-center w-5 h-5">{icon}</div>

      {!isCollapsed && (
        <div className="flex items-center justify-between w-full">
          <span className="truncate">{label}</span>
          {badge && (
            <span className="ml-auto rounded-full bg-black text-white text-xs px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default SidebarNavItem;
