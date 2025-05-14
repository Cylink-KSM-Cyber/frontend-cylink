"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Props for the SectionTitle component
 * @interface SectionTitleProps
 */
interface SectionTitleProps {
  /** The title text */
  title: string;
  /** The subtitle text (optional) */
  subtitle?: string;
  /** Whether to align the title to the center */
  centered?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SectionTitle component
 * @description A styled title component for sections with optional subtitle
 * @param props - Component properties
 * @returns SectionTitle component
 */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
  className = "",
}) => {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 relative inline-block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        {title}

        {/* Decorative underline */}
        <motion.span
          className="absolute -bottom-3 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </motion.h2>

      {subtitle && (
        <motion.p
          className="text-gray-600 mt-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Japanese-inspired elements */}
      <div className="relative">
        <motion.div
          className="absolute -top-4 -left-10 w-8 h-8 opacity-[0.15]"
          initial={{ opacity: 0, rotate: -5 }}
          whileInView={{ opacity: 0.15, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -right-10 w-8 h-8 opacity-[0.15]"
          initial={{ opacity: 0, rotate: 5 }}
          whileInView={{ opacity: 0.15, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionTitle;
