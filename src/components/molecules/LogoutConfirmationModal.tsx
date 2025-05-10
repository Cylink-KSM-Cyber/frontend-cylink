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
                className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden ${className}`}
              >
                {/* Icon at the top */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                >
                  <RiLogoutBoxRLine className="text-white text-2xl" />
                </motion.div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <RiCloseLine className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="pt-16 pb-6 px-6">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center space-y-2"
                  >
                    <h3
                      id="modal-title"
                      className="text-xl font-bold text-gray-900"
                    >
                      Confirm Logout
                    </h3>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-500"
                    >
                      Are you sure you want to log out of your account?
                    </motion.p>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 flex items-center justify-center text-sm text-amber-500 bg-amber-50 p-3 rounded-lg"
                    >
                      <RiAlertLine className="flex-shrink-0 mr-2 h-5 w-5" />
                      <span>
                        You will need to sign in again to access your account.
                      </span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 px-6 py-4 flex space-x-3 justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 
                              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-black 
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
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal;
