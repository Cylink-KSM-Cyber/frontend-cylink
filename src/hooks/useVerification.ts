/**
 * useVerification
 *
 * Custom hook to handle user account verification via token. Manages API call, loading, success, and error states.
 *
 * @module hooks/useVerification
 */
import { useState, useCallback } from "react";
import { VerificationResponse } from "@/interfaces/auth";
import { get } from "@/services/api";
import { AxiosError } from "axios";

export interface UseVerificationResult {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  response: VerificationResponse | null;
  verify: (token: string) => Promise<void>;
  reset: () => void;
}

const useVerification = (): UseVerificationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VerificationResponse | null>(null);

  const verify = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setResponse(null);
    try {
      const res = await get<VerificationResponse>(
        `/api/v1/auth/register/verify?token=${encodeURIComponent(token)}`
      );
      setResponse(res);
      setIsSuccess(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ status: number; message: string }>;
      if (axiosError.response) {
        setError(
          axiosError.response.data?.message ||
            "Invalid or expired verification token."
        );
      } else {
        setError("Network error. Please try again later.");
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setResponse(null);
  }, []);

  return { isLoading, isSuccess, error, response, verify, reset };
};

export default useVerification;
