"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchUrls } from "@/services/url";
import { Url } from "@/interfaces/url";
import { useQrCode } from "@/hooks/useQrCode";

/**
 * Zod schema for QR code creation form validation
 */
export const qrCodeCreateSchema = z
  .object({
    urlSource: z.enum(["existing", "new"]),
    existingUrlId: z.union([z.number(), z.string()]).optional().nullable(),
    title: z.string().optional(),
    originalUrl: z.string().url("Please enter a valid URL").optional(),
    customCode: z.string().optional(),
    expiryDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If using existing URL, validate existingUrlId
      if (data.urlSource === "existing") {
        return (
          data.existingUrlId !== null &&
          data.existingUrlId !== undefined &&
          data.existingUrlId !== ""
        );
      }

      // If creating new URL, validate required fields
      if (data.urlSource === "new") {
        return !!data.title && !!data.originalUrl && !!data.expiryDate;
      }

      return false;
    },
    {
      message: "Please complete all required fields",
      path: ["urlSource"],
    }
  );

export type QrCodeCreateFormSchema = z.infer<typeof qrCodeCreateSchema>;

/**
 * Custom hook for managing QR code creation process
 *
 * @param createUrl - Function to create a new URL
 * @param onCreated - Callback function when QR code is created successfully
 * @returns QR code creation state and handlers
 */
export const useQrCodeCreation = (
  createUrl: (data: {
    title: string;
    original_url: string;
    custom_code?: string;
    expiry_date: string;
  }) => Promise<Url>,
  onCreated: () => void
) => {
  // QR Code hook
  const qrCodeHook = useQrCode();

  // Form state with validation
  const form = useForm<QrCodeCreateFormSchema>({
    resolver: zodResolver(qrCodeCreateSchema),
    defaultValues: {
      urlSource: "existing",
      existingUrlId: undefined,
      title: "",
      originalUrl: "",
      customCode: "",
      expiryDate: "",
    },
  });

  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [existingUrls, setExistingUrls] = useState<Url[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const [selectedUrlForQrCode, setSelectedUrlForQrCode] = useState<Url | null>(
    null
  );
  const [isCreatingUrl, setIsCreatingUrl] = useState(false);

  // Refs for tracking API fetch state
  const urlsFetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false);

  // Watch URL source selection
  const urlSource = form.watch("urlSource");
  const existingUrlId = form.watch("existingUrlId");

  // Set default expiry date to 30 days from now
  useEffect(() => {
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);
    form.setValue("expiryDate", defaultExpiryDate.toISOString().split("T")[0]);
  }, [form]);

  // Update preview URL when an existing URL is selected
  useEffect(() => {
    if (urlSource === "existing" && existingUrlId) {
      const selected = existingUrls.find((url) => url.id == existingUrlId);
      if (selected) {
        setPreviewUrl(selected.short_url);
      }
    } else if (urlSource === "new") {
      // Use a placeholder for new URL previews
      setPreviewUrl("https://example.com/your-url");
    }
  }, [urlSource, existingUrlId, existingUrls]);

  // Fetch existing URLs
  const fetchExistingUrls = useCallback(async () => {
    // Prevent multiple concurrent fetch requests
    if (fetchInProgressRef.current) {
      return;
    }

    // Skip if we already have the data and not explicitly refreshing
    if (urlsFetchedRef.current && existingUrls.length > 0) {
      return;
    }

    fetchInProgressRef.current = true;
    setIsLoadingUrls(true);

    try {
      const response = await fetchUrls({
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
        status: "active", // Only fetch active URLs that are not expired
      });
      setExistingUrls(response.data || []);
      urlsFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setIsLoadingUrls(false);
      fetchInProgressRef.current = false;
    }
  }, [existingUrls.length]);

  // Reset form and state
  const resetState = useCallback(() => {
    form.reset();
    setCurrentStep(1);
    setPreviewUrl("");
    setSelectedUrlForQrCode(null);
    qrCodeHook.resetQrCode();
    // Don't reset urlsFetchedRef to keep the cache
  }, [form, qrCodeHook]);

  // Initialize
  const initialize = useCallback(() => {
    // We don't need to load colors in the initial step - we'll load them when the user moves to step 2
    // qrCodeHook.loadColors(); - removed

    qrCodeHook.resetQrCode();
    setSelectedUrlForQrCode(null);

    // Only fetch URLs if we haven't already or if we have no URLs
    if (!urlsFetchedRef.current || existingUrls.length === 0) {
      fetchExistingUrls();
    }
  }, [qrCodeHook, fetchExistingUrls, existingUrls.length]);

  // Force refresh URLs (for use when needed)
  const refreshUrls = useCallback(() => {
    urlsFetchedRef.current = false;
    fetchExistingUrls();
  }, [fetchExistingUrls]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: QrCodeCreateFormSchema) => {
      try {
        // Step 1: URL Selection
        if (currentStep === 1) {
          if (data.urlSource === "existing") {
            // Handle existing URL selection
            if (!data.existingUrlId) {
              alert("Please select a URL");
              return;
            }

            // Find the selected URL
            const selectedUrl = existingUrls.find(
              (url) => url.id == data.existingUrlId
            );
            if (!selectedUrl) {
              console.error("Selected URL not found:", data.existingUrlId);
              alert("Selected URL not found. Please try again.");
              return;
            }

            // Set the URL and proceed to next step
            setSelectedUrlForQrCode(selectedUrl);
            setPreviewUrl(selectedUrl.short_url);
            setCurrentStep(2);
          } else if (data.urlSource === "new") {
            // Handle new URL creation
            if (!data.title || !data.originalUrl || !data.expiryDate) {
              alert("Please fill in all required fields");
              return;
            }

            setIsCreatingUrl(true);
            try {
              // Create new URL
              const newUrl = await createUrl({
                title: data.title,
                original_url: data.originalUrl,
                custom_code: data.customCode || undefined,
                expiry_date: data.expiryDate,
              });

              // Set the URL and proceed to next step
              setSelectedUrlForQrCode(newUrl);
              setPreviewUrl(newUrl.short_url);
              setCurrentStep(2);

              // Force refresh URLs on next modal open to include the newly created URL
              urlsFetchedRef.current = false;
            } catch (error) {
              console.error("Error creating URL:", error);
              alert("Failed to create URL. Please try again.");
            } finally {
              setIsCreatingUrl(false);
            }
          }
        }
        // Step 2: QR Code Generation
        else if (currentStep === 2) {
          if (!selectedUrlForQrCode) {
            console.error("No URL selected for QR code generation");
            alert("Please select a URL first");
            setCurrentStep(1);
            return;
          }

          await qrCodeHook.generateQrCodeForUrl(selectedUrlForQrCode);
        }
      } catch (error) {
        console.error("Error in QR code creation process:", error);
        alert("An error occurred. Please try again.");
      }
    },
    [currentStep, existingUrls, createUrl, selectedUrlForQrCode, qrCodeHook]
  );

  // Handle final submission
  const handleFinish = useCallback(() => {
    onCreated();
    resetState();
  }, [onCreated, resetState]);

  return {
    // Form
    form,
    handleFormSubmit,
    resetState,
    initialize,
    refreshUrls,

    // State
    currentStep,
    setCurrentStep,
    previewUrl,
    existingUrls,
    isLoadingUrls,
    selectedUrlForQrCode,
    isCreatingUrl,
    handleFinish,

    // QR code state and functions
    ...qrCodeHook,
  };
};
