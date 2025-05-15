"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogoProps } from "@/interfaces/navbar";

/**
 * Logo component
 * @description A component that displays the CyLink logo with animation effects
 */
const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  withLink = true,
  showText = false,
}) => {
  // Determine size classes
  const sizeClasses =
    {
      sm: "w-24 h-8",
      md: "w-32 h-10",
      lg: "w-40 h-12",
    }[size] || "w-32 h-10";

  const logoContent = (
    <motion.div
      className={`relative ${sizeClasses}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Image
        src="/logo/logo-cylink.png"
        alt="CyLink"
        fill
        sizes="(max-width: 768px) 128px, 128px"
        className="object-contain"
        priority
      />
      {showText && <span className="sr-only">CyLink</span>}
    </motion.div>
  );

  if (withLink) {
    return (
      <Link href="/" className={`block ${className}`}>
        {logoContent}
      </Link>
    );
  }

  return <div className={`block ${className}`}>{logoContent}</div>;
};

export default Logo;
