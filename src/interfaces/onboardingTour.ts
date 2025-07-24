/**
 * Onboarding Tour Interfaces
 *
 * Defines interfaces for the onboarding tour feature, including step and props types. Promotes reusability and maintainability across the codebase.
 *
 * @module interfaces/onboardingTour
 */

export interface OnboardingStep {
  element: string; // CSS selector or [data-tour-id] attribute
  popover: {
    title: string;
    description: string;
    position?: "top" | "bottom" | "left" | "right" | "auto";
  };
}

export interface OnboardingTourProps {
  steps: OnboardingStep[];
  show: boolean;
  onClose?: () => void;
  options?: Record<string, unknown>;
}
