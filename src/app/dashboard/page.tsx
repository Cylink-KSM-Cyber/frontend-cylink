"use client";

import React, { useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import AnalyticsDashboardTemplate from "@/components/templates/AnalyticsDashboardTemplate";
import { Url } from "@/interfaces/url";
import { formatShortUrl } from "@/utils/urlFormatter";
import "@/styles/analyticsDashboard.css";
import OnboardingTour from "@/components/molecules/OnboardingTour";
import { ONBOARDING_STEPS } from "@/config/onboardingConfig";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  createOnNextClickHandler,
  createOnDoneClickHandler,
} from "@/utils/onboardingDriverCallbacks";

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

  // Get onboarding context
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  // Set the active sidebar item
  useEffect(() => {
    setActiveItemId("dashboard");
  }, [setActiveItemId]);

  // Get dashboard analytics data
  const dashboardData = useDashboardAnalytics();

  // Pass all global steps to OnboardingTour
  const onboardingSteps = ONBOARDING_STEPS.map((s) => ({
    element: s.element,
    popover: {
      title: s.title,
      description: s.description,
      position: s.position || "auto",
    },
  }));
  const totalSteps = ONBOARDING_STEPS.length;
  // Dashboard selalu mulai dari step 0
  const startStep = 0;
  // Step transisi: step 4 (index 3)
  const transitionStepIndex = 3;

  const onboardingOptions = {
    showProgress: true,
    progressText: "Step {{current}} of " + totalSteps,
    onNextClick: createOnNextClickHandler(
      transitionStepIndex,
      "/dashboard/urls?onboardingStep=5"
    ),
    onDoneClick: createOnDoneClickHandler("/dashboard/urls?onboardingStep=5"),
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
        startStep={startStep}
        options={onboardingOptions}
      />
    </>
  );
}
