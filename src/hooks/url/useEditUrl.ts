import { EditUrlFormData, EditUrlFormResponse } from "@/interfaces/url";
import Cookies from "js-cookie";
import { useState } from "react";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * Custom hook for editing URL entries
 * @returns Object containing the editUrl function, loading state, and any errors
 */
export const useEditUrl = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { trackUrlEdit } = useConversionTracking();

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

      // Track URL edit conversion goal in PostHog
      const originalUrl =
        responseData.data?.original_url || formData.originalUrl;
      const fieldsModified = [];

      // Determine which fields were modified
      if (formData.title !== responseData.data?.title)
        fieldsModified.push("title");
      if (formData.originalUrl !== originalUrl)
        fieldsModified.push("original_url");
      if (formData.customCode !== responseData.data?.short_code)
        fieldsModified.push("custom_code");
      if (formData.expiryDate !== responseData.data?.expiry_date)
        fieldsModified.push("expiry_date");

      trackUrlEdit({
        url_id: id,
        url_title: formData.title || responseData.data?.title || "",
        has_custom_code: !!(
          formData.customCode || responseData.data?.short_code
        ),
        custom_code_length: (
          formData.customCode ||
          responseData.data?.short_code ||
          ""
        ).length,
        expiry_date:
          formData.expiryDate || responseData.data?.expiry_date || "",
        original_url_length: originalUrl.length,
        edit_method: "manual",
        fields_modified:
          fieldsModified.length > 0 ? fieldsModified : ["unknown"],
        success: true,
      });

      return responseData as EditUrlFormResponse;
    } catch (err) {
      console.error("Error in URL edit operation:", err);
      const error =
        err instanceof Error ? err : new Error("Failed to edit URL");
      setError(error);

      // Track failed URL edit conversion goal in PostHog
      trackUrlEdit({
        url_id: id,
        url_title: formData.title || "",
        has_custom_code: !!formData.customCode,
        custom_code_length: formData.customCode?.length || 0,
        expiry_date: formData.expiryDate || "",
        original_url_length: formData.originalUrl.length,
        edit_method: "manual",
        fields_modified: ["unknown"],
        success: false,
      });

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
