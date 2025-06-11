"use client";

import React from "react";
import { motion } from "framer-motion";
import { PasswordStrength } from "@/interfaces/auth";
import { FiCheck, FiX } from "react-icons/fi";

/**
 * Password requirements properties
 * @interface PasswordRequirementsProps
 */
interface PasswordRequirementsProps {
  /** Password strength analysis */
  strength: PasswordStrength;
  /** Custom CSS class */
  className?: string;
}

/**
 * Password requirement item properties
 * @interface RequirementItemProps
 */
interface RequirementItemProps {
  /** Requirement text */
  text: string;
  /** Whether requirement is met */
  isValid: boolean;
  /** Animation delay */
  delay?: number;
}

/**
 * Password requirement item component
 * @description Individual requirement item with status indicator
 * @param props - Requirement item properties
 * @returns Requirement item component
 */
const RequirementItem: React.FC<RequirementItemProps> = ({
  text,
  isValid,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center space-x-2"
    >
      <div
        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isValid ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
        }`}
      >
        {isValid ? (
          <FiCheck className="w-3 h-3" />
        ) : (
          <FiX className="w-3 h-3" />
        )}
      </div>
      <span
        className={`text-sm transition-colors duration-200 ${
          isValid ? "text-green-700" : "text-gray-600"
        }`}
      >
        {text}
      </span>
    </motion.div>
  );
};

/**
 * Password requirements component
 * @description Displays password requirements checklist with dynamic status
 * @param props - Password requirements properties
 * @returns Password requirements component
 */
const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  strength,
  className = "",
}) => {
  const requirements = [
    {
      text: "At least 8 characters long",
      isValid: strength.requirements.minLength,
    },
    {
      text: "At least one uppercase letter",
      isValid: strength.requirements.hasUppercase,
    },
    {
      text: "At least one lowercase letter",
      isValid: strength.requirements.hasLowercase,
    },
    {
      text: "At least one number",
      isValid: strength.requirements.hasNumber,
    },
    {
      text: "At least one special character",
      isValid: strength.requirements.hasSpecialChar,
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Password requirements:
      </h4>
      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <RequirementItem
            key={requirement.text}
            text={requirement.text}
            isValid={requirement.isValid}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
