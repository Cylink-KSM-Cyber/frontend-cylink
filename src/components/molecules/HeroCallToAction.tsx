"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * HeroCallToAction component props interface
 */
interface HeroCallToActionProps {
  /** Text to display on the button */
  text: string;
  /** URL to navigate to when clicked */
  url: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * HeroCallToAction component
 * @description A styled call-to-action button for hero sections
 * @param props - Component properties
 * @returns HeroCallToAction component
 */
const HeroCallToAction: React.FC<HeroCallToActionProps> = ({
  text,
  url,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={className}
    >
      <Link
        href={url}
        className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg relative overflow-hidden group"
      >
        <span className="relative z-10">{text}</span>
        <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
      </Link>
    </motion.div>
  );
};

export default HeroCallToAction;
