"use client";

import React from "react";

/**
 * Button properties
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Is button currently in loading state */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Optional icon component to display */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Children elements */
  children: React.ReactNode;
}

/**
 * Button component
 * @description A customizable button component with various styles and states
 * @param props - Button properties
 * @returns Button component
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  children,
  disabled,
  ...props
}) => {
  // Base styles
  const baseClasses =
    "font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center";

  // Size classes
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
    outline:
      "bg-transparent border border-black text-black hover:bg-black/5 active:bg-black/10",
    ghost: "bg-transparent text-black hover:bg-black/5 active:bg-black/10",
  };

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Disabled state
  const disabledClasses =
    disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}

      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}

      {children}

      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
