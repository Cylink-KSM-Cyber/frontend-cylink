import { EditUrlFormData, EditUrlFormResponse } from "@/interfaces/url";
import Cookies from "js-cookie";
import { useState } from "react";

export const useEditUrl = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editUrl = async (id: number, formData: EditUrlFormData) => {
    console.log("[DEBUG] useEditUrl - Starting URL edit with ID:", id);
    console.log(
      "[DEBUG] useEditUrl - Edit form data:",
      JSON.stringify(formData, null, 2)
    );

    setIsEditing(true);
    setError(null);

    const token = Cookies.get("accessToken");
    console.log("[DEBUG] useEditUrl - Auth token available:", !!token);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/urls/${id}`;
      console.log("[DEBUG] useEditUrl - Making PUT request to:", apiUrl);

      // Ensure the date is in the correct format for the API
      // The API expects a full ISO date string, but our form has YYYY-MM-DD
      let expiryDate = formData.expiryDate;
      if (expiryDate && !expiryDate.includes("T")) {
        // If it's just a date without time (YYYY-MM-DD), convert to ISO format
        expiryDate = new Date(expiryDate).toISOString();
        console.log(
          "[DEBUG] useEditUrl - Formatted expiry date for API:",
          expiryDate
        );
      }

      // Prepare request body with correct field mappings
      const requestBody = {
        title: formData.title,
        original_url: formData.originalUrl,
        short_code: formData.customCode || "", // Using short_code instead of custom_code
        expiry_date: expiryDate,
      };

      console.log(
        "[DEBUG] useEditUrl - Request body:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
        credentials: "same-origin",
      });

      console.log("[DEBUG] useEditUrl - Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[DEBUG] useEditUrl - Error response:", errorData);
        throw new Error(errorData.message || "Failed to edit URL");
      }

      const responseData = await response.json();
      console.log(
        "[DEBUG] useEditUrl - Success response:",
        JSON.stringify(responseData, null, 2)
      );
      return responseData as EditUrlFormResponse;
    } catch (err) {
      console.error("[DEBUG] useEditUrl - Error in editUrl:", err);
      const error =
        err instanceof Error ? err : new Error("Failed to edit URL");
      setError(error);
      throw error;
    } finally {
      setIsEditing(false);
      console.log("[DEBUG] useEditUrl - Edit operation completed");
    }
  };

  return {
    editUrl,
    isEditing,
    error,
  };
};
