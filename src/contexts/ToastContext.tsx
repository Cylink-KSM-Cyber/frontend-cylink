"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import Toast, { ToastType } from "@/components/atoms/Toast";

/**
 * Toast data interface
 * @interface ToastData
 */
interface ToastData {
  message: string;
  type: ToastType;
  id: string;
  duration: number;
}

/**
 * Toast context interface
 * @interface ToastContextType
 */
interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Create context with default empty functions
const ToastContext = createContext<ToastContextType>({
  showToast: () => "",
  hideToast: () => {},
  clearAllToasts: () => {},
});

/**
 * Toast provider props
 * @interface ToastProviderProps
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider component
 * @description Provider for toast notifications
 * @param props - Provider properties
 * @returns Toast provider component
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // For debugging - log when toasts change
  useEffect(() => {
    if (toasts.length > 0) {
      console.log("Active toasts:", toasts);
    }
  }, [toasts]);

  /**
   * Add a new toast
   * @param message - Toast message
   * @param type - Toast type
   * @param duration - Toast duration in ms (0 for no auto-close)
   * @returns The ID of the created toast
   */
  const showToast = useCallback(
    (message: string, type: ToastType, duration = 4000): string => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      console.log(`Creating toast: ${id}, message: ${message}, type: ${type}`);

      setToasts((prevToasts) => [
        ...prevToasts,
        { message, type, id, duration },
      ]);
      return id;
    },
    []
  );

  /**
   * Remove a toast by ID
   * @param id - Toast ID
   */
  const hideToast = useCallback((id: string) => {
    console.log(`Hiding toast: ${id}`);
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    console.log("Clearing all toasts");
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}

      {/* Toast container with improved positioning */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
        {/* Render all active toasts */}
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => hideToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast functionality
 * @returns Toast context
 */
export const useToast = () => useContext(ToastContext);

export default ToastContext;
