"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarContextType } from "@/interfaces/sidebar";

/**
 * Context for managing sidebar state throughout the application
 */
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/**
 * Props for SidebarProvider component
 */
interface SidebarProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode;
}

/**
 * Sidebar Provider Component
 * @description Provides sidebar state and methods to all child components
 */
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  // State for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for mobile sidebar visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State for active navigation item
  const [activeItemId, setActiveItemId] = useState("dashboard");

  // Router hooks
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Toggle mobile sidebar open/closed state
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Update active item based on URL
  useEffect(() => {
    // Set active item based on pathname and search params
    if (pathname === "/dashboard") {
      const tab = searchParams.get("tab");
      if (tab) {
        setActiveItemId(tab);
      } else {
        setActiveItemId("dashboard");
      }
    } else if (pathname === "/settings") {
      setActiveItemId("settings");
    }
  }, [pathname, searchParams]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Context value
  const value: SidebarContextType = {
    isCollapsed,
    toggleSidebar,
    isMobileOpen,
    toggleMobileSidebar,
    activeItemId,
    setActiveItemId,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

/**
 * Custom hook to use the sidebar context
 * @returns Sidebar context values and methods
 * @throws Error if used outside of SidebarProvider
 */
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
};
