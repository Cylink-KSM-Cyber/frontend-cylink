"use client";

/**
 * Verification Confirmation Page
 *
 * Handles user account verification via token from query parameter. Shows success or error modal based on API response.
 *
 * @module app/register/verification/page
 */
import React, { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/atoms/Logo";
import VerificationSuccessModal from "@/components/molecules/VerificationSuccessModal";
import VerificationErrorModal from "@/components/molecules/VerificationErrorModal";
import useVerification from "@/hooks/useVerification";

const VerificationPage: React.FC = () => {
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
    // Optionally, redirect after closing modal
    if (isSuccess) {
      router.push("/login");
    } else {
      router.push("/register");
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8">
        <Logo size="lg" withLink={false} showText={true} />
      </div>
      {/* Loading state */}
      {isLoading && (
        <div className="text-center text-gray-700 text-lg font-medium">
          Verifying your account...
        </div>
      )}
      {/* Success modal */}
      {!isLoading && isSuccess && (
        <VerificationSuccessModal
          isOpen={modalOpen}
          onClose={handleClose}
          message={response?.message}
        />
      )}
      {/* Error modal */}
      {!isLoading && !isSuccess && error && (
        <VerificationErrorModal
          isOpen={modalOpen}
          onClose={handleClose}
          message={error}
        />
      )}
      {/* No token in query */}
      {!isLoading && !token && (
        <VerificationErrorModal
          isOpen={modalOpen}
          onClose={handleClose}
          message="No verification token provided. Please check your email link or contact support."
        />
      )}
    </div>
  );
};

export default VerificationPage;
