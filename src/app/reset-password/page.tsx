import React, { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordTemplate from "@/components/templates/ResetPasswordTemplate";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import "./reset-password.css";

/**
 * Metadata for the reset password page
 */
export const metadata: Metadata = {
  title: "Reset Password - CyLink",
  description:
    "Reset your CyLink account password. Create a new secure password to regain access to your account.",
  keywords: ["reset password", "new password", "CyLink", "account security"],
};

/**
 * Reset password page client component
 * @description Handles token extraction from URL parameters
 */
async function ResetPasswordPageClient({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  return (
    <div className="reset-password-page">
      <ResetPasswordTemplate token={token} />
    </div>
  );
}

/**
 * Reset password page
 * @description The page for password reset with token validation
 * @returns Reset password page component
 */
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner />
        </div>
      }
    >
      <ResetPasswordPageClient searchParams={searchParams} />
    </Suspense>
  );
}
