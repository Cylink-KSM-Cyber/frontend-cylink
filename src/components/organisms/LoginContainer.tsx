"use client";

import React from "react";
import { motion } from "framer-motion";
import Logo from "@/components/atoms/Logo";
import LoginForm from "@/components/molecules/LoginForm";

/**
 * Login container properties
 * @interface LoginContainerProps
 */
interface LoginContainerProps {
  /** Custom className */
  className?: string;
}

/**
 * Login container component
 * @description Container for the login page elements with animation
 * @param props - Login container properties
 * @returns Login container component
 */
const LoginContainer: React.FC<LoginContainerProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`login-container w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
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
            Sign in to your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-gray-600"
          >
            Welcome back! Please enter your details
          </motion.p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
        className="px-8 py-4 bg-gray-50 border-t border-gray-100"
      >
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
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

export default LoginContainer;
