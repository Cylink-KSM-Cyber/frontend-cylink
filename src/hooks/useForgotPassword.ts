import { useState, useCallback } from "react";
import AuthService from "@/services/auth";
import { ForgotPasswordRequest } from "@/interfaces/auth";
import { AxiosError } from "axios";

/**
 * Custom hook for forgot password functionality
 * @description Manages forgot password state and provides reset password request functionality
 * @returns Forgot password state and methods
 */
const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");

  /**
   * Request password reset handler
   * @description Sends forgot password request to API
   * @param email - Email address to send reset link to
   */
  const requestPasswordReset = useCallback(async (email: string) => {
    console.log("Forgot password request started", { email });
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setResponseMessage("");

    try {
      const request: ForgotPasswordRequest = { email };
      const response = await AuthService.forgotPassword(request);

      // Set success state and message for modal
      setIsSuccess(true);
      setResponseMessage(
        response.data?.message ||
          "We've sent a password reset link to your email. Please check your inbox."
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
            // For security reasons, show success modal even on some errors
            setIsSuccess(true);
            setResponseMessage(
              "We've sent a password reset link to your email. Please check your inbox."
            );
            return;
        }
      } else {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset forgot password state
   * @description Clears the current state to allow new requests
   */
  const resetState = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setResponseMessage("");
  }, []);

  return {
    isLoading,
    isSuccess,
    error,
    responseMessage,
    requestPasswordReset,
    resetState,
  };
};

export default useForgotPassword;
