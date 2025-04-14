/**
 * Interface for sidebar navigation item
 * @description Represents a navigation item in the sidebar
 */
export interface NavItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * Path to navigate to when item is clicked
   */
  path: string;

  /**
   * Icon component to display
   */
  icon: React.ReactNode;

  /**
   * Whether this is a setting item (displayed in bottom section)
   */
  isSetting?: boolean;

  /**
   * List of child items (for dropdown/nested navigation)
   */
  children?: NavItem[];

  /**
   * Whether this item requires authentication
   */
  requiresAuth?: boolean;

  /**
   * Badge content to display (e.g. notification count)
   */
  badge?: string | number;
}

/**
 * Interface for sidebar context
 * @description Contains the state and methods for the sidebar
 */
export interface SidebarContextType {
  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed: boolean;

  /**
   * Toggle sidebar expanded/collapsed state
   */
  toggleSidebar: () => void;

  /**
   * Whether the sidebar is open on mobile
   */
  isMobileOpen: boolean;

  /**
   * Toggle sidebar open/closed state on mobile
   */
  toggleMobileSidebar: () => void;

  /**
   * Currently active navigation item ID
   */
  activeItemId: string;

  /**
   * Set active navigation item
   */
  setActiveItemId: (id: string) => void;
}

/**
 * Interface for user profile props
 * @description Props for the user profile component in sidebar
 */
export interface UserProfileProps {
  /**
   * User's display name
   */
  name: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * URL to user's avatar image
   */
  avatarUrl?: string;

  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed: boolean;

  /**
   * Function to navigate to profile settings
   */
  onProfileClick: () => void;
}
