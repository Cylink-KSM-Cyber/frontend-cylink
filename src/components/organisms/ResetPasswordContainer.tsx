"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/atoms/Logo";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import ResetPasswordForm from "@/components/molecules/ResetPasswordForm";
import TokenValidationError from "@/components/molecules/TokenValidationError";
import useResetPassword from "@/hooks/useResetPassword";

/**
 * Reset password container properties
 * @interface ResetPasswordContainerProps
 */
interface ResetPasswordContainerProps {
  /** Reset token from URL */
  token?: string;
  /** Custom className */
  className?: string;
}

/**
 * Reset password container component
 * @description Container for the reset password page elements with token validation
 * @param props - Reset password container properties
 * @returns Reset password container component
 */
const ResetPasswordContainer: React.FC<ResetPasswordContainerProps> = ({
  token,
  className = "",
}) => {
  const { tokenValidation, isValidatingToken } = useResetPassword(token);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div className="px-8 pt-8 pb-6">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Logo size="lg" withLink={false} showText={true} />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl font-semibold text-gray-900"
          >
            Reset your password
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            Enter your new password below
          </motion.p>
        </div>

        <div className="mt-8">
          {/* Show loading spinner while validating token */}
          {isValidatingToken && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {/* Show error if token is invalid */}
          {!isValidatingToken && !tokenValidation.isValid && (
            <TokenValidationError tokenValidation={tokenValidation} />
          )}

          {/* Show form if token is valid */}
          {!isValidatingToken && tokenValidation.isValid && token && (
            <ResetPasswordForm token={token} />
          )}
        </div>
      </div>

      {/* Footer */}
      {!isValidatingToken && tokenValidation.isValid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className="px-8 py-4 bg-gray-50 border-t border-gray-100"
        >
          <div className="text-center text-xs text-gray-500">
            Remember your password?{" "}
            <a href="/login" className="text-black hover:underline font-medium">
              Sign in
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResetPasswordContainer;
