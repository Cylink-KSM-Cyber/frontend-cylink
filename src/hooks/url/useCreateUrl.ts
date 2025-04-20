import { CreateUrlFormData, CreateUrlFormResponse } from "@/interfaces/url";
import { useState } from "react";
import Cookies from "js-cookie";

export const useCreateUrl = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUrl = async (formData: CreateUrlFormData) => {
    setIsCreating(true);
    setError(null);

    const token = Cookies.get("accessToken");

    try {
      const response = await fetch("http://localhost:5000/api/v1/urls", {
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
          goal_id: 1,
        }),
        credentials: "same-origin",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create URL");
      }

      const responseData = await response.json();
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
