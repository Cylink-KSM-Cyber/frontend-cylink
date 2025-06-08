"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QrCodeCreateFormSchema,
  qrCodeCreateSchema,
  getDefaultExpiryDate,
} from "@/utils/qrcode-validators";
import { QR_CREATION_STEPS } from "@/config/qrcode";
import { Url } from "@/interfaces/url";

/**
 * QR Creation Flow Hook
 * @description Manages the step-by-step QR code creation flow and form state
 */
export const useQrCreationFlow = (
  createUrl: (data: {
    title: string;
    original_url: string;
    custom_code?: string;
    expiry_date: string;
  }) => Promise<Url>,
  onCreated: () => void
) => {
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingUrl, setIsCreatingUrl] = useState(false);

  // Form state with validation
  const form = useForm<QrCodeCreateFormSchema>({
    resolver: zodResolver(qrCodeCreateSchema),
    defaultValues: {
      urlSource: "existing",
      existingUrlId: null,
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: getDefaultExpiryDate(),
    },
  });

  // Watch form values for reactive updates
  const urlSource = form.watch("urlSource");
  const existingUrlId = form.watch("existingUrlId");
  const title = form.watch("title");
  const originalUrl = form.watch("originalUrl");

  /**
   * Generate preview URL based on current form state
   */
  const generatePreviewUrl = useCallback(
    (selectedUrl: Url | null): string => {
      if (urlSource === "existing" && selectedUrl) {
        return selectedUrl.short_url;
      }

      if (urlSource === "new" && originalUrl) {
        // For new URLs, show a preview format
        return `https://cylink.co/${form.getValues("customCode") || "preview"}`;
      }

      return "https://cylink.co/preview";
    },
    [urlSource, originalUrl, form]
  );

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    if (currentStep < QR_CREATION_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Go to specific step
   */
  const goToStep = (step: number) => {
    if (step >= 1 && step <= QR_CREATION_STEPS.length) {
      setCurrentStep(step);
    }
  };

  /**
   * Validate current step
   */
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      // Step 1: URL selection validation
      if (urlSource === "existing") {
        return (
          existingUrlId !== null &&
          existingUrlId !== undefined &&
          existingUrlId !== ""
        );
      }

      if (urlSource === "new") {
        const values = form.getValues();
        return !!(values.title && values.originalUrl && values.expiryDate);
      }
    }

    if (currentStep === 2) {
      // Step 2: Always valid (customization is optional)
      return true;
    }

    return false;
  };

  /**
   * Handle step 1 form submission (URL selection/creation)
   */
  const handleStep1Submit = async (): Promise<{
    success: boolean;
    url?: Url;
    error?: string;
  }> => {
    if (!validateCurrentStep()) {
      return { success: false, error: "Please complete all required fields" };
    }

    // If using existing URL, no need to create
    if (urlSource === "existing") {
      return { success: true };
    }

    // Create new URL
    if (urlSource === "new") {
      setIsCreatingUrl(true);

      try {
        const formData = form.getValues();
        const newUrl = await createUrl({
          title: formData.title!,
          original_url: formData.originalUrl!,
          custom_code: formData.customCode || undefined,
          expiry_date: formData.expiryDate!,
        });

        return { success: true, url: newUrl };
      } catch (error) {
        console.error("Error creating URL:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create URL",
        };
      } finally {
        setIsCreatingUrl(false);
      }
    }

    return { success: false, error: "Invalid URL source" };
  };

  /**
   * Reset the entire flow
   */
  const resetFlow = () => {
    setCurrentStep(1);
    setIsCreatingUrl(false);
    form.reset({
      urlSource: "existing",
      existingUrlId: null,
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: getDefaultExpiryDate(),
    });
  };

  /**
   * Initialize the flow
   */
  const initializeFlow = () => {
    // Set default expiry date if not already set
    if (!form.getValues("expiryDate")) {
      form.setValue("expiryDate", getDefaultExpiryDate());
    }
  };

  /**
   * Handle flow completion
   */
  const completeFlow = () => {
    onCreated();
    resetFlow();
  };

  /**
   * Get current step information
   */
  const getCurrentStepInfo = () => {
    return QR_CREATION_STEPS.find((step) => step.id === currentStep);
  };

  /**
   * Check if flow can proceed to next step
   */
  const canProceed = validateCurrentStep();

  /**
   * Check if this is the final step
   */
  const isFinalStep = currentStep === QR_CREATION_STEPS.length;

  /**
   * Check if this is the first step
   */
  const isFirstStep = currentStep === 1;

  return {
    // Form state
    form,
    urlSource,
    existingUrlId,
    title,
    originalUrl,

    // Step state
    currentStep,
    isFirstStep,
    isFinalStep,
    canProceed,

    // Flow state
    isCreatingUrl,

    // Actions
    nextStep,
    previousStep,
    goToStep,
    handleStep1Submit,
    resetFlow,
    initializeFlow,
    completeFlow,
    validateCurrentStep,

    // Computed values
    generatePreviewUrl,
    getCurrentStepInfo,

    // Configuration
    steps: QR_CREATION_STEPS,
  };
};
