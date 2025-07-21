"use client";

import React from "react";
import { motion } from "framer-motion";
import RegisterContainer from "@/components/organisms/RegisterContainer";

/**
 * Register template properties
 * @interface RegisterTemplateProps
 */
interface RegisterTemplateProps {
  /** Custom className */
  className?: string;
}

/**
 * Register template component
 * @description Template for the Register page with stylized background and layout
 * @param props - Register template properties
 * @returns Register template component
 */
const RegisterTemplate: React.FC<RegisterTemplateProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-100 to-white rounded-bl-full opacity-80" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-gray-200 to-white rounded-tr-full opacity-80" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-gray-200 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-gray-300 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <RegisterContainer />
      </div>
    </div>
  );
};

export default RegisterTemplate;
