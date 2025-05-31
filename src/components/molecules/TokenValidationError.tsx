"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiClock, FiXCircle } from "react-icons/fi";
import Button from "@/components/atoms/Button";
import { TokenValidation } from "@/interfaces/auth";
import Link from "next/link";

/**
 * Token validation error properties
 * @interface TokenValidationErrorProps
 */
interface TokenValidationErrorProps {
  /** Token validation state */
  tokenValidation: TokenValidation;
  /** Custom CSS class */
  className?: string;
}

/**
 * Token validation error component
 * @description Displays appropriate error message based on token validation state
 * @param props - Token validation error properties
 * @returns Token validation error component
 */
const TokenValidationError: React.FC<TokenValidationErrorProps> = ({
  tokenValidation,
  className = "",
}) => {
  // Determine icon and styling based on error type
  const getErrorConfig = () => {
    switch (tokenValidation.errorCode) {
      case "TOKEN_EXPIRED":
        return {
          icon: <FiClock className="w-12 h-12 text-orange-600" />,
          title: "Reset Link Expired",
          message:
            tokenValidation.message ??
            "This password reset link has expired. Please request a new one.",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          iconBgColor: "bg-orange-100",
        };
      case "INVALID_TOKEN":
        return {
          icon: <FiXCircle className="w-12 h-12 text-red-600" />,
          title: "Invalid Reset Link",
          message:
            tokenValidation.message ??
            "This password reset link is invalid or malformed. Please request a new one.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBgColor: "bg-red-100",
        };
      case "MISSING_TOKEN":
        return {
          icon: <FiAlertTriangle className="w-12 h-12 text-yellow-600" />,
          title: "No Reset Token",
          message:
            tokenValidation.message ??
            "No reset token was provided. Please check your email for the correct reset link.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconBgColor: "bg-yellow-100",
        };
      default:
        return {
          icon: <FiAlertTriangle className="w-12 h-12 text-gray-600" />,
          title: "Reset Link Error",
          message:
            tokenValidation.message ??
            "There was an error with your reset link. Please try again.",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          iconBgColor: "bg-gray-100",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-md mx-auto ${className}`}
    >
      <div
        className={`p-8 rounded-lg border text-center ${config.bgColor} ${config.borderColor}`}
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-20 h-20 ${config.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          {config.icon}
        </motion.div>

        {/* Error Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-4"
        >
          {config.title}
        </motion.h2>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 leading-relaxed mb-8"
        >
          {config.message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Link href="/forgot-password" className="block">
            <Button fullWidth>Request New Reset Link</Button>
          </Link>
          <Link href="/login" className="block">
            <Button fullWidth variant="outline">
              Back to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TokenValidationError;
