import { useState, useCallback } from "react";
import AuthService from "@/services/auth";
import { ForgotPasswordRequest } from "@/interfaces/auth";
import { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastContext";

/**
 * Custom hook for forgot password functionality
 * @description Manages forgot password state and provides reset password request functionality
 * @returns Forgot password state and methods
 */
const useForgotPassword = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request password reset handler
   * @description Sends forgot password request to API
   * @param email - Email address to send reset link to
   */
  const requestPasswordReset = useCallback(
    async (email: string) => {
      console.log("Forgot password request started", { email });
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const request: ForgotPasswordRequest = { email };
        const response = await AuthService.forgotPassword(request);

        // Show success message
        setIsSuccess(true);
        showToast(
          response.data?.message ||
            "If an account with that email exists, we have sent a password reset link.",
          "success"
        );
      } catch (err) {
        // Handle different error cases
        const error = err as AxiosError;
        let errorMessage =
          "An error occurred while processing your request. Please try again later.";

        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = "Please enter a valid email address.";
              break;
            case 429:
              errorMessage = "Too many requests. Please try again later.";
              break;
            case 500:
              errorMessage = "Internal server error. Please try again later.";
              break;
            default:
              // For other errors, use a generic message for security
              errorMessage =
                "If an account with that email exists, we have sent a password reset link.";
          }
        } else {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        }

        setError(errorMessage);
        // For security reasons, show success message even on some errors
        if (error.response?.status === 400) {
          showToast(errorMessage, "error");
        } else {
          showToast(
            "If an account with that email exists, we have sent a password reset link.",
            "success"
          );
          setIsSuccess(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Reset forgot password state
   * @description Clears the current state to allow new requests
   */
  const resetState = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    isLoading,
    isSuccess,
    error,
    requestPasswordReset,
    resetState,
  };
};

export default useForgotPassword;
