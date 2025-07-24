/**
 * Onboarding Steps Config
 *
 * Centralized configuration for all onboarding steps across multiple pages.
 * Each step defines the page, global step number, selector, copywriting, and popover position.
 * This enables maintainable, scalable, and consistent onboarding flows.
 *
 * @module config/onboardingConfig
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
  {
    page: "/dashboard/qr-codes",
    step: 12,
    element: '[data-tour-id="qrcodes-header"]',
    title: "QR Codes Overview",
    description: "Manage all the QR codes you have created in one place.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 13,
    element: '[data-tour-id="qrcodes-create-btn"]',
    title: "Create QR Code",
    description: "Create a new QR code for your link with a single click.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 14,
    element: '[data-tour-id="qrcodes-search"]',
    title: "Search QR Codes",
    description: "Search QR codes by title or URL.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 15,
    element: '[data-tour-id="qrcodes-view-toggle"]',
    title: "View Mode Toggle",
    description: "Switch between grid or list view as you prefer.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 16,
    element: '[data-tour-id="qrcodes-filter-controls"]',
    title: "Filter & Sort Controls",
    description: "Filter and sort QR codes for easier management.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 17,
    element: '[data-tour-id="qrcodes-bulk-actions"]',
    title: "Bulk Actions",
    description: "Select multiple QR codes at once for mass actions.",
    position: "bottom",
  },
  {
    page: "/dashboard/qr-codes",
    step: 18,
    element: '[data-tour-id="qrcodes-grid-list"]',
    title: "QR Code Grid/List",
    description: "View, edit, delete, or download your QR codes here.",
    position: "top",
  },
  {
    page: "/dashboard/qr-codes",
    step: 19,
    element: '[data-tour-id="qrcodes-pagination"]',
    title: "Pagination",
    description: "Navigate between pages of your QR codes.",
    position: "top",
  },
];
