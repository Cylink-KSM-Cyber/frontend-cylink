import React from "react";
import { Metadata } from "next";
import DashboardClientLayout from "@/components/templates/DashboardClientLayout";

/**
 * Metadata for the dashboard section
 */
export const metadata: Metadata = {
  title: "Dashboard - CyLink",
  description: "Manage your shortened URLs and QR codes",
};

/**
 * Dashboard layout component
 * @description Layout wrapper for dashboard pages with sidebar navigation
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
