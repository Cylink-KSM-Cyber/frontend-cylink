import React, { createContext, useContext } from "react";
import { SidebarContextType } from "@/interfaces/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { sidebarNavItems } from "@/config/sidebar";

// Create sidebar context with default values
const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobileOpen: false,
  toggleMobileSidebar: () => {},
  activeItemId: "",
  setActiveItemId: () => {},
});

/**
 * Sidebar context provider props
 */
interface SidebarProviderProps {
  children: React.ReactNode;
}

/**
 * Sidebar Context Provider
 * @description Provides sidebar state and functionality to components
 */
export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  // Use the sidebar hook for state management
  const sidebarState = useSidebar(sidebarNavItems, false);

  return (
    <SidebarContext.Provider value={sidebarState}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Custom hook to use sidebar context
 * @description Provides access to sidebar context
 * @returns Sidebar context state and methods
 */
export const useSidebarContext = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }

  return context;
};
