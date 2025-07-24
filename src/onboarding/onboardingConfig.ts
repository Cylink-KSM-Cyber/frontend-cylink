/**
 * Onboarding Steps Config
 *
 * Centralized configuration for all onboarding steps across multiple pages.
 * Each step defines the page, global step number, selector, copywriting, and popover position.
 * This enables maintainable, scalable, and consistent onboarding flows.
 *
 * @module onboarding/onboardingConfig
 */

export interface OnboardingStepConfig {
  page: string; // e.g. '/dashboard', '/dashboard/urls'
  step: number; // global step number (1-based)
  element: string; // CSS selector or [data-tour-id]
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "auto";
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  // Dashboard steps
  {
    page: "/dashboard",
    step: 1,
    element: '[data-tour-id="dashboard-header"]',
    title: "Welcome to Your Dashboard!",
    description:
      "This is your analytics dashboard. Here you can monitor your link and QR code performance at a glance.",
    position: "bottom",
  },
  {
    page: "/dashboard",
    step: 2,
    element: '[data-tour-id="dashboard-kpi-cards"]',
    title: "Key Metrics",
    description:
      "Quickly view your total URLs, total clicks, average CTR, and top performer stats.",
    position: "bottom",
  },
  {
    page: "/dashboard",
    step: 3,
    element: '[data-tour-id="dashboard-performance-trend"]',
    title: "Performance Trends",
    description:
      "Analyze your URL performance trends over time with this interactive chart.",
    position: "bottom",
  },
  {
    page: "/dashboard",
    step: 4,
    element: '[data-tour-id="dashboard-top-urls"]',
    title: "Top Performing URLs",
    description:
      "See which of your links are performing best and copy them for easy sharing.",
    position: "bottom",
  },
  // URLs steps
  {
    page: "/dashboard/urls",
    step: 5,
    element: '[data-tour-id="urls-header"]',
    title: "Manage Your Links",
    description: "Manage all your short links in one place.",
    position: "bottom",
  },
  {
    page: "/dashboard/urls",
    step: 6,
    element: '[data-tour-id="urls-stats"]',
    title: "Stats Summary",
    description: "Monitor key statistics across all your links.",
    position: "bottom",
  },
  {
    page: "/dashboard/urls",
    step: 7,
    element: '[data-tour-id="urls-search"]',
    title: "Search Bar",
    description: "Quickly find links using keywords.",
    position: "bottom",
  },
  {
    page: "/dashboard/urls",
    step: 8,
    element: '[data-tour-id="urls-filter"]',
    title: "Filter & Sort",
    description: "Filter and sort links as needed.",
    position: "bottom",
  },
  {
    page: "/dashboard/urls",
    step: 9,
    element: '[data-tour-id="urls-create-btn"]',
    title: "Create New URL",
    description: "Click here to create a new short link.",
    position: "bottom",
  },
  {
    page: "/dashboard/urls",
    step: 10,
    element: '[data-tour-id="urls-table"]',
    title: "URLs Table",
    description:
      "Easily view, edit, delete, or copy your links from this table.",
    position: "top",
  },
  {
    page: "/dashboard/urls",
    step: 11,
    element: '[data-tour-id="urls-pagination"]',
    title: "Pagination",
    description: "Navigate between your link pages here.",
    position: "top",
  },
];
