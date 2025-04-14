"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";
import Button from "@/components/atoms/Button";

/**
 * Toast tester component
 * @description A simple component for testing toast notifications
 * @returns Toast tester component
 */
const ToastTester: React.FC = () => {
  const { showToast, clearAllToasts } = useToast();

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm m-4">
      <h2 className="text-lg font-semibold mb-3">Test Toast Notifications</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => showToast("Success notification example", "success")}
          className="bg-green-500 hover:bg-green-600"
          size="sm"
        >
          Success Toast
        </Button>
        <Button
          onClick={() => showToast("Error notification example", "error")}
          className="bg-red-500 hover:bg-red-600"
          size="sm"
        >
          Error Toast
        </Button>
        <Button
          onClick={() => showToast("Info notification example", "info")}
          className="bg-blue-500 hover:bg-blue-600"
          size="sm"
        >
          Info Toast
        </Button>
        <Button
          onClick={() => showToast("Warning notification example", "warning")}
          className="bg-yellow-500 hover:bg-yellow-600"
          size="sm"
        >
          Warning Toast
        </Button>
        <Button
          onClick={() => clearAllToasts()}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 col-span-2"
          size="sm"
        >
          Clear All Toasts
        </Button>
      </div>
    </div>
  );
};

export default ToastTester;
