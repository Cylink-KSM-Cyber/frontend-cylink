"use client";

import React, { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

/**
 * Provider properties
 * @interface ProvidersProps
 */
interface ProvidersProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Providers component
 * @description Wraps the application with all necessary context providers
 * @param props - Provider properties
 * @returns Providers component
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <OnboardingProvider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <SidebarProvider>{children}</SidebarProvider>
          </Suspense>
        </AuthProvider>
      </OnboardingProvider>
    </ToastProvider>
  );
};

export default Providers;
