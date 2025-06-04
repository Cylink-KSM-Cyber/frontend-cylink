import React from "react";
import { Metadata } from "next";
import RegisterTemplate from "@/components/templates/RegisterTemplate";
import "./register.css";

/**
 * Metadata for the Register page
 */
export const metadata: Metadata = {
  title: "Sign In - CyLink",
  description:
    "Sign in to your CyLink account to manage your shortened URLs and QR codes",
};

/**
 * Register page
 * @description The page for user authentication
 * @returns Register page component
 */
export default function RegisterPage() {
  return (
    <div className="register-page">
      <RegisterTemplate />
    </div>
  );
}
