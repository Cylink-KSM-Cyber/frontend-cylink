"use client";

import React from "react";
import { motion } from "framer-motion";
import { RiHomeLine, RiArrowLeftLine, RiCloseLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnderDevelopmentIllustration from "@/components/illustrations/UnderDevelopmentIllustration";
import Button from "@/components/atoms/Button";

/**
 * Props for UnderDevelopmentTemplate component
 */
interface UnderDevelopmentTemplateProps {
  /**
   * Page title to display
   */
  pageTitle?: string;
  /**
   * Custom message to display
   */
  customMessage?: string;
  /**
   * Link to go back to (defaults to current page without query)
   */
  backLink?: string;
  /**
   * Back link label (defaults to "Back")
   */
  backLinkLabel?: string;
  /**
   * Whether to show the home button
   */
  showHomeButton?: boolean;
  /**
   * Function to call when closing the overlay
   */
  onClose?: () => void;
  /**
   * Mode: 'overlay' for modal behavior, 'content' for main content replacement
   */
  mode?: "overlay" | "content";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnderDevelopmentTemplate Component
 * @description Flexible under development component
 * Can be used as overlay modal or main content replacement
 */
const UnderDevelopmentTemplate: React.FC<UnderDevelopmentTemplateProps> = ({
  pageTitle = "Under Development",
  customMessage,
  backLink,
  backLinkLabel = "Back",
  showHomeButton = true,
  onClose,
  mode = "overlay",
  className = "",
}) => {
  const router = useRouter();

  // Animation variants for overlay mode
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Animation variants for content mode
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Remove query parameter and navigate back
      const currentPath = window.location.pathname;
      router.push(currentPath);
    }
  };

  const handleBackClick = () => {
    if (backLink) {
      router.push(backLink);
    } else {
      handleClose();
    }
  };

  const defaultMessage =
    "This feature is currently being developed by our team. We're working hard to bring you an amazing experience!";

  // Overlay mode - modal behavior
  if (mode === "overlay") {
    return (
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          fixed inset-0 z-50 
          bg-black/50 backdrop-blur-sm
          flex items-center justify-center p-4
          ${className}
        `}
        onClick={handleClose}
      >
        <motion.div
          variants={contentVariants}
          className="
            bg-white rounded-2xl shadow-2xl 
            max-w-2xl w-full max-h-[90vh] overflow-y-auto
            p-6 lg:p-8
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#F59E0B] rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium text-[#F59E0B]">
                Development in Progress
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <RiCloseLine className="w-5 h-5 text-gray-500" />
            </button>
          </motion.div>

          {/* Content */}
          <OverlayContent
            pageTitle={pageTitle}
            customMessage={customMessage}
            defaultMessage={defaultMessage}
            handleBackClick={handleBackClick}
            backLinkLabel={backLinkLabel}
            showHomeButton={showHomeButton}
            itemVariants={itemVariants}
          />
        </motion.div>
      </motion.div>
    );
  }

  // Content mode - main content replacement
  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className={`p-6 max-w-4xl mx-auto ${className}`}
    >
      <div className="text-center min-h-[70vh] flex flex-col justify-center">
        {/* Status Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#FEF3C7] text-[#F59E0B] text-sm font-medium mb-8 mx-auto"
        >
          <div className="w-2 h-2 bg-[#F59E0B] rounded-full mr-2 animate-pulse"></div>
          Development in Progress
        </motion.div>

        {/* Illustration */}
        <motion.div
          variants={itemVariants}
          className="mb-8 w-full max-w-lg mx-auto"
        >
          <UnderDevelopmentIllustration
            className="w-full h-auto"
            width="100%"
            height="auto"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl lg:text-4xl font-bold text-[#111827] mb-4 leading-tight"
        >
          {pageTitle}
        </motion.h1>

        {/* Message */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-[#6B7280] mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          {customMessage || defaultMessage}
        </motion.p>

        {/* Features Coming Soon */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 mb-8 text-left max-w-lg mx-auto w-full border border-[#E5E7EB]"
        >
          <h3 className="text-lg font-semibold text-[#111827] mb-4 text-center">
            What&apos;s Coming
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-sm text-[#6B7280]">
              <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
              Enhanced user experience
            </li>
            <li className="flex items-center text-sm text-[#6B7280]">
              <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
              Advanced functionality
            </li>
            <li className="flex items-center text-sm text-[#6B7280]">
              <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
              Improved performance
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full"
        >
          <Button
            variant="primary"
            size="md"
            fullWidth
            startIcon={<RiArrowLeftLine />}
            onClick={handleBackClick}
            className="justify-center"
          >
            {backLinkLabel}
          </Button>

          {showHomeButton && (
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                size="md"
                fullWidth
                startIcon={<RiHomeLine />}
                className="justify-center"
              >
                Dashboard
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Support Note */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-[#9CA3AF] mt-8"
        >
          Need help?{" "}
          <a
            href="mailto:support@cylink.com"
            className="text-[#111827] hover:underline font-medium"
          >
            Contact support
          </a>
        </motion.p>
      </div>
    </motion.div>
  );
};

/**
 * Content component for overlay mode to reduce duplication
 */
const OverlayContent: React.FC<{
  pageTitle: string;
  customMessage?: string;
  defaultMessage: string;
  handleBackClick: () => void;
  backLinkLabel: string;
  showHomeButton: boolean;
  itemVariants: {
    hidden: { y: number; opacity: number };
    visible: {
      y: number;
      opacity: number;
      transition: { duration: number; ease: string };
    };
  };
}> = ({
  pageTitle,
  customMessage,
  defaultMessage,
  handleBackClick,
  backLinkLabel,
  showHomeButton,
  itemVariants,
}) => (
  <div className="text-center">
    {/* Illustration */}
    <motion.div
      variants={itemVariants}
      className="mb-8 w-full max-w-md mx-auto"
    >
      <UnderDevelopmentIllustration
        className="w-full h-auto"
        width="100%"
        height="auto"
      />
    </motion.div>

    {/* Heading */}
    <motion.h1
      variants={itemVariants}
      className="text-2xl lg:text-3xl font-bold text-[#111827] mb-4 leading-tight"
    >
      {pageTitle}
    </motion.h1>

    {/* Message */}
    <motion.p
      variants={itemVariants}
      className="text-base text-[#6B7280] mb-8 leading-relaxed"
    >
      {customMessage || defaultMessage}
    </motion.p>

    {/* Features Coming Soon */}
    <motion.div
      variants={itemVariants}
      className="bg-[#F9FAFB] rounded-xl p-6 mb-8 text-left"
    >
      <h3 className="text-lg font-semibold text-[#111827] mb-4 text-center">
        What&apos;s Coming
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center text-sm text-[#6B7280]">
          <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
          Enhanced user experience
        </li>
        <li className="flex items-center text-sm text-[#6B7280]">
          <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
          Advanced functionality
        </li>
        <li className="flex items-center text-sm text-[#6B7280]">
          <div className="w-2 h-2 bg-[#111827] rounded-full mr-3"></div>
          Improved performance
        </li>
      </ul>
    </motion.div>

    {/* Action Buttons */}
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row gap-3"
    >
      <Button
        variant="primary"
        size="md"
        fullWidth
        startIcon={<RiArrowLeftLine />}
        onClick={handleBackClick}
        className="justify-center"
      >
        {backLinkLabel}
      </Button>

      {showHomeButton && (
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            size="md"
            fullWidth
            startIcon={<RiHomeLine />}
            className="justify-center"
          >
            Dashboard
          </Button>
        </Link>
      )}
    </motion.div>

    {/* Support Note */}
    <motion.p variants={itemVariants} className="text-sm text-[#9CA3AF] mt-6">
      Need help?{" "}
      <a
        href="mailto:support@cylink.com"
        className="text-[#111827] hover:underline font-medium"
      >
        Contact support
      </a>
    </motion.p>
  </div>
);

export default UnderDevelopmentTemplate;
