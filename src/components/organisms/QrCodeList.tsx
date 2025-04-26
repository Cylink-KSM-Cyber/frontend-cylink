import React from "react";
import { QrCode } from "@/interfaces/url";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import Button from "@/components/atoms/Button";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiDownload2Line,
} from "react-icons/ri";

/**
 * Prop types for QrCodeList component
 */
interface QrCodeListProps {
  /**
   * Array of QR code data to display
   */
  qrCodes: QrCode[];
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  /**
   * Function to call when edit button is clicked
   */
  onEdit?: (qrCode: QrCode) => void;
  /**
   * Function to call when delete button is clicked
   */
  onDelete?: (qrCode: QrCode) => void;
  /**
   * Function to call when QR code is clicked for preview
   */
  onPreview?: (qrCode: QrCode) => void;
  /**
   * Function to call when download button is clicked
   */
  onDownload?: (qrCode: QrCode, format: "png" | "svg") => void;
  /**
   * Array of selected QR codes
   */
  selectedQrCodes?: QrCode[];
  /**
   * Function to call when QR code selection changes
   */
  onSelectQrCode?: (qrCode: QrCode, selected: boolean) => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * QrCodeList Component
 * @description Displays QR codes in a list/table view with detailed information and actions
 */
const QrCodeList: React.FC<QrCodeListProps> = ({
  qrCodes,
  isLoading = false,
  onEdit,
  onDelete,
  onPreview,
  onDownload,
  selectedQrCodes = [],
  onSelectQrCode,
  className = "",
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Check if a QR code is selected
  const isSelected = (qrCode: QrCode) => {
    return selectedQrCodes.some((selected) => selected.id === qrCode.id);
  };

  // Handle checkbox change
  const handleCheckboxChange = (qrCode: QrCode, checked: boolean) => {
    if (onSelectQrCode) {
      onSelectQrCode(qrCode, checked);
    }
  };

  // If loading, show skeleton rows
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      >
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 py-3.5 px-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-1"></div>
              <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </div>
              <div className="col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </div>
              <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </div>
              <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scans
              </div>
              <div className="col-span-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="py-4 px-4 animate-pulse">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-16 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no QR codes, show empty state (handled by parent component)
  if (qrCodes.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <div className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <div className="bg-gray-50 py-3.5 px-4">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-1 flex items-center">
              {onSelectQrCode && (
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </span>
              )}
            </div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              QR Code
            </div>
            <div className="col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </div>
            <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scans
            </div>
            <div className="col-span-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="bg-white divide-y divide-gray-200">
          {qrCodes.map((qrCode) => (
            <div
              key={qrCode.id}
              className={`py-4 px-4 hover:bg-gray-50 transition-colors duration-150 ${
                isSelected(qrCode) ? "bg-primary-50" : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Selection Checkbox */}
                <div className="col-span-1">
                  {onSelectQrCode && (
                    <input
                      type="checkbox"
                      checked={isSelected(qrCode)}
                      onChange={(e) =>
                        handleCheckboxChange(qrCode, e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  )}
                </div>

                {/* QR Code Preview */}
                <div
                  className="col-span-2"
                  onClick={() => onPreview && onPreview(qrCode)}
                >
                  <div className="h-16 w-16 cursor-pointer hover:scale-105 transition-transform duration-150">
                    <QrCodePreview
                      foregroundColor={
                        qrCode.customization?.foregroundColor || "#000000"
                      }
                      backgroundColor={
                        qrCode.customization?.backgroundColor || "#FFFFFF"
                      }
                      includeLogoChecked={
                        qrCode.customization?.includeLogo || false
                      }
                      size={64}
                      value={
                        qrCode.shortUrl || `https://example.com/${qrCode.id}`
                      }
                      errorCorrectionLevel="M"
                      logoSize={qrCode.customization?.logoSize || 0.25}
                      generatedQrUrl={null}
                    />
                  </div>
                </div>

                {/* URL Info */}
                <div className="col-span-3">
                  <div
                    className="text-sm font-medium text-gray-900 truncate"
                    title={qrCode.title || qrCode.shortUrl || "Untitled"}
                  >
                    {qrCode.title || qrCode.shortUrl || "Untitled"}
                  </div>
                  <div
                    className="text-xs text-gray-500 truncate"
                    title={qrCode.description || qrCode.shortUrl}
                  >
                    {qrCode.description || qrCode.shortUrl}
                  </div>
                </div>

                {/* Created Date */}
                <div className="col-span-2">
                  <div className="text-sm text-gray-700">
                    {formatDate(qrCode.createdAt)}
                  </div>
                </div>

                {/* Scans Count */}
                <div className="col-span-2">
                  <div className="text-sm text-gray-700">
                    {qrCode.scans !== undefined
                      ? qrCode.scans.toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-2 flex justify-end items-center space-x-2">
                  <Button
                    onClick={() => onPreview && onPreview(qrCode)}
                    variant="text"
                    size="sm"
                    aria-label="Preview"
                    startIcon={<RiEyeLine className="text-lg" />}
                  >
                    <span className="sr-only">Preview</span>
                  </Button>

                  <Button
                    onClick={() => onDownload && onDownload(qrCode, "png")}
                    variant="text"
                    size="sm"
                    aria-label="Download"
                    startIcon={<RiDownload2Line className="text-lg" />}
                  >
                    <span className="sr-only">Download</span>
                  </Button>

                  {onEdit && (
                    <Button
                      onClick={() => onEdit(qrCode)}
                      variant="text"
                      size="sm"
                      aria-label="Edit"
                      startIcon={<RiEditLine className="text-lg" />}
                    >
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      onClick={() => onDelete(qrCode)}
                      variant="danger"
                      size="sm"
                      aria-label="Delete"
                      startIcon={<RiDeleteBinLine className="text-lg" />}
                      className="text-red-500 hover:text-red-700"
                    >
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QrCodeList;
