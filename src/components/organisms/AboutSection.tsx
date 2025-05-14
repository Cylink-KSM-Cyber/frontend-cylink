"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AboutContent from "@/components/molecules/AboutContent";
import "@/styles/about.css";

/**
 * Props for the AboutSection component
 * @interface AboutSectionProps
 */
interface AboutSectionProps {
  /** Title of the section */
  title?: string;
  /** Description text */
  description?: string;
  /** Array of key highlight points */
  highlights?: string[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * AboutSection component
 * @description A section showcasing information about CyLink with a dark contrasting background
 * @param props - Component properties
 * @returns AboutSection component
 */
const AboutSection: React.FC<AboutSectionProps> = ({
  title = "Built by Security Experts, for Security Enthusiasts",
  description = "CyLink is developed by KSM Cyber Security UPNVJ as part of our commitment to digital independence and cybersecurity education. This platform combines practical utility with educational opportunities, allowing our members to learn modern web development while creating a tool that strengthens our digital identity.",
  highlights = [
    "100% Developed In-House by KSM Cyber Security",
    "Secure by Design with URL Validation",
    "Part of Bootcamp Website Development Initiative",
    "Supporting KSM's 2025 Vision for Digital Learning",
  ],
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section
      ref={sectionRef}
      className={`about-section relative py-20 overflow-hidden ${className}`}
    >
      {/* Contrasting dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background texture using CSS */}
        <div className="noise-texture absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>

        {/* Japanese-inspired geometric patterns */}
        <div className="grid-pattern absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="40"
                  height="40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Decorative elements with parallax effect */}
      <motion.div
        style={{ y: y1, rotate: rotation }}
        className="circle-accent large absolute right-[5%] top-[10%] opacity-20 animate-float"
      />
      <motion.div
        style={{ y: y2 }}
        className="circle-accent medium absolute left-[10%] bottom-[15%] opacity-10 animate-pulse"
      />

      {/* Japanese-inspired line accents */}
      <div className="line-accent absolute left-0 top-0 w-20"></div>
      <div className="line-accent absolute right-0 bottom-0 w-20"></div>

      {/* Visual connection to previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AboutContent
            title={title}
            description={description}
            highlights={highlights}
          />
        </div>
      </div>

      {/* Bottom transition element */}
      <div className="absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none opacity-10">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24L24 0" stroke="white" strokeWidth="0.5" />
          <path d="M0 12L12 0" stroke="white" strokeWidth="0.5" />
          <path d="M12 24L24 12" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none opacity-10">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L24 24" stroke="white" strokeWidth="0.5" />
          <path d="M0 12L12 24" stroke="white" strokeWidth="0.5" />
          <path d="M12 0L24 12" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  );
};

export default AboutSection;
