"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./Input";
import {
  getCharacterCountDisplay,
  getCharacterCountStyle,
  getCharacterCountA11yAttributes,
  validateCharacterCount,
  CHARACTER_COUNT_CONSTANTS,
  getCharacterCountStatus,
} from "@/utils/characterCounter";
import { URL_CUSTOM_CODE_LIMITS } from "@/config/urlLimits";
import type { CharacterStatus } from "@/interfaces/characterCounter";

/**
 * Props for InputWithCharacterCounter component
 * @interface InputWithCharacterCounterProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
interface InputWithCharacterCounterProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Left icon component */
  startIcon?: React.ReactNode;
  /** Right icon component */
  endIcon?: React.ReactNode;
  /** Full width input */
  fullWidth?: boolean;
  /** Maximum character limit (default: 30) */
  maxLength?: number;
  /** Warning threshold as percentage of maxLength (default: 0.8) */
  warningThreshold?: number;
  /** Show character counter (default: true) */
  showCharacterCounter?: boolean;
  /** Character counter position (default: 'bottom-right') */
  counterPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Field name for accessibility (default: 'input') */
  fieldName?: string;

  /** Callback when character limit is reached */
  onCharacterLimitReached?: (isReached: boolean) => void;
  /** Callback when character count changes */
  onCharacterCountChange?: (count: number, max: number) => void;
}

/**
 * InputWithCharacterCounter Component
 * @description Enhanced input component with character counting functionality
 * @param props - Component properties
 * @returns InputWithCharacterCounter component
 */
const InputWithCharacterCounter: React.FC<InputWithCharacterCounterProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  maxLength = URL_CUSTOM_CODE_LIMITS.MAX_LENGTH,
  warningThreshold = CHARACTER_COUNT_CONSTANTS.DEFAULT_WARNING_THRESHOLD,
  showCharacterCounter = true,
  counterPosition = "bottom-right",
  fieldName = "input",
  onCharacterLimitReached,
  onCharacterCountChange,
  onChange,
  value,
  className = "",
  ...props
}) => {
  // State for character count
  const [characterCount, setCharacterCount] = useState(0);

  // Update character count when value changes
  useEffect(() => {
    const currentValue = value || "";
    const count = typeof currentValue === "string" ? currentValue.length : 0;
    setCharacterCount(count);

    // Notify character count change
    onCharacterCountChange?.(count, maxLength);

    // Notify character limit reached
    const isLimitReached = count >= maxLength;
    onCharacterLimitReached?.(isLimitReached);
  }, [value, maxLength, onCharacterCountChange, onCharacterLimitReached]);

  // Character count display and styling
  const characterCountDisplay = useMemo(
    () => getCharacterCountDisplay(characterCount, maxLength),
    [characterCount, maxLength]
  );

  const characterCountStyle = useMemo(
    () =>
      getCharacterCountStyle(
        characterCount,
        maxLength,
        Math.floor(maxLength * warningThreshold)
      ),
    [characterCount, maxLength, warningThreshold]
  );

  const characterCountA11yAttributes = useMemo(
    () => getCharacterCountA11yAttributes(characterCount, maxLength, fieldName),
    [characterCount, maxLength, fieldName]
  );

  // Handle input change with character limit enforcement
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Validate and potentially truncate the value
      const validatedValue = validateCharacterCount(newValue, maxLength);

      // If value was truncated, update the input
      if (validatedValue !== newValue) {
        e.target.value = validatedValue;
      }

      // Call original onChange handler
      onChange?.(e);
    },
    [onChange, maxLength]
  );

  // Counter position classes
  const getCounterPositionClasses = (position: string) => {
    switch (position) {
      case "bottom-left":
        return "left-0 bottom-0";
      case "top-right":
        return "right-0 top-0";
      case "top-left":
        return "left-0 top-0";
      case "bottom-right":
      default:
        return "right-0 bottom-0";
    }
  };

  // Animation variants for character counter
  const counterVariants = {
    normal: {
      scale: 1,
      opacity: 0.7,
      transition: { duration: 0.2 },
    },
    warning: {
      scale: 1.05,
      opacity: 0.9,
      transition: { duration: 0.2 },
    },
    danger: {
      scale: 1.1,
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  // Determine animation state
  const getAnimationState = (): CharacterStatus => {
    return getCharacterCountStatus(
      characterCount,
      maxLength,
      Math.floor(maxLength * warningThreshold)
    );
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
      {/* Main Input Component */}
      <Input
        label={label}
        error={error}
        helperText={helperText}
        startIcon={startIcon}
        endIcon={endIcon}
        fullWidth={fullWidth}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />

      {/* Character Counter */}
      {showCharacterCounter && (
        <div className="relative">
          <AnimatePresence>
            <motion.div
              className={`absolute ${getCounterPositionClasses(
                counterPosition
              )} mt-1 mr-1 pointer-events-none`}
              variants={counterVariants}
              animate={getAnimationState()}
              initial="normal"
              {...characterCountA11yAttributes}
            >
              <span
                className={`
                  text-xs 
                  ${characterCountStyle.textColor} 
                  ${characterCountStyle.fontWeight}
                  ${characterCountStyle.additionalClasses}
                  select-none
                  transition-colors
                  duration-200
                `}
              >
                {characterCountDisplay}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Enhanced Helper Text with Character Limit Info */}
      {helperText && maxLength && (
        <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
          <span>{helperText}</span>
          {!showCharacterCounter && (
            <span className={characterCountStyle.textColor}>
              {characterCountDisplay}
            </span>
          )}
        </div>
      )}

      {/* Screen Reader Only Character Count */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {characterCount >= maxLength && (
          <span>Character limit reached. {maxLength} characters maximum.</span>
        )}
        {characterCount >= Math.floor(maxLength * warningThreshold) &&
          characterCount < maxLength && (
            <span>
              Approaching character limit. {maxLength - characterCount}{" "}
              characters remaining.
            </span>
          )}
      </div>
    </div>
  );
};

export default InputWithCharacterCounter;
