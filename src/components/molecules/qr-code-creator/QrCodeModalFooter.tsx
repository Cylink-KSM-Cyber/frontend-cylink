"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import {
  RiLinkM,
  RiQrCodeLine,
  RiDownload2Line,
  RiShareLine,
} from "react-icons/ri";

/**
 * Props for QrCodeModalFooter component
 */
interface QrCodeModalFooterProps {
  /**
   * Current step in the QR code creation process
   */
  currentStep: number;
  /**
   * Whether the QR code has been generated
   */
  isGenerated: boolean;
  /**
   * Whether a URL is being created
   */
  isCreatingUrl: boolean;
  /**
   * Whether a QR code is being generated
   */
  isGenerating: boolean;
  /**
   * Whether form validation has passed
   */
  isValid: boolean;
  /**
   * Handler for cancel/close action
   */
  onClose: () => void;
  /**
   * Handler for form submission
   */
  onSubmit: () => void;
  /**
   * Handler for QR code download
   */
  onDownload: () => void;
  /**
   * Handler for QR code sharing
   */
  onShare: () => void;
  /**
   * Handler for QR code customization reset
   */
  onReset: () => void;
  /**
   * Handler for completion
   */
  onComplete: () => void;
}

/**
 * QR Code Modal Footer Component
 *
 * @description Footer component with action buttons for QR code creation modal
 */
const QrCodeModalFooter: React.FC<QrCodeModalFooterProps> = ({
  currentStep,
  isGenerated,
  isCreatingUrl,
  isGenerating,
  isValid,
  onClose,
  onSubmit,
  onDownload,
  onShare,
  onReset,
  onComplete,
}) => {
  if (!isGenerated) {
    return (
      <>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isCreatingUrl || isGenerating}
        >
          Cancel
        </Button>

        {currentStep === 1 ? (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isCreatingUrl}
            loading={isCreatingUrl}
            startIcon={<RiLinkM />}
          >
            {isCreatingUrl ? "Processing..." : "Next: Customize QR"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isGenerating || !isValid}
            loading={isGenerating}
            startIcon={<RiQrCodeLine />}
          >
            {isGenerating ? "Generating..." : "Create QR Code"}
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={onReset}
        startIcon={<RiQrCodeLine />}
      >
        Customize Again
      </Button>
      <Button
        variant="primary"
        onClick={onDownload}
        startIcon={<RiDownload2Line />}
      >
        Download
      </Button>
      <Button variant="primary" onClick={onShare} startIcon={<RiShareLine />}>
        Share
      </Button>
      <Button
        variant="primary"
        onClick={onComplete}
        startIcon={<RiQrCodeLine />}
      >
        Done
      </Button>
    </>
  );
};

export default QrCodeModalFooter;
