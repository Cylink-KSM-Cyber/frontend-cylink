import React from "react";
import { NavItem } from "@/interfaces/sidebar";
import {
  RiDashboardLine,
  RiLinkM,
  RiQrCodeLine,
  RiLineChartLine,
  RiSettings4Line,
  RiUserLine,
  RiLockPasswordLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";

/**
 * Sidebar navigation items configuration
 * @description Defines the structure and content of the sidebar navigation
 */
export const sidebarNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <RiDashboardLine />,
    requiresAuth: true,
  },
  {
    id: "urls",
    label: "My URLs",
    path: "/dashboard?tab=urls",
    icon: <RiLinkM />,
    requiresAuth: true,
  },
  {
    id: "qrcodes",
    label: "QR Codes",
    path: "/dashboard?tab=qrcodes",
    icon: <RiQrCodeLine />,
    requiresAuth: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/dashboard?tab=analytics",
    icon: <RiLineChartLine />,
    requiresAuth: true,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: <RiSettings4Line />,
    requiresAuth: true,
    isSetting: true,
    children: [
      {
        id: "profile",
        label: "Profile",
        path: "/settings/profile",
        icon: <RiUserLine />,
        requiresAuth: true,
      },
      {
        id: "security",
        label: "Security",
        path: "/settings/security",
        icon: <RiLockPasswordLine />,
        requiresAuth: true,
      },
    ],
  },
];

/**
 * User actions for the sidebar
 * @description Actions related to user account
 */
export const userActions: NavItem[] = [
  {
    id: "logout",
    label: "Logout",
    path: "/logout",
    icon: <RiLogoutBoxRLine />,
    requiresAuth: true,
  },
];
