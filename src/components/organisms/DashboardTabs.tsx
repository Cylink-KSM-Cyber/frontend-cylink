import React from "react";

// Tab interface
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Prop types for DashboardTabs component
 */
interface DashboardTabsProps {
  /**
   * Array of tab definitions
   */
  tabs: Tab[];
  /**
   * Current active tab ID
   */
  activeTab: string;
  /**
   * Function to call when tab changes
   */
  onTabChange: (tabId: string) => void;
  /**
   * Optional CSS classes to apply to container
   */
  className?: string;
}

/**
 * DashboardTabs Component
 * @description Provides a tabbed interface for the dashboard
 */
const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`border-b border-[#E0E0E0] ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  isActive
                    ? "border-black text-black"
                    : "border-transparent text-[#607D8B] hover:text-[#333333] hover:border-[#E0E0E0]"
                }
                transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * Props for TabPanel component
 */
interface TabPanelProps {
  /**
   * Panel ID
   */
  id: string;
  /**
   * Current active tab ID
   */
  activeTab: string;
  /**
   * Panel content
   */
  children: React.ReactNode;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * TabPanel Component
 * @description Renders content for the active tab
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className = "",
}) => {
  if (id !== activeTab) return null;

  return (
    <div
      id={`tab-panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
    </div>
  );
};

export default DashboardTabs;
