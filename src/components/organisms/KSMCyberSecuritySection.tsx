"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MissionCard from "@/components/atoms/MissionCard";
import StatisticCard from "@/components/atoms/StatisticCard";
import "@/styles/ksm.css";

/**
 * Props for the KSMCyberSecuritySection component
 * @interface KSMCyberSecuritySectionProps
 */
interface KSMCyberSecuritySectionProps {
  /** Title of the section */
  title?: string;
  /** Description text */
  description?: string;
  /** Array of mission statements */
  missions?: Array<{
    title: string;
    iconPath: string;
  }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Icons for stats and missions
 */
const ICONS = {
  administrators:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  members:
    "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  education:
    "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  practical:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  community:
    "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
};

/**
 * Default mission statements for the section
 */
const DEFAULT_MISSIONS = [
  {
    title:
      "Providing cybersecurity education to students at UPN Veteran Jakarta",
    iconPath: ICONS.education,
  },
  {
    title: "Building practical skills through hands-on projects like CyLink",
    iconPath: ICONS.practical,
  },
  {
    title:
      "Creating a supportive learning community for cybersecurity enthusiasts",
    iconPath: ICONS.community,
  },
];

/**
 * KSMCyberSecuritySection component
 * @description A section showcasing information about KSM Cyber Security
 * @param props - Component properties
 * @returns KSMCyberSecuritySection component
 */
const KSMCyberSecuritySection: React.FC<KSMCyberSecuritySectionProps> = ({
  title = "Powering Cybersecurity Education at UPN Veteran Jakarta",
  description = "KSM Cyber Security is dedicated to becoming a hub for Computer Science students at UPN Veteran Jakarta with interests in cybersecurity. With 37 active administrators and 60 active members, we embrace, accommodate, and develop student interest in cybersecurity while building a strong community.",
  missions = DEFAULT_MISSIONS,
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
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Node positions for the background
  const nodes = [
    { x: "10%", y: "20%", delay: 0, color: "purple" },
    { x: "85%", y: "15%", delay: 0.5, color: "teal" },
    { x: "20%", y: "85%", delay: 1, color: "" },
    { x: "70%", y: "80%", delay: 1.5, color: "purple" },
    { x: "40%", y: "30%", delay: 2, color: "teal" },
    { x: "60%", y: "60%", delay: 2.5, color: "" },
  ];

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 bg-white overflow-hidden ${className}`}
    >
      {/* Network pattern background */}
      <div className="absolute inset-0 network-pattern" />

      {/* Background animated nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={index}
          className={`node-highlight ${node.color} absolute`}
          style={{
            left: node.x,
            top: node.y,
            y: y1,
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: [1, 1.5, 1] }}
          viewport={{ once: true }}
          transition={{
            duration: 2,
            delay: node.delay,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Background decorative circles */}
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-purple-100/20 pointer-events-none"
      />
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-teal-100/30 pointer-events-none"
      />

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            {/* Title */}
            <motion.div
              className="mb-2 inline-flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
              <div className="w-1 h-1 rounded-full bg-teal-500 mr-2" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
            </motion.h2>

            {/* Statistics cards - administrators and members */}
            <div className="flex flex-wrap justify-center gap-8 my-12">
              <StatisticCard
                value={37}
                label="Active Administrators"
                iconPath={ICONS.administrators}
                delay={0.2}
                className="mx-4"
              />
              <StatisticCard
                value={60}
                label="Active Members"
                iconPath={ICONS.members}
                delay={0.4}
                className="mx-4"
              />
            </div>

            {/* Description */}
            <motion.div
              className="glassmorphism max-w-3xl mx-auto rounded-xl p-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </motion.div>
          </div>

          {/* Mission heading */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-blue-900 inline-block relative">
              Our Mission
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-indigo-500 to-teal-400"></div>
            </h3>
          </motion.div>

          {/* Mission cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connection lines between cards (visible on desktop) */}
            <div className="hidden md:block connection-line absolute top-[30%] left-[33%] right-[67%]" />
            <div className="hidden md:block connection-line absolute top-[30%] left-[67%] right-[33%]" />

            {missions.map((mission, index) => (
              <MissionCard
                key={index}
                title={mission.title}
                iconPath={mission.iconPath}
                className="mission-card glow-effect"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KSMCyberSecuritySection;
