"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiLink, FiBarChart2 } from "react-icons/fi";
import { MdQrCode2 } from "react-icons/md";
import FeatureCard from "@/components/molecules/FeatureCard";
import SectionTitle from "@/components/atoms/SectionTitle";

/**
 * Props for the FeaturesSection component
 * @interface FeaturesSectionProps
 */
interface FeaturesSectionProps {
  /** Title of the section */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeaturesSection component
 * @description A section showcasing the main features with glassmorphism cards
 * @param props - Component properties
 * @returns FeaturesSection component
 */
const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = "Powerful Tools at Your Fingertips",
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
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Feature content
  const features = [
    {
      title: "URL Shortening",
      description:
        "Convert long URLs into concise cylink.id links with custom expiry options",
      icon: FiLink,
      delay: 0,
    },
    {
      title: "QR Code Generation",
      description:
        "Create branded QR codes with the KSM Cyber Security logo embedded at the center",
      icon: MdQrCode2,
      delay: 0.2,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track clicks, monitor device types, and analyze usage patterns for your links",
      icon: FiBarChart2,
      delay: 0.4,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 overflow-hidden ${className}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>

        {/* Decorative elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 right-[15%] w-64 h-64 bg-gradient-to-r from-gray-300/10 to-gray-100/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 left-[10%] w-72 h-72 bg-gradient-to-l from-gray-300/10 to-gray-100/5 rounded-full blur-3xl"
        />

        {/* Japanese-inspired line pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="grid-pattern"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="10"
                y1="0"
                x2="10"
                y2="10"
                stroke="black"
                strokeWidth="0.1"
              />
              <line
                x1="0"
                y1="10"
                x2="10"
                y2="10"
                stroke="black"
                strokeWidth="0.1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>

      {/* Visual connection to previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section title */}
        <SectionTitle title={title} className="text-center mb-16" />

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              animationDelay={feature.delay}
              className="h-full"
            />
          ))}
        </div>
      </div>

      {/* Bottom transition element */}
      <motion.div
        style={{ opacity }}
        className="absolute left-1/2 bottom-6 transform -translate-x-1/2 z-10"
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
