"use client";

import React, { useEffect, useRef } from "react";
import Modal from "@/components/atoms/Modal";
import { useQrCodeCreation } from "@/hooks/useQrCodeCreation";
import StepIndicator from "./StepIndicator";
import UrlSelectionStep from "./UrlSelectionStep";
import QrCodeCustomizationStep from "./QrCodeCustomizationStep";
import QrCodeModalFooter from "./QrCodeModalFooter";
import { Url } from "@/interfaces/url";

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
    errorCorrectionLevel,
    isLoading,
    isGenerating,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setLogoSize,
    setErrorCorrectionLevel,
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

  // Handle modal close
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Handle form submission (next step or create QR code)
  const handleSubmit = () => {
    const data = form.getValues();
    handleFormSubmit(data);
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
      size={currentStep === 1 ? "md" : "lg"}
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
            errorCorrectionLevel={errorCorrectionLevel}
            setSelectedForegroundColor={setSelectedForegroundColor}
            setSelectedBackgroundColor={setSelectedBackgroundColor}
            setIncludeLogoChecked={setIncludeLogoChecked}
            setLogoSize={setLogoSize}
            setErrorCorrectionLevel={setErrorCorrectionLevel}
          />
        )}
      </div>
    </Modal>
  );
};

export default QrCodeCreator;
