"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Logo properties interface
 * @interface LogoProps
 */
interface LogoProps {
  /** Logo size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to include link to homepage */
  withLink?: boolean;
  /** Whether to show text with logo */
  showText?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Logo component
 * @description Displays the CyLink logo with optional link to homepage
 * @param props - Logo properties
 * @returns Logo component
 */
const Logo: React.FC<LogoProps> = ({
  size = "md",
  withLink = true,
  showText = true,
  className = "",
}) => {
  // Logo image dimensions based on size
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  // Text size classes
  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const logoContent = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center font-bold ${className}`}
    >
      <Image
        src="/logo/logo-cylink.png"
        alt="CyLink Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className="mr-2"
        priority
      />

      {showText && (
        <div className={textSizeClasses[size]}>
          <span>Cy</span>
          <span className="text-black">Link</span>
        </div>
      )}
    </motion.div>
  );

  if (withLink) {
    return (
      <Link href="/" className="focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
