"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { deleteUrlById } from "@/services/url";

/**
 * Custom hook for URL deletion
 * @description Provides functionality to delete URLs with loading and error states
 * @returns URL deletion methods and state
 */
export const useDeleteUrl = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  /**
   * Delete a URL by ID
   * @param id - ID of the URL to delete
   * @returns Promise resolving to the success status
   */
  const deleteUrl = useCallback(
    async (id: number): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);

      try {
        const response = await deleteUrlById(id);

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

        // Display error toast
        showToast(errorMessage, "error", 4000);

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [showToast]
  );

  return {
    deleteUrl,
    isDeleting,
    error,
  };
};

export default useDeleteUrl;
