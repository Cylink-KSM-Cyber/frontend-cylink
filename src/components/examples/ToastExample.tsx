"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";
import Button from "@/components/atoms/Button";

/**
 * Toast example component
 * @description Demonstrates how to use toast notifications in components
 * @returns Toast example component
 */
const ToastExample: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-2">
        Toast Notification Examples
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={() =>
            showToast("Operation completed successfully", "success")
          }
          className="bg-green-500 hover:bg-green-600"
        >
          Show Success Toast
        </Button>

        <Button
          onClick={() => showToast("Unable to complete the operation", "error")}
          className="bg-red-500 hover:bg-red-600"
        >
          Show Error Toast
        </Button>

        <Button
          onClick={() =>
            showToast("Please note this important information", "info")
          }
          className="bg-blue-500 hover:bg-blue-600"
        >
          Show Info Toast
        </Button>

        <Button
          onClick={() =>
            showToast("This action might have consequences", "warning")
          }
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          Show Warning Toast
        </Button>
      </div>

      <div className="mt-4">
        <Button
          onClick={() => {
            // Example of staggered toasts
            showToast("Multiple notifications can be shown...", "info");

            setTimeout(() => {
              showToast("...one after another", "success");
            }, 1000);
          }}
          fullWidth
        >
          Show Multiple Toasts
        </Button>
      </div>
    </div>
  );
};

export default ToastExample;
