import { Metadata } from "next";
import RegisterClientPage from "./RegisterClientPage";
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
 * @description The page for user authentication and verification confirmation
 * @returns Register page component
 */
export default function RegisterPage() {
  return <RegisterClientPage />;
}
