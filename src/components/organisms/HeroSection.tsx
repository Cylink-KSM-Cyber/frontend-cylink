"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { HeroSectionProps } from "@/interfaces/hero";
import DecryptedText from "@/components/atoms/DecryptedText";
import HeroCallToAction from "@/components/molecules/HeroCallToAction";
import "@/styles/hero.css";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Spring animations for smoother movement
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 80, damping: 30 });
  const springY3 = useSpring(y3, { stiffness: 60, damping: 30 });

  // Handle mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform mouse position to movement for decorative elements
  const decorX1 = useTransform(
    mouseX,
    (val) => (val - (containerRef.current?.offsetWidth || 0) / 2) / 20
  );
  const decorX2 = useTransform(
    mouseX,
    (val) => (val - (containerRef.current?.offsetWidth || 0) / 2) / -30
  );

  return (
    <section
      ref={containerRef}
      className={`min-h-screen relative flex items-center justify-center overflow-hidden ${className}`}
    >
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

        {/* Japanese-inspired geometric lines for depth */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="1000"
              y2="1000"
              stroke="black"
              strokeWidth="0.5"
            />
            <line
              x1="1000"
              y1="0"
              x2="0"
              y2="1000"
              stroke="black"
              strokeWidth="0.5"
            />
            <line
              x1="500"
              y1="0"
              x2="500"
              y2="1000"
              stroke="black"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="500"
              x2="1000"
              y2="500"
              stroke="black"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Decorative Japanese-inspired elements */}
      <motion.div
        style={{ y: springY1, x: decorX1 }}
        className="absolute right-[10%] top-[15%] w-16 h-16 rounded-full bg-gradient-to-r from-gray-200 to-white opacity-40 z-0"
      />
      <motion.div
        style={{ y: springY2, x: decorX2 }}
        className="absolute left-[20%] bottom-[20%] w-24 h-24 rounded-full bg-gradient-to-l from-gray-100 to-white opacity-30 z-0"
      />
      <motion.div
        style={{ y: springY3 }}
        className="absolute right-[30%] top-[40%] w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-white opacity-25 z-0"
      />

      {/* Subtle line elements */}
      <motion.div
        className="absolute right-[20%] top-[20%] w-[150px] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-20"
        style={{ rotate: 45, y: springY1 }}
      />
      <motion.div
        className="absolute left-[15%] top-[30%] w-[100px] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-20"
        style={{ rotate: -30, y: springY2 }}
      />

      {/* Model positioned with decorative enhancements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="hero-model-container"
      >
        {/* Decorative elements around model */}
        <motion.div
          style={{ y: springY1, x: decorX1 }}
          className="absolute right-[-10%] top-[10%] w-32 h-32 rounded-full bg-gradient-to-tr from-transparent to-gray-50 border border-gray-100 opacity-70 z-0 mobile-hidden"
        />
        <motion.div
          style={{ y: springY2, x: decorX2 }}
          className="absolute left-[5%] top-[50%] w-20 h-20 rounded-full bg-gradient-to-br from-transparent to-gray-100 opacity-60 z-0 mobile-hidden"
        />

        {/* Fine line pattern inspired by Japanese design */}
        <motion.div
          style={{ y: springY3 }}
          className="absolute -left-5 top-1/3 h-[200px] w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent mobile-hidden"
        />
        <motion.div
          style={{ y: springY2 }}
          className="absolute -left-10 top-1/4 h-[150px] w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent mobile-hidden"
        />

        <div className="relative w-full h-full">
          <Image
            src="/images/model.png"
            alt="Model"
            fill
            className="object-contain object-bottom object-right"
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </motion.div>

      {/* Centered Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center md:items-start w-full">
          {/* Text Content - centered on mobile, left aligned on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-[50%] max-w-[600px] mx-auto md:mx-0 md:ml-[10%] text-center md:text-left hero-content-mobile md:bg-transparent md:backdrop-blur-none md:shadow-none md:p-0"
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

            {/* Centered CTA */}
            <div className="flex justify-center md:justify-start">
              <HeroCallToAction text={ctaText} url={ctaUrl} />

              {/* Secondary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="ml-4"
              >
                <a
                  href="#explore"
                  className="inline-flex items-center px-6 py-4 text-black hover:text-gray-700 font-medium transition-all duration-300"
                >
                  Explore
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v10.586l-3.293-3.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L11 14.586V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile-specific accent elements */}
      <div className="mobile-accent">
        <div className="absolute bottom-[10%] left-[5%] w-12 h-12 rounded-full bg-gradient-to-tr from-transparent to-gray-100 opacity-50 float-animation" />
        <div className="absolute top-[15%] right-[10%] w-8 h-8 rounded-full bg-gradient-to-br from-transparent to-gray-200 opacity-50 pulse-animation" />
        <div
          className="absolute top-[40%] left-[10%] w-6 h-6 rounded-full bg-gradient-to-tl from-transparent to-gray-100 opacity-40 pulse-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[30%] right-[5%] w-10 h-10 rounded-full bg-gradient-to-br from-transparent to-gray-200 opacity-30 float-animation"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Visual transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10">
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 bottom-8 transform -translate-x-1/2"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
