"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { deleteUrlById } from "@/services/url";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { Url } from "@/interfaces/url";

/**
 * Custom hook for URL deletion
 * @description Provides functionality to delete URLs with loading and error states
 * @returns URL deletion methods and state
 */
export const useDeleteUrl = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();
  const { trackUrlDeletion } = useConversionTracking();

  /**
   * Delete a URL by ID
   * @param id - ID of the URL to delete
   * @param urlData - URL data for tracking purposes
   * @returns Promise resolving to the success status
   */
  const deleteUrl = useCallback(
    async (id: number, urlData?: Url): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deleteUrlById(id);

        // Track URL deletion conversion goal in PostHog
        if (urlData) {
          trackUrlDeletion({
            url_id: urlData.id,
            url_title: urlData.title || "Untitled",
            short_code: urlData.short_url,
            original_url_length: urlData.original_url.length,
            total_clicks: urlData.clicks,
            deletion_method: "manual",
            success: true,
          });
        }

        // Display success toast with white background as requested
        showToast(
          `Successfully deleted URL "${response.data.short_code}"`,
          "white",
          4000
        );

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete URL";

        setError(err instanceof Error ? err : new Error(errorMessage));

        // Track failed deletion if we have URL data
        if (urlData) {
          trackUrlDeletion({
            url_id: urlData.id,
            url_title: urlData.title || "Untitled",
            short_code: urlData.short_url,
            original_url_length: urlData.original_url.length,
            total_clicks: urlData.clicks,
            deletion_method: "manual",
            deletion_reason: errorMessage,
            success: false,
          });
        }

        // Display error toast
        showToast(errorMessage, "error", 4000);

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [showToast, trackUrlDeletion]
  );

  return {
    deleteUrl,
    isDeleting,
    error,
  };
};

export default useDeleteUrl;
