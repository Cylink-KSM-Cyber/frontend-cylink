/**
 * OnboardingTour Molecule
 *
 * Provides a flexible, reusable onboarding tour component using Driver.js. Accepts an array of steps and manages the tour lifecycle. Designed for atomic design, clean code, and easy integration across pages.
 *
 * @module components/molecules/OnboardingTour
 */
import React, { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import type { OnboardingTourProps } from "@/interfaces/onboardingTour";

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  show,
  onClose,
  options = {},
}) => {
  useEffect(() => {
    if (!show || !steps || steps.length === 0) return;

    const d = driver({
      steps: steps.map((step) => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          position: step.popover.position || "auto",
        },
      })),
      allowClose: true,
      showProgress: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      ...options,
      onDestroyed: () => {
        onClose?.();
      },
      onCloseClick: () => {
        onClose?.();
      },
    });
    d.drive();

    return () => {
      d.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, JSON.stringify(steps)]);

  return null; // No visible UI
};

export default OnboardingTour;
