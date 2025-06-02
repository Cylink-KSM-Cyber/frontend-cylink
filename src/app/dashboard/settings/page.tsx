"use client";

import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUnderDevelopment } from "@/hooks/useUnderDevelopment";
import UnderDevelopmentTemplate from "@/components/templates/UnderDevelopmentTemplate";
import Button from "@/components/atoms/Button";
import {
  RiSettings4Line,
  RiUser3Line,
  RiLockLine,
  RiNotificationLine,
} from "react-icons/ri";

/**
 * Settings Page
 * @description Settings page that demonstrates under development content replacement
 * When ?under-development=true parameter is present, replaces entire content with under development
 */
export default function SettingsPage() {
  // Get sidebar context to set active item
  const { setActiveItemId } = useSidebar();

  // Get under development hook
  const { isUnderDevelopmentMode, hideUnderDevelopment, showUnderDevelopment } =
    useUnderDevelopment();

  // Set the active sidebar item
  useEffect(() => {
    setActiveItemId("settings");
  }, [setActiveItemId]);

  // If under development mode, replace entire content
  if (isUnderDevelopmentMode) {
    return (
      <UnderDevelopmentTemplate
        mode="content"
        pageTitle="Settings Under Development"
        customMessage="We're working hard to bring you comprehensive settings and account management features. Stay tuned for exciting updates!"
        onClose={hideUnderDevelopment}
        backLinkLabel="Back to Settings"
        showHomeButton={true}
      />
    );
  }

  // Normal settings content
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Demo Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          🚀 Under Development Content Demo
        </h2>
        <p className="text-blue-700 mb-4">
          This page demonstrates the under development content replacement
          functionality. Click the button below to replace this entire page
          content with under development view.
        </p>
        <Button
          variant="primary"
          onClick={showUnderDevelopment}
          startIcon={<RiSettings4Line />}
        >
          Switch to Under Development View
        </Button>
      </div>

      {/* Settings Sections (Mock UI) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <RiUser3Line className="w-5 h-5 text-gray-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Update your personal information and profile settings.
          </p>
          <Button variant="outline" size="sm" onClick={showUnderDevelopment}>
            Manage Profile
          </Button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <RiLockLine className="w-5 h-5 text-gray-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Configure password, two-factor authentication, and security
            preferences.
          </p>
          <Button variant="outline" size="sm" onClick={showUnderDevelopment}>
            Security Settings
          </Button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <RiNotificationLine className="w-5 h-5 text-gray-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Customize email notifications and alert preferences.
          </p>
          <Button variant="outline" size="sm" onClick={showUnderDevelopment}>
            Notification Settings
          </Button>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <RiSettings4Line className="w-5 h-5 text-gray-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Account</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Manage subscription, billing, and account deletion options.
          </p>
          <Button variant="outline" size="sm" onClick={showUnderDevelopment}>
            Account Settings
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">How to Test:</h4>
        <ul className="text-gray-600 space-y-1 text-sm">
          <li>• Click any button above to switch to under development view</li>
          <li>
            • Or manually add{" "}
            <code className="bg-gray-200 px-1 rounded">
              ?under-development=true
            </code>{" "}
            to the URL
          </li>
          <li>
            • The entire page content will be replaced with under development
            view
          </li>
          <li>• Click &quot;Back to Settings&quot; to return to normal view</li>
          <li>
            • This pattern can be used on any page with features under
            development
          </li>
        </ul>
      </div>
    </div>
  );
}
