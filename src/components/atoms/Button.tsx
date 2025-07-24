"use client";

import React from "react";

/**
 * Prop types for Button component
 */
interface ButtonProps {
  /**
   * Button label content
   */
  children: React.ReactNode;
  /**
   * Function to call when button is clicked
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Button variant (determines styling)
   */
  variant?: "primary" | "secondary" | "outline" | "text" | "danger";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether the button takes full width
   */
  fullWidth?: boolean;
  /**
   * Optional icon to display before text
   */
  startIcon?: React.ReactNode;
  /**
   * Optional icon to display after text
   */
  endIcon?: React.ReactNode;
  /**
   * Button type attribute
   */
  type?: "button" | "submit" | "reset";
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * Button Component
 * @description A versatile button component with multiple variants and states
 */
const Button: React.FC<ButtonProps & { "data-tour-id"?: string }> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  startIcon,
  endIcon,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  "data-tour-id": dataTourId,
}) => {
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs";
      case "lg":
        return "px-6 py-3 text-base";
      default: // md
        return "px-4 py-2 text-sm";
    }
  };

  // Determine variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-black text-white hover:bg-[#333333] focus:ring-black";
      case "secondary":
        return "bg-[#F5F5F5] text-black hover:bg-[#E0E0E0] focus:ring-[#333333]";
      case "outline":
        return "bg-transparent text-black border border-black hover:bg-[#F5F5F5] focus:ring-black";
      case "text":
        return "bg-transparent text-black hover:bg-[#F5F5F5] focus:ring-black";
      case "danger":
        return "bg-[#D32F2F] text-white hover:bg-[#C62828] focus:ring-[#D32F2F]";
      default:
        return "bg-black text-white hover:bg-[#333333] focus:ring-black";
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${fullWidth ? "w-full" : ""}
        font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        inline-flex items-center justify-center
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...(dataTourId ? { "data-tour-id": dataTourId } : {})}
    >
      {loading && <LoadingSpinner />}
      {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export default Button;
