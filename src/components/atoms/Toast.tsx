"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

/**
 * Toast type
 */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * Toast props
 * @interface ToastProps
 */
interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast type */
  type: ToastType;
  /** Whether the toast is visible */
  isVisible: boolean;
  /** Function to close the toast */
  onClose: () => void;
  /** Auto-close duration in milliseconds */
  duration?: number;
  /** Whether to use white toast style */
  isWhite?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Toast component
 * @description Displays a notification message that automatically disappears after a set duration
 * @param props - Toast properties
 * @returns Toast component
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 3000,
  isWhite = false,
  className = "",
}) => {
  // Auto-close toast after duration
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // Toast style configurations based on type
  const toastStyles = {
    success: {
      bg: isWhite ? "bg-white" : "bg-green-100",
      border: isWhite ? "border-gray-200" : "border-green-300",
      text: isWhite ? "text-green-600" : "text-green-800",
      icon: (
        <FiCheckCircle
          className={`w-5 h-5 ${isWhite ? "text-green-500" : "text-green-500"}`}
        />
      ),
    },
    error: {
      bg: isWhite ? "bg-white" : "bg-red-100",
      border: isWhite ? "border-gray-200" : "border-red-300",
      text: isWhite ? "text-red-600" : "text-red-800",
      icon: (
        <FiXCircle
          className={`w-5 h-5 ${isWhite ? "text-red-500" : "text-red-500"}`}
        />
      ),
    },
    warning: {
      bg: isWhite ? "bg-white" : "bg-yellow-100",
      border: isWhite ? "border-gray-200" : "border-yellow-300",
      text: isWhite ? "text-yellow-600" : "text-yellow-800",
      icon: (
        <FiAlertCircle
          className={`w-5 h-5 ${
            isWhite ? "text-yellow-500" : "text-yellow-500"
          }`}
        />
      ),
    },
    info: {
      bg: isWhite ? "bg-white" : "bg-blue-100",
      border: isWhite ? "border-gray-200" : "border-blue-300",
      text: isWhite ? "text-blue-600" : "text-blue-800",
      icon: (
        <FiInfo
          className={`w-5 h-5 ${isWhite ? "text-blue-500" : "text-blue-500"}`}
        />
      ),
    },
  };

  const { bg, border, text, icon } = toastStyles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-md shadow-lg ${className}`}
        >
          <div
            className={`flex items-center gap-2 p-4 rounded-lg shadow-md border ${bg} ${border}`}
          >
            <div className="mr-3 text-xl">{icon}</div>
            <div className={`flex-1 ${text} font-medium`}>{message}</div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
