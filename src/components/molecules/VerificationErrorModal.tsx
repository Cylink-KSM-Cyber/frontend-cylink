"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiXCircle } from "react-icons/fi";
import Button from "@/components/atoms/Button";
import Link from "next/link";

/**
 * Verification error modal properties
 * @interface VerificationErrorModalProps
 */
interface VerificationErrorModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Function to close modal */
  onClose: () => void;
  /** Error message to display */
  message?: string;
}

/**
 * Verification error modal component
 * @description Modal that displays error message if account verification fails
 * @param props - Verification error modal properties
 * @returns Verification error modal component
 */
const VerificationErrorModal: React.FC<VerificationErrorModalProps> = ({
  isOpen,
  onClose,
  message = "Invalid or expired verification token. Please request a new verification email or contact support.",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Modal Content */}
              <div className="p-6 text-center">
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiXCircle className="w-8 h-8 text-red-600" />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  Verification Failed
                </motion.h3>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  {message}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Link href="/register" className="block">
                    <Button fullWidth onClick={onClose}>
                      Register Again
                    </Button>
                  </Link>
                  <Link href="/login" className="block">
                    <Button fullWidth variant="outline" onClick={onClose}>
                      Back to Login
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerificationErrorModal;
