import React from "react";
import { Metadata } from "next";
import ForgotPasswordTemplate from "@/components/templates/ForgotPasswordTemplate";
import "./forgot-password.css";

/**
 * Metadata for the forgot password page
 */
export const metadata: Metadata = {
  title: "Forgot Password - CyLink",
  description:
    "Reset your CyLink account password. Enter your email to receive a password reset link.",
  keywords: ["forgot password", "reset password", "CyLink", "account recovery"],
};

/**
 * Forgot password page
 * @description The page for password reset requests
 * @returns Forgot password page component
 */
export default function ForgotPasswordPage() {
  return (
    <div className="forgot-password-page">
      <ForgotPasswordTemplate />
    </div>
  );
}
