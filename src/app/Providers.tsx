import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";

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
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
