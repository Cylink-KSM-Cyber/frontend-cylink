"use client";

import React from "react";
import { motion } from "framer-motion";
import StepIndicator from "@/components/atoms/StepIndicator";

/**
 * Props for the ProcessStep component
 * @interface ProcessStepProps
 */
interface ProcessStepProps {
  /** The step number (1-based) */
  number: number;
  /** The title of the step */
  title: string;
  /** The description of the step */
  description: string;
  /** The icon for the step (SVG path) */
  iconPath: string;
  /** Whether this step is active */
  isActive?: boolean;
  /** Whether this step has been completed */
  isCompleted?: boolean;
  /** Delay for the animation in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProcessStep component
 * @description A component displaying a single step in the process with an icon, title, and description
 * @param props - Component properties
 * @returns ProcessStep component
 */
const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description,
  iconPath,
  isActive = false,
  isCompleted = false,
  delay = 0,
  className = "",
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-6 ${className} ${
        isActive ? "relative z-10" : "z-0"
      }`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Step indicator */}
      <div className="relative">
        <StepIndicator
          number={number}
          isActive={isActive}
          isCompleted={isCompleted}
          className={isActive ? "hexagon-glow" : ""}
        />

        {/* Connecting line to next step (hidden for the last step) */}
        {number < 4 && (
          <motion.div
            className={`absolute left-1/2 top-full w-[1px] h-16 -translate-x-1/2 
            ${isCompleted ? "bg-gray-400" : "bg-gray-200"}
            ${isActive ? "timeline-connector" : ""}`}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          />
        )}
      </div>

      {/* Step content */}
      <motion.div className="flex-1 max-w-lg" variants={contentVariants}>
        {/* Icon */}
        <div className="mb-3 w-10 h-10 flex items-center">
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${isActive ? "text-blue-400" : "text-gray-500"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: { delay: delay + 0.2, duration: 0.3 },
            }}
            viewport={{ once: true }}
          >
            <motion.path
              d={iconPath}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: delay + 0.3 }}
            />
          </motion.svg>
        </div>

        {/* Title */}
        <motion.h3
          className={`text-xl font-medium mb-2 ${
            isActive ? "text-white" : "text-gray-200"
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {description}
        </motion.p>

        {/* Decorative element */}
        <motion.div
          className={`mt-4 w-16 h-[1px] ${
            isActive ? "bg-blue-400" : "bg-gray-600"
          }`}
          initial={{ width: 0 }}
          whileInView={{ width: "4rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
        />
      </motion.div>

      {/* Hexagonal particle decoration for active step */}
      {isActive && (
        <>
          <motion.div
            className="absolute -right-8 -top-8 w-16 h-16 opacity-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 0.1,
              scale: 1,
              rotate: 30,
              transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute right-12 bottom-0 w-8 h-8 opacity-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 0.2,
              scale: 1,
              rotate: -20,
              transition: {
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              },
            }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
            </svg>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default ProcessStep;
