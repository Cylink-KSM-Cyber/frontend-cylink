/**
 * Navbar component
 * @description A minimalist navbar with logo and login button
 */

"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Logo from "@/components/atoms/Logo";
import NavButton from "@/components/atoms/NavButton";
import NavbarDecorations from "@/components/atoms/NavbarDecorations";
import { NavbarProps } from "@/interfaces/navbar";

/**
 * Navbar component with scroll-based background opacity change
 * @param props - Component properties
 * @returns Navbar component
 */
const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Update the state when scroll position changes
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className={`w-full transition-all duration-300 relative ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Decorative elements */}
        <NavbarDecorations isScrolled={isScrolled} />

        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              {/* Decorative line element */}
              <motion.span
                className="absolute -left-8 top-1/2 w-5 h-[1px] bg-black/20"
                initial={{ width: 0 }}
                animate={{ width: 20 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />

              <NavButton href="/login">Login</NavButton>
            </motion.nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
