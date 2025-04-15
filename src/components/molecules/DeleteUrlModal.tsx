"use client";

import React from "react";
import { Url } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { RiAlertLine, RiDeleteBinLine } from "react-icons/ri";

/**
 * DeleteUrlModal props
 * @interface DeleteUrlModalProps
 */
interface DeleteUrlModalProps {
  /** The URL to delete */
  url: Url | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when deletion is confirmed */
  onConfirm: (url: Url) => void;
  /** Function to call when deletion is canceled */
  onCancel: () => void;
  /** Whether deletion is in progress */
  isDeleting?: boolean;
}

/**
 * DeleteUrlModal Component
 * @description Modal for confirming URL deletion with appropriate warning visuals
 */
const DeleteUrlModal: React.FC<DeleteUrlModalProps> = ({
  url,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  // Don't render if no URL is provided
  if (!url) return null;

  // Handle confirm button click
  const handleConfirm = () => {
    onConfirm(url);
  };

  // Format for display
  const formatUrl = (url: string) => {
    return url.length > 40 ? `${url.substring(0, 40)}...` : url;
  };

  return (
    <Modal
      title="Delete URL"
      isOpen={isOpen}
      onClose={onCancel}
      variant="danger"
      size="sm"
      overlayStyle="glassmorphism"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
            loading={isDeleting}
            startIcon={<RiDeleteBinLine />}
          >
            {isDeleting ? "Deleting..." : "Delete URL"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center py-2">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <RiAlertLine className="h-6 w-6" />
        </div>

        <h4 className="mb-2 text-center text-lg font-medium text-gray-900">
          Are you sure you want to delete this URL?
        </h4>

        <p className="mb-4 text-center text-sm text-gray-600">
          This action cannot be undone. The URL will no longer be accessible,
          and all analytics data will be lost.
        </p>

        <div className="mb-4 w-full rounded-md bg-gray-50 p-3">
          <div className="mb-1 text-xs font-medium text-gray-500">
            Short URL
          </div>
          <div className="text-sm font-medium text-black">{url.short_url}</div>

          <div className="mt-3 text-xs font-medium text-gray-500">
            Original URL
          </div>
          <div className="text-sm text-gray-700">
            {formatUrl(url.original_url)}
          </div>

          <div className="mt-3 flex justify-between">
            <div>
              <div className="text-xs font-medium text-gray-500">Created</div>
              <div className="text-sm text-gray-700">
                {new Date(url.created_at).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Clicks</div>
              <div className="text-sm text-gray-700">
                {url.clicks.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUrlModal;
