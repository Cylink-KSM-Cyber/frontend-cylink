/**
 * Cyber Security Fact Card Component
 * 
 * Displays a cyber security fact with clean mobile layout and CyLink branding.
 * Provides educational content during the interstitial countdown experience.
 * 
 * @module src/components/molecules/CyberSecurityFactCard
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { CyberSecurityFactCardProps } from "@/interfaces/interstitial";

const CyberSecurityFactCard: React.FC<CyberSecurityFactCardProps> = ({
  fact,
  className = "",
}) => {
  /**
   * Get icon for fact category
   */
  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      social_engineering: "🎭",
      authentication: "🔐",
      malware: "🦠",
      data_protection: "🛡️",
      web_security: "🌐",
      vulnerability: "⚠️",
      incident_response: "🚨",
      risk_management: "📊",
      network_security: "🔒",
      encryption: "🔑",
      human_factor: "👥",
      patch_management: "🔧",
      threat_landscape: "🌍",
      iot_security: "📱",
      fundamentals: "📚",
      security_testing: "🔍",
    };

    return iconMap[category] || "💡";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`cyber-security-fact-card ${className}`}
    >
      <div className="bg-white rounded-lg shadow-lg border-2 border-black p-6 md:p-8 max-w-2xl mx-auto">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl" role="img" aria-label={fact.category}>
            {getCategoryIcon(fact.category)}
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Cyber Security Tip
            </h2>
          </div>
        </div>

        {/* Fact content */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium">
            {fact.fact}
          </p>
        </div>

        {/* Category badge */}
        <div className="mt-6 flex items-center justify-between">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {fact.category.replace(/_/g, " ").toUpperCase()}
          </span>

          {/* CyLink branding badge */}
          <span className="text-xs text-gray-500 font-medium">
            Powered by <span className="font-bold text-black">CyLink</span>
          </span>
        </div>
      </div>

      {/* Optional decorative element */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-gray-500 italic">
          Stay informed. Stay secure. 🔒
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CyberSecurityFactCard;

