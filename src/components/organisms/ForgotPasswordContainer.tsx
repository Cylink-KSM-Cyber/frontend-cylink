"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/atoms/Logo";
import ForgotPasswordForm from "@/components/molecules/ForgotPasswordForm";

/**
 * Forgot password container properties
 * @interface ForgotPasswordContainerProps
 */
interface ForgotPasswordContainerProps {
  /** Custom className */
  className?: string;
}

/**
 * Forgot password container component
 * @description Container for the forgot password page elements with animation
 * @param props - Forgot password container properties
 * @returns Forgot password container component
 */
const ForgotPasswordContainer: React.FC<ForgotPasswordContainerProps> = ({
  className = "",
}) => {
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
            Forgot your password?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            No worries, we&apos;ll help you reset it
          </motion.p>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>

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
    </motion.div>
  );
};

export default ForgotPasswordContainer;
