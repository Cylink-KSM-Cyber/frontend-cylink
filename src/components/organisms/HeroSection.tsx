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
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Enhanced Background with Gradient and Pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white to-gray-50">
        <svg
          className="w-full h-full text-black opacity-[0.015]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dotted-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(5)"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>

        {/* Subtle diagonal lines for added depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 12px)`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 py-16 md:py-28 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 mb-16 md:mb-0 md:pr-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-8 min-h-[1.2em] tracking-tight">
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

          <h2 className="text-xl md:text-2xl text-gray-700 mb-10 max-w-xl min-h-[2.4em] leading-relaxed">
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

            {/* Single subtle decorative element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -z-10 -bottom-16 -right-16 w-72 h-72 border border-gray-200 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
