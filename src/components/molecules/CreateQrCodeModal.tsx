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
import { RiLinkM, RiQrCodeLine } from "react-icons/ri";

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
    existingUrlId: z.number().optional().nullable(),
    title: z.string().optional(),
    originalUrl: z.string().url("Please enter a valid URL").optional(),
    customCode: z.string().optional(),
    expiryDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If using existing URL, validate existingUrlId
      if (data.urlSource === "existing") {
        return !!data.existingUrlId;
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
    handleSubmit,
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

  // Watch URL source selection
  const urlSource = watch("urlSource");
  const existingUrlId = watch("existingUrlId");

  // Load QR code colors when modal opens
  useEffect(() => {
    if (isOpen) {
      loadColors();
      resetQrCode();

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
    try {
      let urlToUse: Url | null = null;

      // If using existing URL
      if (data.urlSource === "existing" && data.existingUrlId) {
        urlToUse =
          existingUrls.find((url) => url.id === data.existingUrlId) || null;
      }
      // If creating new URL
      else if (
        data.urlSource === "new" &&
        data.title &&
        data.originalUrl &&
        data.expiryDate
      ) {
        urlToUse = await createUrl({
          title: data.title,
          original_url: data.originalUrl,
          custom_code: data.customCode,
          expiry_date: data.expiryDate,
        });
      }

      // Generate QR code for the URL
      if (urlToUse) {
        if (currentStep === 1) {
          setPreviewUrl(urlToUse.short_url);
          setCurrentStep(2);
        } else if (currentStep === 2) {
          await generateQrCodeForUrl(urlToUse);
          setTimeout(() => {
            onCreated();
            handleClose();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error in QR code creation:", error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    setCurrentStep(1);
    setPreviewUrl("");
    onClose();
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
              setValueAs: (value) => (value ? Number(value) : undefined),
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
    <div className="flex flex-col md:flex-row gap-6">
      {/* QR Code Preview */}
      <div className="flex items-center justify-center md:w-1/2">
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
      <div className="md:w-1/2">
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Customize QR Code
        </h3>

        {/* Foreground Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Logo Option */}
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeLogoChecked}
              onChange={(e) => setIncludeLogoChecked(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2"
            />
            <span className="text-sm text-gray-700">Include Logo</span>
          </label>
          {includeLogoChecked && (
            <>
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
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Adding a logo will automatically increase error correction to
                ensure scannability.
              </p>
            </>
          )}
        </div>

        {/* Error Correction Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Error Correction Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "L", label: "Low (7%)" },
              { value: "M", label: "Medium (15%)" },
              { value: "Q", label: "Quartile (25%)" },
              { value: "H", label: "High (30%)" },
            ].map((level) => (
              <button
                key={level.value}
                type="button"
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  errorCorrectionLevel === level.value
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                } ${
                  includeLogoChecked && level.value !== "H"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => setErrorCorrectionLevel(level.value)}
                disabled={includeLogoChecked && level.value !== "H"}
              >
                {level.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Higher levels provide better error correction but may make QR code
            more complex.
          </p>
        </div>
      </div>
    </div>
  );

  // Determine footer buttons based on current step
  const renderFooterButtons = () => (
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
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isCreatingUrl}
          loading={isCreatingUrl}
          startIcon={<RiLinkM />}
        >
          {isCreatingUrl ? "Processing..." : "Next: Customize QR"}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={handleSubmit(handleFormSubmit)}
          disabled={
            isGenerating || !selectedForegroundColor || !selectedBackgroundColor
          }
          loading={isGenerating}
          startIcon={<RiQrCodeLine />}
        >
          {isGenerating ? "Generating..." : "Create QR Code"}
        </Button>
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
    >
      <div className="py-2">
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
