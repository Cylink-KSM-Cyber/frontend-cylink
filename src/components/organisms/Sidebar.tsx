"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiDashboardLine,
  RiLinkM,
  RiQrCodeLine,
  RiLineChartLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { NavItem, UserProfileProps } from "@/interfaces/sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import LogoutConfirmationModal from "@/components/molecules/LogoutConfirmationModal";
import useLogoutConfirmation from "@/hooks/useLogoutConfirmation";
import Avatar from "@/components/atoms/Avatar";

/**
 * Theme constants for consistent styling across the sidebar
 * These values are paired with appropriate Tailwind classes
 */
const THEME = {
  // Active state styling
  ACTIVE_BG_CLASS: "bg-black",
  ACTIVE_TEXT_CLASS: "text-white",

  // Badge styling
  BADGE_BG_CLASS: "bg-gray-200",
  BADGE_TEXT_CLASS: "text-black",

  // Button styling for mobile
  MOBILE_BUTTON_CLASS: "bg-black text-white",

  // Logo text color
  LOGO_TEXT_CLASS: "text-black",
};

/**
 * User profile component for displaying user information in the sidebar
 * @param name - User's display name
 * @param email - User's email address
 * @param avatarUrl - URL to user's avatar image
 * @param isCollapsed - Whether the sidebar is in collapsed state
 * @param onProfileClick - Function to handle profile click
 */
const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatarUrl,
  isCollapsed,
  onProfileClick,
}) => {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 ${
        isCollapsed ? "justify-center" : "mb-2"
      }`}
      onClick={onProfileClick}
    >
      {avatarUrl ? (
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <Avatar
          username={name}
          size={40}
          isClickable={true}
          onClick={onProfileClick}
          ariaLabel={`Profile avatar for ${name}`}
        />
      )}

      {!isCollapsed && (
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Navigation item component
 * @description Renders a navigation item in the sidebar with active state styling
 * Uses consistent theme variables for colors
 * @param item - Navigation item data
 * @param isActive - Whether the item is currently active
 * @param isCollapsed - Whether the sidebar is in collapsed state
 * @param onClick - Function to handle item click
 */
const NavItemComponent: React.FC<{
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, isCollapsed, onClick }) => {
  return (
    <Link
      href={item.path}
      className={`flex items-center px-4 py-3 ${
        isCollapsed ? "justify-center" : ""
      } ${
        isActive
          ? `${THEME.ACTIVE_BG_CLASS} ${THEME.ACTIVE_TEXT_CLASS}`
          : "text-gray-700 hover:bg-gray-100"
      } rounded-lg transition-all duration-200`}
      onClick={() => {
        // Call onClick to set active item before navigation happens
        onClick();
      }}
    >
      <span
        className={`text-xl ${
          isActive ? THEME.ACTIVE_TEXT_CLASS : "text-gray-500"
        }`}
      >
        {item.icon}
      </span>

      {!isCollapsed && (
        <>
          <span className="ml-3 text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span
              className={`ml-auto ${THEME.BADGE_BG_CLASS} ${THEME.BADGE_TEXT_CLASS} text-xs font-medium px-2 py-0.5 rounded`}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

interface SidebarProps {
  /**
   * User's display name
   */
  userName: string;

  /**
   * User's email
   */
  userEmail: string;

  /**
   * URL to user's avatar image
   */
  userAvatar?: string;

  /**
   * Function to handle logout
   */
  onLogout: () => void;

  /**
   * Function to handle profile click
   */
  onProfileClick: () => void;

  /**
   * CSS class to apply to container
   */
  className?: string;
}

/**
 * Sidebar Component
 * @description Main sidebar navigation component for dashboard
 * Uses logo from public/logo/logo-cylink.png and consistent theme styling
 * @param userName - User's display name
 * @param userEmail - User's email
 * @param userAvatar - URL to user's avatar image
 * @param onLogout - Function to handle logout
 * @param onProfileClick - Function to handle profile click
 * @param className - Additional CSS classes
 */
const Sidebar: React.FC<SidebarProps> = ({
  userName,
  userEmail,
  userAvatar,
  onLogout,
  onProfileClick,
  className = "",
}) => {
  // Get sidebar state from context
  const {
    isCollapsed,
    toggleSidebar,
    isMobileOpen,
    toggleMobileSidebar,
    activeItemId,
    setActiveItemId,
  } = useSidebar();

  // Use logout confirmation hook
  const { isModalOpen, isLoggingOut, openModal, closeModal, handleLogout } =
    useLogoutConfirmation();

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: <RiDashboardLine />,
    },
    {
      id: "urls",
      label: "My URLs",
      path: "/dashboard/urls",
      icon: <RiLinkM />,
    },
    {
      id: "qrcodes",
      label: "QR Codes",
      path: "/dashboard/qr-codes",
      icon: <RiQrCodeLine />,
    },
    {
      id: "analytics",
      label: "Analytics",
      path: "/dashboard?tab=analytics",
      icon: <RiLineChartLine />,
    },
  ];

  const settingsItems: NavItem[] = [
    {
      id: "settings",
      label: "Settings",
      path: "/settings",
      icon: <RiSettings4Line />,
      isSetting: true,
    },
    {
      id: "logout",
      label: "Logout",
      path: "#",
      icon: <RiLogoutBoxRLine />,
      isSetting: true,
    },
  ];

  // Handle navigation item click
  const handleNavItemClick = (id: string) => {
    setActiveItemId(id);

    // Handle logout with confirmation
    if (id === "logout") {
      openModal();
    }
  };

  // Set up custom logout handler
  const handleConfirmLogout = async () => {
    await handleLogout();
    onLogout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 bottom-0 left-0 z-30
          flex flex-col
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${className}
        `}
      >
        {/* Logo and Toggle */}
        <div
          className={`
            flex items-center h-16 px-4 border-b border-gray-100
            ${isCollapsed ? "justify-between" : "justify-between"}
          `}
        >
          <Link
            href="/dashboard"
            className={`
              flex items-center 
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <div className="relative flex-shrink-0 w-8 h-8">
              <Image
                src="/logo/logo-cylink.png"
                alt="CyLink Logo"
                className="object-contain"
                fill
                sizes="32px"
                priority
              />
            </div>
            {!isCollapsed && (
              <span
                className={`ml-2.5 text-xl font-bold ${THEME.LOGO_TEXT_CLASS}`}
              >
                CyLink
              </span>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <RiArrowRightSLine size={18} />
            ) : (
              <RiArrowLeftSLine size={18} />
            )}
          </button>
        </div>

        {/* User Profile */}
        <UserProfile
          name={userName}
          email={userEmail}
          avatarUrl={userAvatar}
          isCollapsed={isCollapsed}
          onProfileClick={onProfileClick}
        />

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              isCollapsed={isCollapsed}
              onClick={() => handleNavItemClick(item.id)}
            />
          ))}
        </nav>

        {/* Settings Navigation */}
        <div className="px-3 py-4 border-t border-gray-200 space-y-1">
          {settingsItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              isCollapsed={isCollapsed}
              onClick={() => handleNavItemClick(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile toggle button - only visible on small screens */}
      <button
        className={`fixed z-20 bottom-4 right-4 lg:hidden p-3 ${THEME.ACTIVE_BG_CLASS} ${THEME.ACTIVE_TEXT_CLASS} rounded-full shadow-lg`}
        onClick={toggleMobileSidebar}
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isMobileOpen ? (
          <RiMenuFoldLine size={24} />
        ) : (
          <RiMenuUnfoldLine size={24} />
        )}
      </button>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Sidebar;
