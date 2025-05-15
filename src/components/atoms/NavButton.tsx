/**
 * NavButton component
 * @description A minimalist button with Japanese-inspired styling for navigation
 */

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NavButtonProps } from "@/interfaces/navbar";
import useHoverEffect from "@/hooks/useHoverEffect";
import JapanesePattern from "./JapanesePattern";

/**
 * NavButton component with Japanese-inspired styling and hover animations
 * @param props - Component properties
 * @returns NavButton component
 */
const NavButton: React.FC<NavButtonProps> = ({
  children,
  href,
  className = "",
}) => {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverEffect();

  return (
    <Link href={href} className={className}>
      <motion.div
        className="relative px-6 py-2 text-black font-medium group overflow-hidden border border-black/10 rounded-sm"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Button text with subtle animation */}
        <motion.span
          className="relative z-10 inline-block"
          animate={{
            y: isHovered ? -1 : 0,
            color: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)",
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Decorative corner lines - top left */}
        <motion.span
          className="absolute top-0 left-0 w-3 h-[1px] bg-black"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? 12 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute top-0 left-0 w-[1px] h-3 bg-black"
          initial={{ height: 0 }}
          animate={{ height: isHovered ? 12 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Decorative corner lines - bottom right */}
        <motion.span
          className="absolute bottom-0 right-0 w-3 h-[1px] bg-black"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? 12 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute bottom-0 right-0 w-[1px] h-3 bg-black"
          initial={{ height: 0 }}
          animate={{ height: isHovered ? 12 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Animated background fill */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 -z-10"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Japanese pattern background */}
        {isHovered && (
          <JapanesePattern
            pattern="asanoha"
            opacity={8}
            animated={true}
            className="z-20"
          />
        )}

        {/* Subtle glow effect */}
        <motion.span
          className="absolute inset-0 bg-white/0 shadow-[0_0_10px_rgba(0,0,0,0.05)] -z-30"
          animate={{
            boxShadow: isHovered
              ? "0 0 15px rgba(0,0,0,0.1)"
              : "0 0 10px rgba(0,0,0,0.05)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
};

export default NavButton;
