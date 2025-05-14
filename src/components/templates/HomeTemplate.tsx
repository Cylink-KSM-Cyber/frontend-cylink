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
        headline="Elevate Your Digital Presence with Cylink"
        subheadline="Create powerful branded links, gain valuable insights, and streamline your online marketing with our all-in-one platform"
        ctaText="Use Cylink Now"
        ctaUrl="/login"
      />
      {/* Additional sections can be added here */}
    </div>
  );
};

export default HomeTemplate;
