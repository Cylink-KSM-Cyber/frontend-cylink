"use client";

import React, { useEffect, useRef } from "react";
import Modal from "@/components/atoms/Modal";
import { useQrCodeCreation } from "@/hooks/qrcode/useQrCodeCreation";
import StepIndicator from "./StepIndicator";
import UrlSelectionStep from "./UrlSelectionStep";
import QrCodeCustomizationStep from "./QrCodeCustomizationStep";
import QrCodeModalFooter from "./QrCodeModalFooter";
import { Url } from "@/interfaces/url";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * Props for QrCodeCreator component
 */
interface QrCodeCreatorProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;
  /**
   * Function to call when modal is closed
   */
  onClose: () => void;
  /**
   * Function to call when QR code is created
   */
  onCreated: () => void;
  /**
   * Function to create a new URL and return it
   */
  createUrl: (data: {
    title: string;
    original_url: string;
    custom_code?: string;
    expiry_date: string;
  }) => Promise<Url>;
  /**
   * Whether URL creation is in progress
   */
  isCreatingUrl?: boolean;
}

/**
 * QR Code Creator Component
 *
 * @description Modal for creating new QR codes with URL selection/creation and customization options
 */
const QrCodeCreator: React.FC<QrCodeCreatorProps> = ({
  isOpen,
  onClose,
  onCreated,
  createUrl,
  isCreatingUrl = false,
}) => {
  // Use the custom hook to manage QR code creation
  const qrCodeCreation = useQrCodeCreation(createUrl, onCreated);
  const { trackQrCodeGeneration, trackQrCodeSharing } = useConversionTracking();

  // Track if modal has been initialized
  const hasInitializedRef = useRef(false);
  // Track step changes to load colors only when needed
  const lastStepRef = useRef(1);

  // Destructure values and functions from the hook
  const {
    form,
    handleFormSubmit,
    resetState,
    initialize,
    currentStep,
    previewUrl,
    existingUrls,
    isLoadingUrls,
    selectedUrlForQrCode,
    generatedQrUrl,
    foregroundColors,
    backgroundColors,
    selectedForegroundColor,
    selectedBackgroundColor,
    includeLogoChecked,
    logoSize,
    qrSize,
    isLoading,
    isGenerating,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setLogoSize,
    setQrSize,
    resetQrCode,
    handleFinish,
    loadColors,
  } = qrCodeCreation;

  // Initialize the component when modal opens
  useEffect(() => {
    if (isOpen) {
      // Only initialize once when the modal opens
      if (!hasInitializedRef.current) {
        initialize();
        hasInitializedRef.current = true;
      }
    } else {
      // Reset the initialization flag when the modal closes
      hasInitializedRef.current = false;
    }
  }, [isOpen, initialize]);

  // Load colors when advancing to step 2 (only once)
  useEffect(() => {
    if (currentStep === 2 && lastStepRef.current === 1) {
      // Now we need the colors for step 2
      loadColors();
    }

    // Update the last step ref
    lastStepRef.current = currentStep;
  }, [currentStep, loadColors]);

  // Track QR code generation when successful
  useEffect(() => {
    if (generatedQrUrl && selectedUrlForQrCode) {
      trackQrCodeGeneration({
        url_id: selectedUrlForQrCode.id,
        customization_options: {
          foreground_color: selectedForegroundColor?.hex,
          background_color: selectedBackgroundColor?.hex,
          size: qrSize,
          format: "png",
        },
        downloaded: false,
        shared: false,
      });
    }
  }, [
    generatedQrUrl,
    selectedUrlForQrCode,
    selectedForegroundColor,
    selectedBackgroundColor,
    qrSize,
    trackQrCodeGeneration,
  ]);

  // Handle modal close
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Handle form submission (next step or create QR code)
  const handleSubmit = () => {
    handleFormSubmit();
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

    // Track QR code download
    if (selectedUrlForQrCode) {
      trackQrCodeGeneration({
        url_id: selectedUrlForQrCode.id,
        customization_options: {
          foreground_color: selectedForegroundColor?.hex,
          background_color: selectedBackgroundColor?.hex,
          size: qrSize,
          format: "png",
        },
        downloaded: true,
        shared: false,
      });
    }
  };

  // Handle Share QR Code button click
  const handleShareClick = async () => {
    if (!generatedQrUrl || !previewUrl || !selectedUrlForQrCode) return;

    // Determine sharing platform
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const sharingPlatform = isMobile ? "mobile" : "desktop";

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${previewUrl}`,
          text: `Scan this QR code to visit ${previewUrl}`,
          url: previewUrl,
        });

        // Track successful QR code sharing via Web Share API
        trackQrCodeSharing({
          qr_code_id: selectedUrlForQrCode.id, // Using URL ID as QR code ID for this context
          url_id: selectedUrlForQrCode.id,
          qr_code_title:
            selectedUrlForQrCode.title ||
            `QR Code for ${selectedUrlForQrCode.short_code}`,
          short_url: previewUrl,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "web_share_api",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0, // Not available in this context
          qr_code_age_days: 0, // Not available in this context
          success: true,
        });
      } catch (err) {
        console.error("Error sharing:", err);

        // Track failed QR code sharing
        trackQrCodeSharing({
          qr_code_id: selectedUrlForQrCode.id,
          url_id: selectedUrlForQrCode.id,
          qr_code_title:
            selectedUrlForQrCode.title ||
            `QR Code for ${selectedUrlForQrCode.short_code}`,
          short_url: previewUrl,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "web_share_api",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: false,
          error_message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(previewUrl);
        alert("URL copied to clipboard!");

        // Track successful QR code sharing via clipboard
        trackQrCodeSharing({
          qr_code_id: selectedUrlForQrCode.id,
          url_id: selectedUrlForQrCode.id,
          qr_code_title:
            selectedUrlForQrCode.title ||
            `QR Code for ${selectedUrlForQrCode.short_code}`,
          short_url: previewUrl,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "clipboard",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: true,
        });
      } catch (err) {
        console.error("Error copying to clipboard:", err);

        // Track failed clipboard sharing
        trackQrCodeSharing({
          qr_code_id: selectedUrlForQrCode.id,
          url_id: selectedUrlForQrCode.id,
          qr_code_title:
            selectedUrlForQrCode.title ||
            `QR Code for ${selectedUrlForQrCode.short_code}`,
          short_url: previewUrl,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "clipboard",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: false,
          error_message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
  };

  // Handle Reset/Customize Again button click
  const handleResetClick = () => {
    resetQrCode();
  };

  // Handle Done button click
  const handleDoneClick = () => {
    handleFinish();
  };

  // Determine if the form is valid for the current step
  const isFormValid = () => {
    if (currentStep === 1) {
      const { urlSource, existingUrlId, title, originalUrl, expiryDate } =
        form.getValues();

      if (urlSource === "existing") {
        return (
          existingUrlId !== undefined &&
          existingUrlId !== null &&
          existingUrlId !== ""
        );
      } else {
        return !!title && !!originalUrl && !!expiryDate;
      }
    } else if (currentStep === 2) {
      return (
        selectedForegroundColor !== null && selectedBackgroundColor !== null
      );
    }

    return false;
  };

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
      size="lg"
      overlayStyle="glassmorphism"
      footer={
        <QrCodeModalFooter
          currentStep={currentStep}
          isGenerated={!!generatedQrUrl}
          isCreatingUrl={isCreatingUrl}
          isGenerating={isGenerating}
          isValid={isFormValid()}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onDownload={handleDownloadClick}
          onShare={handleShareClick}
          onReset={handleResetClick}
          onComplete={handleDoneClick}
        />
      }
      className="max-h-[90vh] my-auto"
    >
      <div className="py-2 overflow-y-auto max-h-[calc(90vh-160px)]">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          steps={["Select URL", "Customize"]}
        />

        {/* Step Content */}
        {currentStep === 1 ? (
          <UrlSelectionStep
            form={form}
            existingUrls={existingUrls}
            isLoadingUrls={isLoadingUrls}
          />
        ) : (
          <QrCodeCustomizationStep
            previewUrl={previewUrl}
            selectedUrl={selectedUrlForQrCode}
            originalUrl={form.getValues().originalUrl}
            isExistingUrl={form.getValues().urlSource === "existing"}
            isGenerated={!!generatedQrUrl}
            generatedQrUrl={generatedQrUrl}
            isGenerating={isGenerating}
            isLoading={isLoading}
            foregroundColors={foregroundColors}
            backgroundColors={backgroundColors}
            selectedForegroundColor={selectedForegroundColor}
            selectedBackgroundColor={selectedBackgroundColor}
            includeLogoChecked={includeLogoChecked}
            logoSize={logoSize}
            qrSize={qrSize}
            setSelectedForegroundColor={setSelectedForegroundColor}
            setSelectedBackgroundColor={setSelectedBackgroundColor}
            setIncludeLogoChecked={setIncludeLogoChecked}
            setLogoSize={setLogoSize}
            setQrSize={setQrSize}
          />
        )}
      </div>
    </Modal>
  );
};

export default QrCodeCreator;
