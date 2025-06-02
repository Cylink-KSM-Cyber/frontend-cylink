"use client";

import React from "react";
import { motion } from "framer-motion";
import { RiToolsLine, RiTimeLine } from "react-icons/ri";
import Link from "next/link";
import Button from "@/components/atoms/Button";

/**
 * Props for UnderDevelopmentCard component
 */
interface UnderDevelopmentCardProps {
  /**
   * Title of the feature under development
   */
  title: string;
  /**
   * Description of what's being developed
   */
  description?: string;
  /**
   * Expected completion timeframe
   */
  timeline?: string;
  /**
   * Link to navigate when user wants more info
   */
  moreInfoLink?: string;
  /**
   * Whether to show the card in compact mode
   */
  compact?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnderDevelopmentCard Component
 * @description A card component to display under development features
 * Can be embedded in existing pages to indicate specific features are coming soon
 */
const UnderDevelopmentCard: React.FC<UnderDevelopmentCardProps> = ({
  title,
  description = "This feature is currently being developed and will be available soon.",
  timeline,
  moreInfoLink = "/under-development",
  compact = false,
  className = "",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`
        bg-white rounded-xl border border-[#E5E7EB] shadow-sm
        ${compact ? "p-4" : "p-6"}
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-[#FEF3C7] rounded-lg mr-3">
            <RiToolsLine className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h3
              className={`font-semibold text-[#111827] ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              {title}
            </h3>
            {timeline && (
              <div className="flex items-center mt-1">
                <RiTimeLine className="w-3 h-3 text-[#6B7280] mr-1" />
                <span className="text-xs text-[#6B7280]">{timeline}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
          <span className="text-xs text-[#F59E0B] ml-2 font-medium">
            In Progress
          </span>
        </div>
      </div>

      {/* Description */}
      <p className={`text-[#6B7280] mb-4 ${compact ? "text-xs" : "text-sm"}`}>
        {description}
      </p>

      {/* Action */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#9CA3AF]">
          We&apos;ll notify you when ready
        </div>

        <Link href={moreInfoLink}>
          <Button
            variant="outline"
            size={compact ? "sm" : "md"}
            className="text-xs border-[#E5E7EB] hover:border-[#111827]"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default UnderDevelopmentCard;
