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
      <div className="container mx-auto px-6 py-16 md:py-28 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-[55%] mb-16 md:mb-0 z-10"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full md:w-[50%] relative z-0 md:-mr-[5%]"
          >
            <div className="relative h-[60vh] md:h-[70vh]">
              <Image
                src="/images/model.png"
                alt="Model"
                fill
                className="object-contain md:object-right"
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
