"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiInfo } from "react-icons/fi";
import "@/styles/callToAction.css";

/**
 * Props for the CallToActionSection component
 * @interface CallToActionSectionProps
 */
interface CallToActionSectionProps {
  /** Title of the section */
  title?: string;
  /** Description text */
  description?: string;
  /** Text for primary CTA button */
  primaryCta?: string;
  /** URL for primary CTA button */
  primaryCtaUrl?: string;
  /** Text for secondary CTA button */
  secondaryCta?: string;
  /** URL for secondary CTA button */
  secondaryCtaUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CallToActionSection component
 * @description A section with a call-to-action card to prompt user engagement
 * @param props - Component properties
 * @returns CallToActionSection component
 */
const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  title = "Join the Secure Digital Movement",
  description = "As part of our 2025 strategic plan, CyLink represents KSM Cyber Security's commitment to developing internal tools that strengthen our branding while providing valuable learning opportunities. Experience the difference of security-focused URL shortening today.",
  primaryCta = "Create Your CyLink",
  primaryCtaUrl = "/login",
  secondaryCta = "Learn More About KSM",
  secondaryCtaUrl = "https://ksmcybersecurity.com",
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Origami-inspired decoration points
  const origamiPoints = [
    { x: "5%", y: "15%", delay: 0, rotate: 15 },
    { x: "92%", y: "25%", delay: 0.2, rotate: -20 },
    { x: "70%", y: "85%", delay: 0.3, rotate: 30 },
    { x: "20%", y: "75%", delay: 0.1, rotate: -15 },
  ];

  return (
    <section
      ref={sectionRef}
      className={`relative py-28 overflow-hidden bg-white ${className}`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] grid-pattern">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 0 L40 0 L40 40 L0 40 Z"
                  fill="none"
                  stroke="black"
                  strokeWidth="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        {/* Gradient accents */}
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-20 right-[20%] w-96 h-96 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 opacity-60 blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-40 left-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-50 to-blue-50 opacity-60 blur-3xl"
        />

        {/* Origami-inspired decorative elements */}
        {origamiPoints.map((point, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-12 opacity-[0.07] origami-animate"
            style={{
              left: point.x,
              top: point.y,
              y: index % 2 ? y1 : y2,
            }}
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{ opacity: 0.07, rotate: point.rotate }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: point.delay }}
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
            >
              <path d="M0,0 L100,0 L50,100 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* CTA card with dark background */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-xl bg-black text-white p-1"
          >
            {/* Card inner glow border */}
            <div className="absolute inset-0 rounded-xl p-[1px]">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-teal-500/30 opacity-70 blur-md"></div>
            </div>

            {/* Card content */}
            <div className="relative rounded-lg p-10 md:p-12 overflow-hidden">
              {/* Background pattern - Japanese-inspired geometric elements */}
              <div className="absolute inset-0">
                <svg
                  className="w-full h-full text-white opacity-[0.025]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <pattern
                      id="cta-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(5)"
                    >
                      <rect
                        width="2"
                        height="2"
                        fill="currentColor"
                        x="0"
                        y="0"
                      />
                      <rect
                        width="1"
                        height="20"
                        fill="currentColor"
                        x="20"
                        y="0"
                        opacity="0.5"
                      />
                      <rect
                        width="20"
                        height="1"
                        fill="currentColor"
                        x="0"
                        y="20"
                        opacity="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cta-pattern)" />
                </svg>
              </div>

              {/* Circular decorative elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full border border-white/10 opacity-50"></div>
              <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-white/5 opacity-30"></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Decorative element above title */}
                <motion.div
                  className="flex items-center justify-center mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <div className="w-2 h-2 mx-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                  <div className="h-[1px] w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className="text-gray-300 mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-8 cta-buttons"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Primary CTA */}
                  <Link
                    href={primaryCtaUrl}
                    className="cta-button relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group shine-effect"
                    onMouseEnter={() => setPrimaryHovered(true)}
                    onMouseLeave={() => setPrimaryHovered(false)}
                  >
                    <div className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:opacity-90"></div>

                    {/* Subtle animated border */}
                    <div className="absolute inset-0 border border-white/10 rounded-lg"></div>

                    {/* Button content */}
                    <span className="relative flex items-center">
                      {primaryCta}
                      <motion.span
                        animate={{
                          x: primaryHovered ? 5 : 0,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </motion.span>
                    </span>

                    {/* Shine effect */}
                    <AnimatePresence>
                      {primaryHovered && (
                        <motion.div
                          className="absolute inset-0 w-full h-full"
                          initial={{ x: "-100%", opacity: 0.5 }}
                          animate={{ x: "100%", opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                        >
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    href={secondaryCtaUrl}
                    className="cta-button relative inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group hover:bg-white/5"
                    onMouseEnter={() => setSecondaryHovered(true)}
                    onMouseLeave={() => setSecondaryHovered(false)}
                  >
                    <span className="relative flex items-center">
                      {secondaryCta}
                      <motion.span
                        animate={{
                          x: secondaryHovered ? 5 : 0,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <FiInfo className="ml-2 h-5 w-5" />
                      </motion.span>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Japanese-inspired decorative element below card */}
          <motion.div
            className="mt-10 flex justify-center accent-line"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-[1px] h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
