"use client";

import { useToast } from "@/contexts/ToastContext";

/**
 * Custom hook that demonstrates toast usage
 * @description Example hook to showcase how to use toast notifications in different scenarios
 */
const useToastExample = () => {
  const { showToast } = useToast();

  /**
   * Show a success toast
   * @param message - Success message
   */
  const showSuccessToast = (
    message: string = "Operation completed successfully"
  ) => {
    showToast(message, "success");
  };

  /**
   * Show an error toast
   * @param message - Error message
   */
  const showErrorToast = (message: string = "An error occurred") => {
    showToast(message, "error");
  };

  /**
   * Show an info toast
   * @param message - Info message
   */
  const showInfoToast = (message: string = "Information notification") => {
    showToast(message, "info");
  };

  /**
   * Show a warning toast
   * @param message - Warning message
   */
  const showWarningToast = (message: string = "Warning notification") => {
    showToast(message, "warning");
  };

  /**
   * Example function to demonstrate form submission with toast
   */
  const submitFormExample = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast on successful submission
      showSuccessToast("Form submitted successfully");

      return true;
    } catch {
      // Show error toast if submission fails
      showErrorToast("Failed to submit form");
      return false;
    }
  };

  /**
   * Example function to demonstrate operation confirmation with toast
   */
  const confirmOperationExample = () => {
    showWarningToast("This action cannot be undone. Are you sure?");
    // In a real scenario, this would be connected to a confirmation dialog
  };

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    submitFormExample,
    confirmOperationExample,
  };
};

export default useToastExample;
