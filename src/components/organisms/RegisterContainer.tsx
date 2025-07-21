"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/atoms/Logo";
import RegisterForm from "@/components/molecules/RegisterForm";

/**
 * Register container properties
 * @interface RegisterContainerProps
 */
interface RegisterContainerProps {
  /** Custom className */
  className?: string;
}

/**
 * Register container component
 * @description Container for the Register page elements with animation
 * @param props - Register container properties
 * @returns Register container component
 */
const RegisterContainer: React.FC<RegisterContainerProps> = ({
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`Register-container w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
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
            Sign up your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            Welcome to Cylink! Please enter your details
          </motion.p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
        className="px-8 py-4 bg-gray-50 border-t border-gray-100"
      >
        <div className="text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-black hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-black hover:underline">
            Privacy Policy
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterContainer;
