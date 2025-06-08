"use client";

import { useMemo } from "react";
import { Url } from "@/interfaces/url";
import { useUrlSelection } from "./useUrlSelection";
import { useQrCreationFlow } from "./useQrCreationFlow";
import { useQrCode } from "../useQrCode";

/**
 * Refactored QR Code Creation Hook
 * @description Composes domain-specific hooks for QR code creation
 * This replaces the monolithic useQrCodeCreation hook with a cleaner composition approach
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
  // Domain-specific hooks
  const urlSelection = useUrlSelection();
  const creationFlow = useQrCreationFlow(createUrl, onCreated);
  const qrCustomization = useQrCode();

  /**
   * Generate preview URL based on current state
   */
  const previewUrl = useMemo(() => {
    return creationFlow.generatePreviewUrl(urlSelection.selectedUrl);
  }, [creationFlow, urlSelection.selectedUrl]);

  /**
   * Get selected URL for QR code creation
   */
  const selectedUrlForQrCode = useMemo(() => {
    if (creationFlow.urlSource === "existing" && creationFlow.existingUrlId) {
      return urlSelection.findUrlById(creationFlow.existingUrlId) || null;
    }
    return null;
  }, [creationFlow.urlSource, creationFlow.existingUrlId, urlSelection]);

  /**
   * Handle form submission for each step
   */
  const handleFormSubmit = async (): Promise<void> => {
    if (creationFlow.currentStep === 1) {
      // Step 1: Handle URL selection/creation
      const result = await creationFlow.handleStep1Submit();

      if (result.success) {
        // Update URL selection if a new URL was created
        if (result.url) {
          // Refresh URLs to include the new one
          await urlSelection.refreshUrls();
          // Select the new URL
          urlSelection.selectUrlById(result.url.id);
        } else if (creationFlow.existingUrlId) {
          // Select the existing URL
          urlSelection.selectUrlById(creationFlow.existingUrlId);
        }

        // Move to next step
        creationFlow.nextStep();
      }
    } else if (creationFlow.currentStep === 2) {
      // Step 2: Generate QR code
      const targetUrl = selectedUrlForQrCode;

      if (targetUrl) {
        const qrImageUrl = await qrCustomization.generateQrCodeForUrl(
          targetUrl
        );

        if (qrImageUrl) {
          // QR code generated successfully
          creationFlow.completeFlow();
        }
      }
    }
  };

  /**
   * Reset entire state
   */
  const resetState = () => {
    creationFlow.resetFlow();
    urlSelection.clearSelection();
    qrCustomization.resetQrCode();
  };

  /**
   * Initialize the QR code creation process
   */
  const initialize = () => {
    creationFlow.initializeFlow();
    urlSelection.initializeUrls();
  };

  /**
   * Handle QR code creation completion
   */
  const handleFinish = () => {
    creationFlow.completeFlow();
  };

  /**
   * Refresh existing URLs
   */
  const refreshUrls = async (): Promise<boolean> => {
    return await urlSelection.refreshUrls();
  };

  return {
    // Form state (from flow)
    form: creationFlow.form,
    handleFormSubmit,
    resetState,
    initialize,
    refreshUrls,

    // Step management (from flow)
    currentStep: creationFlow.currentStep,
    setCurrentStep: creationFlow.goToStep,

    // URL state (from URL selection)
    previewUrl,
    existingUrls: urlSelection.existingUrls,
    isLoadingUrls: urlSelection.isLoadingUrls,
    selectedUrlForQrCode,

    // Creation state (from flow)
    isCreatingUrl: creationFlow.isCreatingUrl,

    // QR customization state (from QR hook)
    generatedQrUrl: qrCustomization.generatedQrUrl,
    foregroundColors: qrCustomization.foregroundColors,
    backgroundColors: qrCustomization.backgroundColors,
    selectedForegroundColor: qrCustomization.selectedForegroundColor,
    selectedBackgroundColor: qrCustomization.selectedBackgroundColor,
    includeLogoChecked: qrCustomization.includeLogoChecked,
    logoSize: qrCustomization.logoSize,
    qrSize: qrCustomization.qrSize,
    isLoading: qrCustomization.isLoading,
    isGenerating: qrCustomization.isGenerating,

    // QR customization actions
    setSelectedForegroundColor: qrCustomization.setSelectedForegroundColor,
    setSelectedBackgroundColor: qrCustomization.setSelectedBackgroundColor,
    setIncludeLogoChecked: qrCustomization.setIncludeLogoChecked,
    setLogoSize: qrCustomization.setLogoSize,
    setQrSize: qrCustomization.setQrSize,
    resetQrCode: qrCustomization.resetQrCode,
    loadColors: qrCustomization.loadColors,

    // Completion handlers
    handleFinish,

    // Validation
    canProceed: creationFlow.canProceed,
    isValid: creationFlow.validateCurrentStep(),

    // Step information
    steps: creationFlow.steps,
    getCurrentStepInfo: creationFlow.getCurrentStepInfo,
    isFirstStep: creationFlow.isFirstStep,
    isFinalStep: creationFlow.isFinalStep,

    // URL statistics and utilities
    urlStats: urlSelection.urlStats,
    recentUrls: urlSelection.recentUrls,
    popularUrls: urlSelection.popularUrls,
    filterUrls: urlSelection.filterUrls,
  };
};
