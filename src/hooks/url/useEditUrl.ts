import { EditUrlFormData, EditUrlFormResponse } from "@/interfaces/url";
import Cookies from "js-cookie";
import { useState } from "react";

export const useEditUrl = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editUrl = async (id: number, formData: EditUrlFormData) => {
    setIsEditing(true);
    setError(null);

    const token = Cookies.get("accessToken");

    try {
      // Create the payload according to the backend API requirements
      const payload = {
        title: formData.title,
        original_url: formData.originalUrl,
        expiry_date: formData.expiryDate,
        short_code: formData.shortCode || "",
      };

      // Debug logging removed to prevent unintended exposure of payload data

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/urls/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit URL");
      }

      const responseData = await response.json();
      return responseData as EditUrlFormResponse;
    } catch (err) {
      console.error("Error in editUrl:", err);
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
