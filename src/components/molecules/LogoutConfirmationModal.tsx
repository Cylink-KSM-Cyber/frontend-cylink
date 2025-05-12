"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiLogoutBoxRLine, RiCloseLine, RiAlertLine } from "react-icons/ri";

/**
 * Props for LogoutConfirmationModal component
 * @interface LogoutConfirmationModalProps
 */
interface LogoutConfirmationModalProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;
  /**
   * Function to call when modal is closed
   */
  onClose: () => void;
  /**
   * Function to call when logout is confirmed
   */
  onConfirm: () => void;
  /**
   * Whether the logout action is loading
   */
  isLoading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LogoutConfirmationModal Component
 * @description A modal component for confirming logout actions with animations
 * @param props - Component props
 * @returns LogoutConfirmationModal component
 */
const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  className = "",
}) => {
  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className={`relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden ${className}`}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 z-10"
                  aria-label="Close modal"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="px-6 py-5">
                  <div className="text-center space-y-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="mx-auto mb-4 flex justify-center"
                    >
                      <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center">
                        <RiLogoutBoxRLine className="text-white text-xl" />
                      </div>
                    </motion.div>

                    <h3
                      id="modal-title"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Confirm Logout
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Are you sure you want to log out of your account?
                    </p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-amber-50 p-3 rounded text-sm text-amber-600 flex items-start mt-2"
                    >
                      <RiAlertLine className="flex-shrink-0 mr-2 h-5 w-5 mt-0.5" />
                      <span>
                        You will need to sign in again to access your account.
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 px-6 py-4 flex justify-end space-x-3 bg-gray-50">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 rounded text-sm font-medium text-gray-700 bg-white border border-gray-300 
                              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 rounded text-sm font-medium text-white bg-black 
                              hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 text-white">
                          <svg
                            className="h-full w-full"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                        <span>Logging out...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal;
