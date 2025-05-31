"use client";

import React, { useState, forwardRef, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Input component properties
 * @interface InputProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  /** Show password toggle for password fields */
  showPasswordToggle?: boolean;
}

/**
 * Generate unique ID for input field
 * @param id - Optional provided ID
 * @returns Unique input ID
 */
const generateInputId = (id?: string): string => {
  return id ?? `input-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get input padding classes based on icons
 * @param startIcon - Left icon component
 * @param endIcon - Right icon component
 * @param type - Input type
 * @param showPasswordToggle - Whether to show password toggle
 * @returns Padding classes string
 */
const getInputPaddingClasses = (
  startIcon?: React.ReactNode,
  endIcon?: React.ReactNode,
  type?: string,
  showPasswordToggle?: boolean
): string => {
  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon || (type === "password" && showPasswordToggle);

  return `py-2 px-3 ${hasStartIcon ? "pl-10" : ""} ${
    hasEndIcon ? "pr-10" : ""
  }`;
};

/**
 * Get label positioning classes
 * @param focused - Whether input is focused
 * @param hasValue - Whether input has value
 * @param startIcon - Left icon component
 * @param isError - Whether input has error
 * @returns Label classes string
 */
const getLabelClasses = (
  focused: boolean,
  hasValue: boolean,
  startIcon?: React.ReactNode,
  isError?: boolean
): string => {
  const baseClasses =
    "absolute transition-all duration-200 pointer-events-none z-10";
  const errorClass = isError ? "text-red-500" : "";

  if (focused || hasValue) {
    return `${baseClasses} text-xs -top-2 bg-white px-1 text-black left-2 ${errorClass}`;
  }

  const leftPosition = startIcon ? "left-10" : "left-3";
  return `${baseClasses} text-gray-500 top-2 ${leftPosition} ${errorClass}`;
};

/**
 * Get input field classes
 * @param inputPaddingClasses - Padding classes
 * @param isError - Whether input has error
 * @returns Input classes string
 */
const getInputClasses = (
  inputPaddingClasses: string,
  isError: boolean
): string => {
  const baseClasses =
    "block w-full border rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:border-black";
  const errorClasses = isError
    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
    : "border-gray-300";

  return `${baseClasses} ${inputPaddingClasses} ${errorClasses}`;
};

/**
 * Password visibility toggle button component
 */
const PasswordToggle: React.FC<{
  showPassword: boolean;
  onToggle: (e: React.MouseEvent) => void;
}> = ({ showPassword, onToggle }) => (
  <div className="absolute right-3 flex items-center justify-center h-full">
    <button
      type="button"
      onClick={onToggle}
      className="text-gray-400 hover:text-gray-600 focus:outline-none inline-flex items-center justify-center w-5 h-5"
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  </div>
);

/**
 * Input component
 * @description A customizable input component with floating label and validation
 * @param props - Input properties
 * @returns Input component
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      fullWidth = false,
      className = "",
      id,
      showPasswordToggle = false,
      type = "text",
      onFocus,
      onBlur,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    // State management
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState<boolean>(
      !!(value ?? defaultValue)
    );

    // Effect to update hasValue when value prop changes
    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    // Event handlers
    const handleTogglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPassword(!showPassword);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    // Computed values
    const inputId = generateInputId(id);
    const isError = !!error;
    const actualInputType = type === "password" && showPassword ? "text" : type;
    const inputPaddingClasses = getInputPaddingClasses(
      startIcon,
      endIcon,
      type,
      showPasswordToggle
    );
    const labelClasses = getLabelClasses(focused, hasValue, startIcon, isError);
    const inputClasses = getInputClasses(inputPaddingClasses, isError);
    const shouldShowEndIcon =
      endIcon && (!showPasswordToggle || type !== "password");
    const shouldShowPasswordToggle = type === "password" && showPasswordToggle;

    return (
      <div className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Input field container */}
        <div className="relative flex items-center w-full">
          <input
            id={inputId}
            ref={ref}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            type={actualInputType}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />

          {/* Start icon */}
          {startIcon && (
            <div className="absolute left-3 flex items-center justify-center h-full pointer-events-none text-gray-400">
              {startIcon}
            </div>
          )}

          {/* End icon */}
          {shouldShowEndIcon && (
            <div className="absolute right-3 flex items-center justify-center h-full pointer-events-none text-gray-400">
              {endIcon}
            </div>
          )}

          {/* Password toggle */}
          {shouldShowPasswordToggle && (
            <PasswordToggle
              showPassword={showPassword}
              onToggle={handleTogglePassword}
            />
          )}
        </div>

        {/* Error or helper text */}
        {(error ?? helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1 text-sm ${
              error ? "text-red-500" : "text-gray-500"
            }`}
          >
            {error ?? helperText}
          </motion.div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
