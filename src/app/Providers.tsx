"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

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
    <AuthProvider>
      <ToastProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default Providers;
