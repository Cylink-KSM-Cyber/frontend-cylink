import { EditUrlFormData, EditUrlFormResponse } from "@/interfaces/url";
import Cookies from "js-cookie";
import { useState } from "react";

/**
 * Custom hook for editing URL entries
 * @returns Object containing the editUrl function, loading state, and any errors
 */
export const useEditUrl = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Edit a URL entry
   * @param {number} id - The ID of the URL to edit
   * @param {EditUrlFormData} formData - The new data for the URL
   * @returns {Promise<EditUrlFormResponse>} The response from the API
   * @throws {Error} If the edit operation fails
   */
  const editUrl = async (id: number, formData: EditUrlFormData) => {
    setIsEditing(true);
    setError(null);

    const token = Cookies.get("accessToken");

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/urls/${id}`;

      // Ensure the date is in the correct format for the API
      // The API expects a full ISO date string, but our form has YYYY-MM-DD
      let expiryDate = formData.expiryDate;
      if (expiryDate && !expiryDate.includes("T")) {
        // If it's just a date without time (YYYY-MM-DD), convert to ISO format
        expiryDate = new Date(expiryDate).toISOString();
      }

      // Prepare request body with correct field mappings
      const requestBody = {
        title: formData.title,
        original_url: formData.originalUrl,
        short_code: formData.customCode || "", // Using short_code instead of custom_code
        expiry_date: expiryDate,
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
        credentials: "same-origin",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to edit URL:", errorData);
        throw new Error(errorData.message || "Failed to edit URL");
      }

      const responseData = await response.json();
      return responseData as EditUrlFormResponse;
    } catch (err) {
      console.error("Error in URL edit operation:", err);
      const error =
        err instanceof Error ? err : new Error("Failed to edit URL");
      setError(error);
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  return {
    editUrl,
    isEditing,
    error,
  };
};
