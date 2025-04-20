"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

/**
 * Modal variant types
 */
export type ModalVariant = "default" | "danger" | "success" | "warning";

/**
 * Modal props
 * @interface ModalProps
 */
interface ModalProps {
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Modal variant that changes the visual style */
  variant?: ModalVariant;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on escape key */
  closeOnEsc?: boolean;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Optional CSS classes */
  className?: string;
  /** Overlay style variant */
  overlayStyle?: "default" | "glassmorphism";
}

/**
 * Modal component
 * @description A responsive modal dialog with customizable properties
 * @param props - Modal properties
 * @param props.title - Modal title
 * @param props.children - Modal content
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Function to close the modal
 * @param props.size - Modal size (sm, md, lg, xl)
 * @param props.variant - Modal variant (default, danger, success, warning)
 * @param props.closeOnOverlayClick - Whether to close on overlay click
 * @param props.closeOnEsc - Whether to close on escape key
 * @param props.footer - Optional footer content
 * @param props.className - Optional CSS classes
 * @param props.overlayStyle - Overlay style variant (default, glassmorphism)
 * @returns Modal component
 */
const Modal: React.FC<ModalProps> = ({
  title,
  children,
  isOpen,
  onClose,
  size = "md",
  variant = "default",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  className = "",
  overlayStyle = "default",
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEsc && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Restore scrolling
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Get size-related classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      default: // md
        return "max-w-md";
    }
  };

  // Get variant-related classes
  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return {
          header: "bg-red-50 border-b border-red-100",
          title: "text-red-700",
          closeButton: "text-red-500 hover:bg-red-100",
          icon: <RiCloseLine className="w-5 h-5" />,
        };
      case "success":
        return {
          header: "bg-green-50 border-b border-green-100",
          title: "text-green-700",
          closeButton: "text-green-500 hover:bg-green-100",
          icon: <RiCloseLine className="w-5 h-5" />,
        };
      case "warning":
        return {
          header: "bg-yellow-50 border-b border-yellow-100",
          title: "text-yellow-700",
          closeButton: "text-yellow-500 hover:bg-yellow-100",
          icon: <RiCloseLine className="w-5 h-5" />,
        };
      default:
        return {
          header: "bg-white border-b border-gray-100",
          title: "text-gray-900",
          closeButton: "text-gray-500 hover:bg-gray-100",
          icon: <RiCloseLine className="w-5 h-5" />,
        };
    }
  };

  // Get overlay style classes
  const getOverlayClasses = () => {
    switch (overlayStyle) {
      case "glassmorphism":
        // Lighter implementation with reduced blur
        return "fixed inset-0 backdrop-blur-[2px] bg-black/25 [@supports_not_(backdrop-filter:blur(0))]:bg-black/50";
      default:
        return "fixed inset-0 bg-black bg-opacity-40";
    }
  };

  const variantClasses = getVariantClasses();
  const overlayClasses = getOverlayClasses();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            ref={overlayRef}
            className={`${overlayClasses} transition-opacity`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleOverlayClick}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                className={`${getSizeClasses()} w-full rounded-lg bg-white ${
                  overlayStyle === "glassmorphism"
                    ? "shadow-xl shadow-black/10 ring-1 ring-black/5"
                    : "shadow-xl"
                } ${className}`}
                initial={{ opacity: 0, scale: 0.98, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 5 }}
                transition={{
                  duration: 0.15,
                  ease: [0.2, 0.9, 0.4, 1],
                }}
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between rounded-t-lg px-6 py-4 ${variantClasses.header}`}
                >
                  <h3
                    className={`text-lg font-semibold leading-6 ${variantClasses.title}`}
                  >
                    {title}
                  </h3>
                  <button
                    type="button"
                    className={`rounded-full p-1 ${variantClasses.closeButton} focus:outline-none`}
                    onClick={onClose}
                    aria-label="Close"
                  >
                    {variantClasses.icon}
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
