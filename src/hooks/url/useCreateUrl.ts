import { CreateUrlFormData, CreateUrlFormResponse } from "@/interfaces/url";
import Cookies from "js-cookie";
import { useState } from "react";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * URL Creation Hook
 * @description Custom hook for creating URLs with PostHog conversion tracking
 * @returns URL creation functions and state
 */
export const useCreateUrl = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { trackUrlCreation } = useConversionTracking();

  /**
   * Create a new URL with PostHog conversion tracking
   * @param formData - URL creation form data
   * @returns Promise with the created URL response
   */
  const createUrl = async (formData: CreateUrlFormData) => {
    setIsCreating(true);
    setError(null);

    const token = Cookies.get("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/urls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            original_url: formData.originalUrl,
            custom_code: formData.customCode || "",
            expiry_date: formData.expiryDate,
          }),
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create URL");
      }

      const responseData = await response.json();

      // Track URL creation conversion goal in PostHog
      trackUrlCreation({
        url_id: responseData.data.id,
        url_title: formData.title,
        has_custom_code: !!formData.customCode,
        custom_code_length: formData.customCode?.length || 0,
        expiry_date: formData.expiryDate,
        original_url_length: formData.originalUrl.length,
        creation_method: "manual", // or 'qr_code_flow' if called from QR creation
        success: true,
      });

      return responseData as CreateUrlFormResponse;
    } catch (err) {
      console.error("Error in createUrl:", err);
      const error =
        err instanceof Error ? err : new Error("Failed to create URL");
      setError(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createUrl,
    isCreating,
    error,
  };
};

export default useCreateUrl;
