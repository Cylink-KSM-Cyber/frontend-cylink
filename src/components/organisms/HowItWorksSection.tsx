"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ProcessStep from "@/components/molecules/ProcessStep";
import "@/styles/howitworks.css";

/**
 * Props for the HowItWorksSection component
 * @interface HowItWorksSectionProps
 */
interface HowItWorksSectionProps {
  /** Title of the section */
  title?: string;
  /** Subtitle of the section */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Icons for each step (SVG paths)
 */
const STEP_ICONS = {
  authentication:
    "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  transformation: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3",
  identity:
    "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  analytics:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
};

/**
 * Step data for the How It Works section
 */
const STEPS = [
  {
    number: 1,
    title: "Secure Authentication",
    description: "Sign in with your verified KSM credentials",
    iconPath: STEP_ICONS.authentication,
  },
  {
    number: 2,
    title: "Link Transformation",
    description:
      "Enter your URL, customize security options and expiry settings",
    iconPath: STEP_ICONS.transformation,
  },
  {
    number: 3,
    title: "Identity Embedding",
    description:
      "Generate your branded short URL and custom QR code with KSM logo",
    iconPath: STEP_ICONS.identity,
  },
  {
    number: 4,
    title: "Data-Driven Insights",
    description: "Track performance and gather valuable usage analytics",
    iconPath: STEP_ICONS.analytics,
  },
];

/**
 * HowItWorksSection component
 * @description A section showcasing the step-by-step process with animated timeline
 * @param props - Component properties
 * @returns HowItWorksSection component
 */
const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  title = "Security and Simplicity in Four Steps",
  subtitle = "Our streamlined process ensures both ease of use and robust security measures.",
  className = "",
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Scroll-based effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects for decorative elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0.15, 0.15, 0]
  );

  // Update active step based on scroll position
  useEffect(() => {
    if (!stepsRef.current) return;

    const handleScroll = () => {
      if (!stepsRef.current) return;

      const stepsEl = stepsRef.current;
      const stepsTop = stepsEl.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Calculate which step should be active based on scroll position
      const stepHeight = stepsEl.clientHeight / STEPS.length;
      const scrollPosition = windowHeight - stepsTop;

      // Determine active step (1-based)
      const step = Math.min(
        Math.max(Math.ceil(scrollPosition / stepHeight - 0.5), 1),
        STEPS.length
      );

      setActiveStep(step);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden ${className}`}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0">
          {/* Hexagonal grid pattern */}
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hexagrid"
                x="0"
                y="0"
                width="50"
                height="86.6"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(3) rotate(0)"
              >
                <g stroke="white" strokeWidth="0.2" fill="none">
                  <path d="M25,43.3 L0,43.3 L0,13 L25,0 L50,13 L50,43.3 L25,43.3 Z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagrid)" />
          </svg>
        </div>
      </div>

      {/* Circuit board pattern - different from previous sections */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none circuit-animate"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M100,0 L100,200 M0,100 L200,100"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle cx="100" cy="100" r="3" fill="white" />
              <circle cx="0" cy="100" r="3" fill="white" />
              <circle cx="200" cy="100" r="3" fill="white" />
              <circle cx="100" cy="0" r="3" fill="white" />
              <circle cx="100" cy="200" r="3" fill="white" />
              <path
                d="M100,0 L150,50 L200,50"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M0,100 L50,50 L50,0"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M100,200 L50,150 L0,150"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M200,100 L150,150 L150,200"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
              <circle cx="50" cy="50" r="3" fill="white" />
              <circle cx="150" cy="50" r="3" fill="white" />
              <circle cx="50" cy="150" r="3" fill="white" />
              <circle cx="150" cy="150" r="3" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </motion.div>

      {/* Floating hexagons */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-20 left-[15%] w-16 h-16 opacity-10 pointer-events-none animate-float-medium"
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="white"
          strokeWidth="1"
          className="animate-rotate-slow"
        >
          <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
        </svg>
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-20 right-[20%] w-24 h-24 opacity-5 pointer-events-none animate-float-slow"
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

      {/* Content container */}
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Section header */}
        <div className="mb-16">
          <motion.div
            className="flex items-center justify-center mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Decorative hexagons */}
            <div className="w-6 h-6 opacity-70 mx-2">
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>

          {/* Japanese-inspired decorative separator */}
          <motion.div
            className="flex items-center justify-center mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <div className="w-2 h-2 mx-2">
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
              </svg>
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </motion.div>
        </div>

        {/* Process steps */}
        <div ref={stepsRef} className="py-8 relative">
          {/* Vertical timeline line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-800 transform -translate-x-1/2 hidden md:block"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          {/* Process steps */}
          <div className="space-y-16 md:space-y-24 py-4 relative">
            {STEPS.map((step, index) => (
              <ProcessStep
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                iconPath={step.iconPath}
                isActive={step.number === activeStep}
                isCompleted={step.number < activeStep}
                delay={0.2 * index}
              />
            ))}
          </div>
        </div>

        {/* CTA button */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-md bg-transparent border border-gray-700 text-white transition-all duration-300">
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative flex items-center">
              Start Securing Your Links
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
