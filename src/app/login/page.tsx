import React from "react";
import { Metadata } from "next";
import LoginTemplate from "@/components/templates/LoginTemplate";
import "./login.css";

/**
 * Metadata for the login page
 */
export const metadata: Metadata = {
  title: "Sign In - CyLink",
  description:
    "Sign in to your CyLink account to manage your shortened URLs and QR codes",
};

/**
 * Login page
 * @description The page for user authentication
 * @returns Login page component
 */
export default function LoginPage() {
  return (
    <div className="login-page">
      <LoginTemplate />
    </div>
  );
}
