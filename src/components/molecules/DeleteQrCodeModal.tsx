"use client";

import React from "react";
import { QrCode } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { RiAlertLine, RiDeleteBinLine } from "react-icons/ri";
import "@/styles/deleteModal.css";

/**
 * Function to format a date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
const formatQrDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * DeleteQrCodeModal props
 * @interface DeleteQrCodeModalProps
 */
interface DeleteQrCodeModalProps {
  /** The QR code to delete */
  qrCode: QrCode | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when deletion is confirmed */
  onConfirm: (qrCode: QrCode) => void;
  /** Function to call when deletion is canceled */
  onCancel: () => void;
  /** Whether deletion is in progress */
  isDeleting?: boolean;
}

/**
 * DeleteQrCodeModal Component
 * @description Modal for confirming QR code deletion with appropriate warning visuals
 */
const DeleteQrCodeModal: React.FC<DeleteQrCodeModalProps> = ({
  qrCode,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  // Don't render if no QR code is provided
  if (!qrCode) return null;

  // Handle confirm button click
  const handleConfirm = () => {
    onConfirm(qrCode);
  };

  return (
    <Modal
      title="Delete QR Code"
      isOpen={isOpen}
      onClose={onCancel}
      variant="danger"
      size="sm"
      overlayStyle="glassmorphism"
      footer={
        <div className="delete-modal-buttons flex justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
            className="min-w-24"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            loading={isDeleting}
            startIcon={<RiDeleteBinLine />}
            className="min-w-24"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center py-2">
        <div className="mb-5 rounded-full bg-red-100 p-4 text-red-600 delete-modal-alert-icon">
          <RiAlertLine className="h-6 w-6" />
        </div>

        <h4 className="mb-3 text-center text-lg font-medium text-gray-900 delete-modal-title">
          Are you sure you want to delete this QR code?
        </h4>

        <p className="mb-5 text-center text-sm text-gray-600">
          This action cannot be undone. The QR code will no longer be
          accessible.
        </p>

        <div className="mb-4 w-full rounded-md bg-gray-50 p-4 delete-modal-card delete-modal-details">
          <div className="mb-1 text-xs font-medium text-gray-500">
            QR Code Title
          </div>
          <div className="mb-3 text-sm font-medium text-black">
            {qrCode.title || `QR Code ${String(qrCode.id).substring(0, 6)}`}
          </div>

          {qrCode.shortUrl && (
            <>
              <div className="mb-1 text-xs font-medium text-gray-500">
                Short URL
              </div>
              <div className="mb-3 text-sm text-gray-700">
                {qrCode.shortUrl}
              </div>
            </>
          )}

          <div className="mt-2 flex justify-between">
            <div>
              <div className="text-xs font-medium text-gray-500">Created</div>
              <div className="text-sm text-gray-700">
                {formatQrDate(qrCode.createdAt)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Scans</div>
              <div className="text-sm text-gray-700">
                {qrCode.scans.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteQrCodeModal;
