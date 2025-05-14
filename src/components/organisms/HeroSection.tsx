"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroSectionProps } from "@/interfaces/hero";
import DecryptedText from "@/components/atoms/DecryptedText";
import HeroCallToAction from "@/components/molecules/HeroCallToAction";

/**
 * HeroSection component
 * @description A hero section with animated text and a model image
 * @param props - Component properties
 * @returns HeroSection component
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  className = "",
}) => {
  return (
    <section
      className={`relative min-h-screen bg-white overflow-hidden ${className}`}
    >
      {/* Texture Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full text-black opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dotted-pattern"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 min-h-[1.2em]">
            <DecryptedText
              text={headline}
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={130}
              maxIterations={30}
              className="text-black"
              encryptedClassName="text-gray-400"
              parentClassName="inline-block"
            />
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-700 mb-8 max-w-xl min-h-[2.4em]">
            <DecryptedText
              text={subheadline}
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={20}
              maxIterations={8}
              className="text-gray-700"
              encryptedClassName="text-gray-400"
              parentClassName="inline-block"
            />
          </h2>

          <HeroCallToAction text={ctaText} url={ctaUrl} />
        </motion.div>

        {/* Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="relative h-[50vh] md:h-[70vh] w-full">
            <Image
              src="/images/model.png"
              alt="Model"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 border border-gray-200 rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -z-10 top-10 -left-10 w-40 h-40 border border-gray-300 rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
