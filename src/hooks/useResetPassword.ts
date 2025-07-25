import { useState, useCallback, useEffect } from "react";
import AuthService from "@/services/auth";
import { ResetPasswordRequest } from "@/interfaces/auth";
import { AxiosError } from "axios";

/**
 * Token validation state type
 */
interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  errorCode?: "MISSING_TOKEN" | "INVALID_TOKEN" | "TOKEN_EXPIRED" | string;
  message?: string;
}

/**
 * Custom hook for reset password functionality
 * @description Manages reset password state and provides password reset functionality
 * @returns Reset password state and methods
 */
const useResetPassword = (token?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [tokenValidation, setTokenValidation] = useState<TokenValidation>({
    isValid: false,
    isExpired: false,
  });
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(true);

  /**
   * Handle 400 Bad Request errors
   * @param data - Error response data
   */
  const handle400Error = useCallback(
    (data: {
      status: number;
      message: string;
      error_code?: string;
      errors?: string[];
    }) => {
      if (data?.error_code === "MISSING_TOKEN") {
        setTokenValidation({
          isValid: false,
          isExpired: false,
          errorCode: "MISSING_TOKEN",
          message: data.message,
        });
      } else if (data?.error_code === "INVALID_TOKEN") {
        setTokenValidation({
          isValid: false,
          isExpired: false,
          errorCode: "INVALID_TOKEN",
          message: data.message,
        });
      } else if (data?.error_code === "TOKEN_EXPIRED") {
        setTokenValidation({
          isValid: false,
          isExpired: true,
          errorCode: "TOKEN_EXPIRED",
          message: data.message,
        });
      } else if (data?.error_code === "VALIDATION_ERROR") {
        const validationErrors = data.errors || [data.message];
        setError(validationErrors.join(", "));
      } else {
        setError(data?.message || "Please check your input and try again.");
      }
    },
    []
  );

  /**
   * Handle API error response
   * @param error - Axios error object
   */
  const handleApiError = useCallback(
    (
      error: AxiosError<{
        status: number;
        message: string;
        error_code?: string;
        errors?: string[];
      }>
    ) => {
      if (!error.response) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
        return;
      }

      const { status, data } = error.response;

      switch (status) {
        case 400:
          handle400Error(data);
          break;
        case 429:
          setError(
            "Too many password reset attempts. Please try again in 15 minutes."
          );
          break;
        case 500:
          setError("Internal server error. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
          break;
      }
    },
    [handle400Error]
  );

  /**
   * Validate reset token
   * @description Validates the reset token from URL parameters
   */
  const validateToken = useCallback(async () => {
    if (!token) {
      setTokenValidation({
        isValid: false,
        isExpired: false,
        errorCode: "MISSING_TOKEN",
        message: "Reset token is required in query parameter.",
      });
      setIsValidatingToken(false);
      return;
    }

    try {
      setIsValidatingToken(true);

      // For now, we assume the token is valid if it exists
      // In a real implementation, you might want to validate the token with the server
      setTokenValidation({
        isValid: true,
        isExpired: false,
      });
    } catch {
      setTokenValidation({
        isValid: false,
        isExpired: false,
        errorCode: "INVALID_TOKEN",
        message: "Invalid or malformed reset token.",
      });
    } finally {
      setIsValidatingToken(false);
    }
  }, [token]);

  /**
   * Reset password handler
   * @description Resets password with new password
   * @param password - New password
   * @param passwordConfirmation - Password confirmation
   */
  const resetPassword = useCallback(
    async (password: string, passwordConfirmation: string) => {
      if (!token) {
        setError("Reset token is missing.");
        return;
      }

      console.log("Reset password request started", { hasToken: !!token });
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      setResponseMessage("");

      try {
        const request: ResetPasswordRequest = {
          password,
          password_confirmation: passwordConfirmation,
        };

        const response = await AuthService.resetPassword(request, token);

        // Set success state and message
        setIsSuccess(true);
        setResponseMessage(
          response.data?.message ||
            "Password has been reset successfully. You can now log in with your new password."
        );
      } catch (err) {
        const error = err as AxiosError<{
          status: number;
          message: string;
          error_code?: string;
          errors?: string[];
        }>;

        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleApiError]
  );

  /**
   * Reset state
   * @description Clears the current state to allow new requests
   */
  const resetState = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setResponseMessage("");
  }, []);

  // Validate token on mount
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return {
    isLoading,
    isSuccess,
    error,
    responseMessage,
    tokenValidation,
    isValidatingToken,
    resetPassword,
    resetState,
    validateToken,
  };
};

export default useResetPassword;
