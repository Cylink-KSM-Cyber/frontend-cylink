"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { useQrCode } from "@/hooks/useQrCode";
import { fetchUrls } from "@/services/url";
import { Url } from "@/interfaces/url";
import {
  RiLinkM,
  RiQrCodeLine,
  RiDownload2Line,
  RiShareLine,
} from "react-icons/ri";

/**
 * CreateQrCodeModal props
 * @interface CreateQrCodeModalProps
 */
interface CreateQrCodeModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose: () => void;
  /** Function to call when QR code is created */
  onCreated: () => void;
  /** Function to create a new URL and return it */
  createUrl: (data: {
    title: string;
    original_url: string;
    custom_code?: string;
    expiry_date: string;
  }) => Promise<Url>;
  /** Whether URL creation is in progress */
  isCreatingUrl?: boolean;
}

/**
 * Zod schema for form validation
 */
const qrCodeCreateSchema = z
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

type QrCodeCreateFormSchema = z.infer<typeof qrCodeCreateSchema>;

/**
 * CreateQrCodeModal Component
 * @description Modal for creating new QR codes with URL selection/creation and customization options
 */
const CreateQrCodeModal: React.FC<CreateQrCodeModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  createUrl,
  isCreatingUrl = false,
}) => {
  // Form state with validation
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QrCodeCreateFormSchema>({
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

  // QR Code customization
  const {
    foregroundColors,
    backgroundColors,
    selectedForegroundColor,
    selectedBackgroundColor,
    includeLogoChecked,
    errorCorrectionLevel,
    isLoading,
    isGenerating,
    generatedQrUrl,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setErrorCorrectionLevel,
    loadColors,
    generateQrCodeForUrl,
    resetQrCode,
    logoSize,
    setLogoSize,
  } = useQrCode();

  // State for existing URLs
  const [existingUrls, setExistingUrls] = useState<Url[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);

  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  // Store the URL object for use in step 2
  const [selectedUrlForQrCode, setSelectedUrlForQrCode] = useState<Url | null>(
    null
  );

  // Watch URL source selection
  const urlSource = watch("urlSource");
  const existingUrlId = watch("existingUrlId");

  // Load QR code colors when modal opens
  useEffect(() => {
    if (isOpen) {
      loadColors();
      resetQrCode();
      setSelectedUrlForQrCode(null);

      // Also load existing URLs
      fetchExistingUrls();
    }
  }, [isOpen, loadColors, resetQrCode]);

  // Set default expiry date to 30 days from now
  useEffect(() => {
    if (isOpen) {
      const defaultExpiryDate = new Date();
      defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);

      setValue("expiryDate", defaultExpiryDate.toISOString().split("T")[0]);
    }
  }, [isOpen, setValue]);

  // Update preview URL when an existing URL is selected
  useEffect(() => {
    if (urlSource === "existing" && existingUrlId) {
      const selected = existingUrls.find((url) => url.id === existingUrlId);
      if (selected) {
        setPreviewUrl(selected.short_url);
      }
    } else if (urlSource === "new") {
      // Use a placeholder for new URL previews
      setPreviewUrl("https://example.com/your-url");
    }
  }, [urlSource, existingUrlId, existingUrls]);

  // Fetch existing URLs
  const fetchExistingUrls = async () => {
    setIsLoadingUrls(true);
    try {
      const response = await fetchUrls({
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setExistingUrls(response.data || []);
    } catch (error) {
      console.error("Error fetching URLs:", error);
    } finally {
      setIsLoadingUrls(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: QrCodeCreateFormSchema) => {
    console.log("Form submitted:", data);
    console.log("Current step:", currentStep);

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
          console.log("Selected existing URL:", selectedUrl);
          setSelectedUrlForQrCode(selectedUrl);
          setPreviewUrl(selectedUrl.short_url);
          setCurrentStep(2);
        } else if (data.urlSource === "new") {
          // Handle new URL creation
          if (!data.title || !data.originalUrl || !data.expiryDate) {
            alert("Please fill in all required fields");
            return;
          }

          try {
            // Create new URL
            const newUrl = await createUrl({
              title: data.title,
              original_url: data.originalUrl,
              custom_code: data.customCode || undefined,
              expiry_date: data.expiryDate,
            });

            // Set the URL and proceed to next step
            console.log("Created new URL:", newUrl);
            setSelectedUrlForQrCode(newUrl);
            setPreviewUrl(newUrl.short_url);
            setCurrentStep(2);
          } catch (error) {
            console.error("Error creating URL:", error);
            alert("Failed to create URL. Please try again.");
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

        console.log("Generating QR code for URL:", selectedUrlForQrCode);
        await generateQrCodeForUrl(selectedUrlForQrCode);
      }
    } catch (error) {
      console.error("Error in QR code creation process:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    setCurrentStep(1);
    setPreviewUrl("");
    onClose();
  };

  // Handle Download QR Code button click
  const handleDownloadClick = () => {
    if (!generatedQrUrl) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = generatedQrUrl;
    a.download = `qrcode-${previewUrl.split("/").pop() || "link"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Share QR Code button click
  const handleShareClick = async () => {
    if (!generatedQrUrl || !previewUrl) return;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${previewUrl}`,
          text: `Scan this QR code to visit ${previewUrl}`,
          url: previewUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(previewUrl);
      alert("URL copied to clipboard!");
    }
  };

  // Handle Reset/Customize Again button click
  const handleResetClick = () => {
    resetQrCode();
  };

  // Render URL selection step
  const renderUrlSelectionStep = () => (
    <div className="space-y-4">
      {/* URL Selection Method */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select URL Source
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="existing"
              {...register("urlSource")}
              className="mr-2"
            />
            <span>Use Existing URL</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="new"
              {...register("urlSource")}
              className="mr-2"
            />
            <span>Create New URL</span>
          </label>
        </div>
      </div>

      {/* Existing URL Selection */}
      {urlSource === "existing" && (
        <div className="mb-4">
          <label
            htmlFor="existingUrlId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select URL <span className="text-red-500">*</span>
          </label>
          <select
            id="existingUrlId"
            {...register("existingUrlId", {
              valueAsNumber: true,
              required: urlSource === "existing",
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoadingUrls}
          >
            <option value="">Select a URL</option>
            {existingUrls.map((url) => (
              <option key={url.id} value={url.id}>
                {url.title} ({url.short_url})
              </option>
            ))}
          </select>
          {errors.existingUrlId && (
            <p className="mt-1 text-sm text-red-600">Please select a URL</p>
          )}
          {isLoadingUrls && (
            <p className="mt-1 text-sm text-gray-500">Loading URLs...</p>
          )}
        </div>
      )}

      {/* New URL Creation Form */}
      {urlSource === "new" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter a memorable title"
              {...register("title")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="originalUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Original URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="originalUrl"
              placeholder="https://"
              {...register("originalUrl")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Back-half (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                cylink.co/
              </span>
              <input
                type="text"
                id="customCode"
                placeholder="custom-url"
                {...register("customCode")}
                className="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.customCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customCode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              {...register("expiryDate")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render QR code customization step
  const renderCustomizationStep = () => (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* QR Code Preview */}
      <div className="flex items-center justify-center lg:w-1/2">
        <QrCodePreview
          foregroundColor={selectedForegroundColor?.hex || "#000000"}
          backgroundColor={selectedBackgroundColor?.hex || "#FFFFFF"}
          includeLogoChecked={includeLogoChecked}
          generatedQrUrl={generatedQrUrl}
          isLoading={isLoading || isGenerating}
          value={previewUrl}
          errorCorrectionLevel={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
          size={280}
          logoSize={logoSize}
        />
      </div>

      {/* Customization Options */}
      <div className="lg:w-1/2">
        {!generatedQrUrl ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Customize Your QR Code
            </h3>

            {/* Foreground Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foreground Color
              </label>
              <div className="flex flex-wrap gap-2">
                {foregroundColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedForegroundColor?.hex === color.hex
                        ? "border-blue-500 shadow-md scale-110"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedForegroundColor(color)}
                    disabled={isLoading || isGenerating}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Background Color Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedBackgroundColor?.hex === color.hex
                        ? "border-blue-500 shadow-md scale-110"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedBackgroundColor(color)}
                    disabled={isLoading || isGenerating}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            {/* Logo Inclusion Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeLogoChecked}
                  onChange={(e) => setIncludeLogoChecked(e.target.checked)}
                  disabled={isLoading || isGenerating}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Include KSM Logo
                </span>
              </label>
              {includeLogoChecked && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Logo Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={logoSize * 100}
                    onChange={(e) => setLogoSize(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isLoading || isGenerating}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Correction Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "L",
                    label: "Low (7%)",
                    description: "Best for clean environments",
                  },
                  {
                    value: "M",
                    label: "Medium (15%)",
                    description: "Balanced recovery",
                  },
                  {
                    value: "Q",
                    label: "Quartile (25%)",
                    description: "Better recovery",
                  },
                  {
                    value: "H",
                    label: "High (30%)",
                    description: "Best with logo overlay",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setErrorCorrectionLevel(option.value)}
                    disabled={
                      isLoading ||
                      isGenerating ||
                      (includeLogoChecked && option.value !== "H")
                    }
                    className={`p-2 text-left text-sm rounded border ${
                      errorCorrectionLevel === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${
                      includeLogoChecked && option.value !== "H"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* URL Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Short URL
              </div>
              <div className="text-sm font-medium text-black">{previewUrl}</div>

              {urlSource === "existing" && existingUrlId && (
                <>
                  <div className="text-xs font-medium text-gray-500 mt-3 mb-1">
                    Original URL
                  </div>
                  <div className="text-sm text-gray-700 break-all">
                    {(() => {
                      const url = existingUrls.find(
                        (u) => u.id === existingUrlId
                      );
                      const original = url?.original_url || "";
                      return original.length > 40
                        ? `${original.substring(0, 40)}...`
                        : original;
                    })()}
                  </div>
                </>
              )}

              {urlSource === "new" && (
                <>
                  <div className="text-xs font-medium text-gray-500 mt-3 mb-1">
                    Original URL
                  </div>
                  <div className="text-sm text-gray-700 break-all">
                    {(() => {
                      const originalUrl = watch("originalUrl");
                      return originalUrl && originalUrl.length > 40
                        ? `${originalUrl.substring(0, 40)}...`
                        : originalUrl || "";
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              QR Code Generated
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your QR code has been generated successfully. You can download it
              or share it using the buttons below.
            </p>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Short URL
              </div>
              <div className="text-sm font-medium text-black">{previewUrl}</div>

              <div className="flex justify-between mt-3">
                <div>
                  <div className="text-xs font-medium text-gray-500">
                    Created
                  </div>
                  <div className="text-sm text-gray-700">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500">Size</div>
                  <div className="text-sm text-gray-700">280×280px</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Determine footer buttons based on current step
  const renderFooterButtons = () => (
    <>
      {!generatedQrUrl ? (
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isCreatingUrl || isGenerating}
          >
            Cancel
          </Button>

          {currentStep === 1 ? (
            <Button
              variant="primary"
              onClick={() => {
                // Manually trigger form validation and submission
                const formData = {
                  urlSource: watch("urlSource"),
                  existingUrlId: watch("existingUrlId"),
                  title: watch("title"),
                  originalUrl: watch("originalUrl"),
                  customCode: watch("customCode"),
                  expiryDate: watch("expiryDate"),
                };

                console.log("Direct form submission with data:", formData);
                handleFormSubmit(formData);
              }}
              disabled={isCreatingUrl}
              loading={isCreatingUrl}
              startIcon={<RiLinkM />}
            >
              {isCreatingUrl ? "Processing..." : "Next: Customize QR"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                // Directly call the handler for step 2
                handleFormSubmit({
                  urlSource: watch("urlSource"),
                  existingUrlId: watch("existingUrlId"),
                });
              }}
              disabled={
                isGenerating ||
                !selectedForegroundColor ||
                !selectedBackgroundColor
              }
              loading={isGenerating}
              startIcon={<RiQrCodeLine />}
            >
              {isGenerating ? "Generating..." : "Create QR Code"}
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            onClick={handleResetClick}
            startIcon={<RiQrCodeLine />}
          >
            Customize Again
          </Button>
          <Button
            variant="primary"
            onClick={handleDownloadClick}
            startIcon={<RiDownload2Line />}
          >
            Download
          </Button>
          <Button
            variant="primary"
            onClick={handleShareClick}
            startIcon={<RiShareLine />}
          >
            Share
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onCreated();
              handleClose();
            }}
            startIcon={<RiQrCodeLine />}
          >
            Done
          </Button>
        </>
      )}
    </>
  );

  return (
    <Modal
      title={
        currentStep === 1
          ? "Create New QR Code - Select URL"
          : "Create New QR Code - Customize"
      }
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      size={currentStep === 1 ? "md" : "lg"}
      overlayStyle="glassmorphism"
      footer={renderFooterButtons()}
      className="max-h-[90vh] my-auto"
    >
      <div className="py-2 overflow-y-auto max-h-[calc(90vh-160px)]">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-12 h-1 ${
                  currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs text-center w-20">Select URL</div>
            <div className="text-xs text-center w-20">Customize</div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1
          ? renderUrlSelectionStep()
          : renderCustomizationStep()}
      </div>
    </Modal>
  );
};

export default CreateQrCodeModal;
