"use client";

import React, { useEffect, useRef } from "react";
import { QrCode } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * QR Code Preview Modal props
 * @interface QrCodePreviewModalProps
 */
interface QrCodePreviewModalProps {
  /** The QR code to preview */
  qrCode: QrCode | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose: () => void;
}

/**
 * QrCodePreviewModal Component
 * @description Modal for displaying a preview of a QR code
 */
const QrCodePreviewModal: React.FC<QrCodePreviewModalProps> = ({
  qrCode,
  isOpen,
  onClose,
}) => {
  const { trackQrCodePreviewInteraction } = useConversionTracking();
  const previewStartTimeRef = useRef<number | null>(null);

  // Track preview open
  useEffect(() => {
    if (isOpen && qrCode) {
      previewStartTimeRef.current = Date.now();

      const qrCodeAgeDays = Math.floor(
        (Date.now() - new Date(qrCode.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      trackQrCodePreviewInteraction({
        qr_code_id: qrCode.id,
        url_id: qrCode.urlId,
        qr_code_title: qrCode.title || `QR Code ${qrCode.id}`,
        short_url: qrCode.shortUrl || "",
        customization_options: {
          foreground_color: qrCode.customization?.foregroundColor || "#000000",
          background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
          size: qrCode.customization?.size || 300,
        },
        interaction_type: "open_preview",
        preview_source: "direct_link", // This modal is typically opened from list/grid
        includes_logo: qrCode.customization?.includeLogo || false,
        total_scans: qrCode.scans || 0,
        qr_code_age_days: qrCodeAgeDays,
        success: true,
      });
    }
  }, [isOpen, qrCode, trackQrCodePreviewInteraction]);

  // Track preview close
  useEffect(() => {
    if (!isOpen && qrCode && previewStartTimeRef.current) {
      const previewDuration = Math.floor(
        (Date.now() - previewStartTimeRef.current) / 1000
      );
      previewStartTimeRef.current = null;

      const qrCodeAgeDays = Math.floor(
        (Date.now() - new Date(qrCode.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      trackQrCodePreviewInteraction({
        qr_code_id: qrCode.id,
        url_id: qrCode.urlId,
        qr_code_title: qrCode.title || `QR Code ${qrCode.id}`,
        short_url: qrCode.shortUrl || "",
        customization_options: {
          foreground_color: qrCode.customization?.foregroundColor || "#000000",
          background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
          size: qrCode.customization?.size || 300,
        },
        interaction_type: "close_preview",
        preview_source: "direct_link",
        preview_duration_seconds: previewDuration,
        includes_logo: qrCode.customization?.includeLogo || false,
        total_scans: qrCode.scans || 0,
        qr_code_age_days: qrCodeAgeDays,
        success: true,
      });
    }
  }, [isOpen, qrCode, trackQrCodePreviewInteraction]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Don't render if no QR code is provided
  if (!qrCode) return null;

  // Extract customization properties with fallbacks
  const fgColor = qrCode.customization?.foregroundColor || "#000000";
  const bgColor = qrCode.customization?.backgroundColor || "#FFFFFF";
  const includeLogo = qrCode.customization?.includeLogo || false;
  const value = qrCode.shortUrl || `https://example.com/${qrCode.id}`;
  const logoSize = qrCode.customization?.logoSize || 0.25;
  const size = qrCode.customization?.size || 300;

  return (
    <Modal
      title="QR Code Preview"
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="md"
      overlayStyle="glassmorphism"
    >
      <div className="qr-preview-modal-content">
        {/* QR Code Preview */}
        <div className="flex justify-center mb-4">
          <div className="qr-code-container">
            <QrCodePreview
              foregroundColor={fgColor}
              backgroundColor={bgColor}
              includeLogoChecked={includeLogo}
              size={280}
              value={value}
              errorCorrectionLevel="H"
              logoSize={logoSize}
              generatedQrUrl={null}
            />
          </div>
        </div>

        {/* QR Code Details */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {qrCode.title || `QR Code ${String(qrCode.id).substring(0, 6)}`}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm text-gray-900">
                {formatDate(qrCode.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Scans</p>
              <p className="text-sm text-gray-900">
                {qrCode.scans.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Size</p>
              <p className="text-sm text-gray-900">
                {size}×{size}px
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">URL</p>
              <p className="text-sm text-gray-900 truncate">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QrCodePreviewModal;
