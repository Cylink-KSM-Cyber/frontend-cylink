/**
 * NavbarDecorations component
 * @description Subtle Japanese-inspired decorative elements for the navbar
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { NavbarDecorationsProps } from "@/interfaces/navbar";
import JapanesePattern from "./JapanesePattern";

/**
 * NavbarDecorations component with subtle Japanese-inspired decorative elements
 * @param props - Component properties
 * @returns NavbarDecorations component
 */
const NavbarDecorations: React.FC<NavbarDecorationsProps> = ({
  isScrolled,
}) => {
  return (
    <>
      {/* Horizontal line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0.3 : 0.1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Diagonal line element - top right */}
      <motion.div
        className="absolute top-0 right-[20%] w-[50px] h-[1px] bg-black/10"
        style={{ rotate: 45 }}
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isScrolled ? 0.2 : 0.1,
          width: isScrolled ? "30px" : "50px",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Diagonal line element - top left */}
      <motion.div
        className="absolute top-0 left-[20%] w-[50px] h-[1px] bg-black/10"
        style={{ rotate: -45 }}
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isScrolled ? 0.2 : 0.1,
          width: isScrolled ? "30px" : "50px",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Background patterns */}
      <JapanesePattern
        pattern="asanoha"
        opacity={isScrolled ? 3 : 2}
        animated={true}
      />
    </>
  );
};

export default NavbarDecorations;
