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
const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link href="/" className={`block ${className}`}>
      <motion.div
        className="relative w-32 h-10"
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
      </motion.div>
    </Link>
  );
};

export default Logo;
