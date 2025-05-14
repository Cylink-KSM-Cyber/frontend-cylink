"use client";

import React from "react";
import HeroSection from "@/components/organisms/HeroSection";

/**
 * HomeTemplate component props interface
 */
interface HomeTemplateProps {
  /** CSS class names to apply to the component */
  className?: string;
}

/**
 * HomeTemplate component
 * @description Template for the home page
 * @param props - Component properties
 * @returns HomeTemplate component
 */
const HomeTemplate: React.FC<HomeTemplateProps> = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <HeroSection
        headline="Transform Your Online Presence"
        subheadline="Create, manage, and track powerful short links with advanced analytics and QR code support"
        ctaText="Get Started"
        ctaUrl="/login"
      />
      {/* Additional sections can be added here */}
    </div>
  );
};

export default HomeTemplate;
