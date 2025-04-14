import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NavItem } from "@/interfaces/sidebar";

/**
 * Custom hook for managing sidebar state
 * @description Provides functionality for sidebar state management
 * @param navItems - Array of navigation items
 * @param defaultCollapsed - Whether sidebar should be collapsed by default
 * @returns Sidebar state and methods
 */
export const useSidebar = (navItems: NavItem[], defaultCollapsed = false) => {
  // Get current pathname for determining active item
  const pathname = usePathname();

  // State for sidebar collapse on desktop
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // Try to get stored preference from localStorage
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("sidebarCollapsed");
      return storedValue ? JSON.parse(storedValue) : defaultCollapsed;
    }
    return defaultCollapsed;
  });

  // State for sidebar open/close on mobile
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // State for active navigation item
  const [activeItemId, setActiveItemId] = useState<string>("");

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      // Store preference in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newValue));
      }
      return newValue;
    });
  }, []);

  // Toggle mobile sidebar open/close
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Determine active item based on current pathname
  useEffect(() => {
    // Flatten navigation items (including children) for easier matching
    const flattenItems = (items: NavItem[]): NavItem[] => {
      return items.reduce((acc: NavItem[], item) => {
        if (item.children) {
          return [...acc, item, ...flattenItems(item.children)];
        }
        return [...acc, item];
      }, []);
    };

    const allItems = flattenItems(navItems);

    // Find best matching item based on pathname
    const matchingItem = allItems.find((item) => {
      // Exact match
      if (item.path === pathname) return true;

      // Match dashboard home
      if (item.path === "/dashboard" && pathname.startsWith("/dashboard"))
        return true;

      // Match other paths that start with item path (e.g. /settings/profile matches /settings)
      if (item.path !== "/" && pathname.startsWith(item.path)) return true;

      return false;
    });

    if (matchingItem) {
      setActiveItemId(matchingItem.id);
    }
  }, [pathname, navItems]);

  return {
    isCollapsed,
    toggleSidebar,
    isMobileOpen,
    toggleMobileSidebar,
    activeItemId,
    setActiveItemId,
  };
};
