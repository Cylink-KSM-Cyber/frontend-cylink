import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

/**
 * Error Message Component
 * Displays an error message with an icon
 *
 * @param message - Error message to display
 * @param className - Additional CSS classes
 * @returns React component
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center p-3 bg-red-50 text-red-700 rounded-md ${className}`}
    >
      <RiErrorWarningLine className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default ErrorMessage;
