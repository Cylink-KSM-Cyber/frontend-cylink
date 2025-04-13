import React from "react";
import { Metadata } from "next";
import Link from "next/link";

/**
 * Metadata for the dashboard page
 */
export const metadata: Metadata = {
  title: "Dashboard - CyLink",
  description: "Manage your shortened URLs and QR codes",
};

/**
 * Dashboard page
 * @description The user dashboard page (placeholder for now)
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6 text-gray-600">
          Welcome to your dashboard! This is a placeholder page for now.
        </p>
        <div className="flex justify-between">
          <Link
            href="/"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
