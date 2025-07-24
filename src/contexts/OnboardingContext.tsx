/**
 * OnboardingContext
 *
 * Provides a global context for managing onboarding tour visibility and logic across the application. Decouples onboarding trigger from localStorage and enables flexible, environment-aware onboarding control (e.g., always show in development, only show on first login in production). Designed for maintainability, scalability, and clean code.
 *
 * @module contexts/OnboardingContext
 */
import React, { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  triggerOnboarding: (firstLogin: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  showOnboarding: false,
  setShowOnboarding: () => {},
  triggerOnboarding: () => {},
});

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  /**
   * Triggers onboarding based on environment and firstLogin flag from backend.
   * In development, always show onboarding. In production, only show if firstLogin is true.
   */
  const triggerOnboarding = (firstLogin: boolean) => {
    if (process.env.NODE_ENV !== "production") {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(!!firstLogin);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ showOnboarding, setShowOnboarding, triggerOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
