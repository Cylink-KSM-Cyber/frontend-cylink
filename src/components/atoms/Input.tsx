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
    // State for input focus and password visibility
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState<boolean>(
      !!value || !!defaultValue || false
    );

    // Effect to update hasValue when value prop changes
    useEffect(() => {
      // Check if value exists and is not empty
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    // Generate unique ID for input
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const isError = !!error;

    // Toggle password visibility
    const handleTogglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPassword(!showPassword);
    };

    // Handle input focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (onFocus) onFocus(e);
    };

    // Handle input blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      // Check if input has value on blur
      setHasValue(!!e.target.value);
      if (onBlur) onBlur(e);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Update hasValue based on current input value
      setHasValue(!!e.target.value);
      if (onChange) onChange(e);
    };

    // Determine input type for password fields
    const inputType = type === "password" && showPassword ? "text" : type;

    // Adjust padding based on icons
    const inputPaddingClasses = `py-2 px-3 ${startIcon ? "pl-10" : ""} ${
      endIcon || (type === "password" && showPasswordToggle) ? "pr-10" : ""
    }`;

    return (
      <div className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`absolute transition-all duration-200 pointer-events-none z-10 ${
              focused || hasValue
                ? "text-xs -top-2 bg-white px-1 text-black left-2"
                : `text-gray-500 top-2 ${startIcon ? "left-10" : "left-3"}`
            } ${isError ? "text-red-500" : ""}`}
          >
            {label}
          </label>
        )}

        {/* Input field container with flex positioning */}
        <div className="relative flex items-center w-full">
          <input
            id={inputId}
            ref={ref}
            className={`block w-full border rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-black focus:border-black ${inputPaddingClasses} ${
              isError
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300"
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            type={inputType}
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

          {/* End icon or password toggle */}
          {((endIcon && !showPasswordToggle) || type !== "password") &&
            endIcon && (
              <div className="absolute right-3 flex items-center justify-center h-full pointer-events-none text-gray-400">
                {endIcon}
              </div>
            )}

          {/* Password toggle */}
          {type === "password" && showPasswordToggle && (
            <div className="absolute right-3 flex items-center justify-center h-full">
              <button
                type="button"
                onClick={handleTogglePassword}
                className="text-gray-400 hover:text-gray-600 focus:outline-none inline-flex items-center justify-center w-5 h-5"
              >
                {showPassword ? (
                  // Eye-slash icon (password hidden)
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
                  // Eye icon (password visible)
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
          )}
        </div>

        {/* Error or helper text */}
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1 text-sm ${
              error ? "text-red-500" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </motion.div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
