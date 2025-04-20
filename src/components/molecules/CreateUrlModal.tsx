import React, { useState } from "react";
import { FiX, FiCalendar, FiLink } from "react-icons/fi";

interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    originalUrl: string;
    customBackHalf?: string;
    expiryDate?: string;
    generateQR: boolean;
    trackAnalytics: boolean;
  }) => void;
}

const CreateUrlModal: React.FC<CreateUrlModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    originalUrl: "",
    customBackHalf: "",
    expiryDate: "",
    generateQR: false,
    trackAnalytics: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New URL</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter a memorable title"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original URL
            </label>
            <input
              type="url"
              placeholder="https://"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.originalUrl}
              onChange={(e) =>
                setFormData({ ...formData, originalUrl: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Back-half (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 border border-r-0 rounded-l-md bg-gray-50 text-gray-500">
                cylink.co/
              </span>
              <input
                type="text"
                placeholder="custom-url"
                className="flex-1 px-3 py-2 border rounded-r-md"
                value={formData.customBackHalf}
                onChange={(e) =>
                  setFormData({ ...formData, customBackHalf: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.generateQR}
                onChange={(e) =>
                  setFormData({ ...formData, generateQR: e.target.checked })
                }
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">Generate QR Code</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.trackAnalytics}
                onChange={(e) =>
                  setFormData({ ...formData, trackAnalytics: e.target.checked })
                }
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">Track Analytics</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create URL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUrlModal;
