"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RegisterTemplate from "@/components/templates/RegisterTemplate";
import VerificationSuccessModal from "@/components/molecules/VerificationSuccessModal";
import VerificationErrorModal from "@/components/molecules/VerificationErrorModal";
import useVerification from "@/hooks/useVerification";
import Logo from "@/components/atoms/Logo";
import "./register.css";

/**
 * RegisterClientPage
 * @description Client-side logic for the register page, including verification modal flow.
 * @returns Register client page component
 */
export default function RegisterClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams
    ? searchParams.get("verification_token") || searchParams.get("token")
    : null;
  const { isLoading, isSuccess, error, response, verify } = useVerification();
  const [modalOpen, setModalOpen] = useState(true);

  // Run verification on mount if token exists
  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token, verify]);

  // Handle modal close (redirect to login or register)
  const handleClose = useCallback(() => {
    setModalOpen(false);
    if (isSuccess) {
      router.push("/login");
    } else {
      router.push("/register");
    }
  }, [isSuccess, router]);

  // If token is present, show only the modal (success or error)
  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <div className="mb-8">
          <Logo size="lg" withLink={false} showText={true} />
        </div>
        {isLoading && (
          <div className="text-center text-gray-700 text-lg font-medium">
            Verifying your account...
          </div>
        )}
        {!isLoading && isSuccess && (
          <VerificationSuccessModal
            isOpen={modalOpen}
            onClose={handleClose}
            message={response?.message}
          />
        )}
        {!isLoading && !isSuccess && error && (
          <VerificationErrorModal
            isOpen={modalOpen}
            onClose={handleClose}
            message={error}
          />
        )}
        {!isLoading && !token && (
          <VerificationErrorModal
            isOpen={modalOpen}
            onClose={handleClose}
            message="No verification token provided. Please check your email link or contact support."
          />
        )}
      </div>
    );
  }

  // If no token, show the registration form as usual
  return (
    <div className="register-page">
      <RegisterTemplate />
    </div>
  );
}
