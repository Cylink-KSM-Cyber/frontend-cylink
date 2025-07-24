"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import AnalyticsDashboardTemplate from "@/components/templates/AnalyticsDashboardTemplate";
import { Url } from "@/interfaces/url";
import { formatShortUrl } from "@/utils/urlFormatter";
import "@/styles/analyticsDashboard.css";
import OnboardingTour from "@/components/molecules/OnboardingTour";
import { OnboardingStep } from "@/interfaces/onboardingTour";

/**
 * Dashboard page
 * @description The user analytics dashboard page
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  // Get sidebar context to set active item
  const { setActiveItemId } = useSidebar();

  // Get toast context for notifications
  const { showToast } = useToast();

  // Set the active sidebar item
  useEffect(() => {
    setActiveItemId("dashboard");
  }, [setActiveItemId]);

  // Get dashboard analytics data
  const dashboardData = useDashboardAnalytics();

  // Onboarding state: only show for new users (localStorage)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem("cylink_onboarding_dashboard");
      if (!hasSeen) {
        setShowOnboarding(true);
        localStorage.setItem("cylink_onboarding_dashboard", "1");
      }
    }
  }, []);

  // Onboarding steps for dashboard
  const onboardingSteps: OnboardingStep[] = [
    {
      element: '[data-tour-id="dashboard-header"]',
      popover: {
        title: "Welcome to Your Dashboard!",
        description:
          "This is your analytics dashboard. Here you can monitor your link and QR code performance at a glance.",
        position: "bottom",
      },
    },
    {
      element: '[data-tour-id="dashboard-kpi-cards"]',
      popover: {
        title: "Key Metrics",
        description:
          "Quickly view your total URLs, total clicks, average CTR, and top performer stats.",
        position: "bottom",
      },
    },
    {
      element: '[data-tour-id="dashboard-performance-trend"]',
      popover: {
        title: "Performance Trends",
        description:
          "Analyze your URL performance trends over time with this interactive chart.",
        position: "bottom",
      },
    },
    {
      element: '[data-tour-id="dashboard-top-urls"]',
      popover: {
        title: "Top Performing URLs",
        description:
          "See which of your links are performing best and copy them for easy sharing.",
        position: "bottom",
      },
    },
  ];

  // Custom onNextClick: pada step 3 (index 3), redirect ke /dashboard/urls?onboardingStep=5
  const onboardingOptions = {
    showProgress: true,
    progressText: "Step {{current}} of 11",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onNextClick: (_el: any, _step: any, options: any) => {
      if (options.state.activeIndex === 3) {
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard/urls?onboardingStep=5";
        }
      } else {
        // Penting: lanjutkan ke step berikutnya jika bukan step 4
        options.driver.moveNext();
      }
    },
    nextBtnText: "Next",
    doneBtnText: "Finish",
  };

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    const fullUrl = formatShortUrl(url.short_url);
    navigator.clipboard.writeText(fullUrl);
    showToast(`URL "${url.short_url}" copied to clipboard`, "success", 2000);
  };

  return (
    <>
      <AnalyticsDashboardTemplate
        dashboardData={dashboardData}
        onCopyUrl={handleCopyUrl}
      />
      <OnboardingTour
        steps={onboardingSteps}
        show={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        options={onboardingOptions}
      />
    </>
  );
}
