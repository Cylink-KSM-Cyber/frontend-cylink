"use client";

import React from "react";
import { motion } from "framer-motion";
import type { PasswordStrength } from "@/utils/passwordStrength";
import {
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
  getPasswordStrengthText,
} from "@/utils/passwordStrength";

/**
 * Password strength indicator properties
 * @interface PasswordStrengthIndicatorProps
 */
interface PasswordStrengthIndicatorProps {
  /** Password strength analysis */
  strength: PasswordStrength;
  /** Whether to show the strength text */
  showText?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Password strength indicator component
 * @description Visual indicator showing password strength with progress bar and text
 * @param props - Password strength indicator properties
 * @returns Password strength indicator component
 */
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  showText = true,
  className = "",
}) => {
  const colorClass = getPasswordStrengthColor(strength.level);
  const bgColorClass = getPasswordStrengthBgColor(strength.level);
  const strengthText = getPasswordStrengthText(strength.level);

  // Calculate progress percentage (score out of 5 requirements)
  const progressPercentage = (strength.score / 5) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <motion.div
          className={`h-2 rounded-full transition-all duration-300 ${bgColorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Strength text */}
      {showText && strengthText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm font-medium ${colorClass}`}
        >
          Password strength: {strengthText}
        </motion.p>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
