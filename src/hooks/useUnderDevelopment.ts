"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * Interface for under development feature
 */
interface UnderDevelopmentFeature {
  id: string;
  name: string;
  description: string;
  estimatedCompletion?: string;
  priority: "high" | "medium" | "low";
  category: string;
}

/**
 * Hook for managing under development features and overlay state
 * @description Provides functionality to track and manage features that are under development
 * Also handles query parameter detection for showing overlay
 */
export const useUnderDevelopment = () => {
  const [features, setFeatures] = useState<UnderDevelopmentFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if under-development query parameter is present
  const isUnderDevelopmentMode =
    searchParams?.get("under-development") === "true";

  // Mock data for under development features
  const mockFeatures: UnderDevelopmentFeature[] = [
    {
      id: "advanced-analytics",
      name: "Advanced Analytics",
      description:
        "Detailed insights with custom date ranges, geographic data, and advanced filtering options.",
      estimatedCompletion: "Q2 2024",
      priority: "high",
      category: "Analytics",
    },
    {
      id: "team-collaboration",
      name: "Team Collaboration",
      description:
        "Share URLs and QR codes with team members, manage permissions, and collaborate effectively.",
      estimatedCompletion: "Q3 2024",
      priority: "medium",
      category: "Collaboration",
    },
    {
      id: "api-access",
      name: "API Access",
      description:
        "Full REST API access for developers to integrate CyLink into their applications.",
      estimatedCompletion: "Q2 2024",
      priority: "high",
      category: "Developer Tools",
    },
    {
      id: "custom-domains",
      name: "Custom Domains",
      description:
        "Use your own domain for shortened URLs to maintain brand consistency.",
      estimatedCompletion: "Q4 2024",
      priority: "medium",
      category: "Branding",
    },
    {
      id: "bulk-operations",
      name: "Bulk Operations",
      description:
        "Import, export, and manage multiple URLs and QR codes simultaneously.",
      estimatedCompletion: "Q3 2024",
      priority: "low",
      category: "Productivity",
    },
  ];

  // Load features (simulate API call)
  useEffect(() => {
    const loadFeatures = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFeatures(mockFeatures);
      setIsLoading(false);
    };

    loadFeatures();
  }, []);

  /**
   * Show under development overlay by adding query parameter
   */
  const showUnderDevelopment = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("under-development", "true");
    router.push(currentUrl.pathname + currentUrl.search);
  };

  /**
   * Hide under development overlay by removing query parameter
   */
  const hideUnderDevelopment = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("under-development");
    const newUrl = currentUrl.pathname + (currentUrl.search || "");
    router.push(newUrl);
  };

  /**
   * Toggle under development overlay
   */
  const toggleUnderDevelopment = () => {
    if (isUnderDevelopmentMode) {
      hideUnderDevelopment();
    } else {
      showUnderDevelopment();
    }
  };

  /**
   * Get features by category
   */
  const getFeaturesByCategory = (
    category: string
  ): UnderDevelopmentFeature[] => {
    return features.filter((feature) => feature.category === category);
  };

  /**
   * Get features by priority
   */
  const getFeaturesByPriority = (
    priority: "high" | "medium" | "low"
  ): UnderDevelopmentFeature[] => {
    return features.filter((feature) => feature.priority === priority);
  };

  /**
   * Get high priority features
   */
  const getHighPriorityFeatures = (): UnderDevelopmentFeature[] => {
    return getFeaturesByPriority("high");
  };

  /**
   * Get all unique categories
   */
  const getCategories = (): string[] => {
    return [...new Set(features.map((feature) => feature.category))];
  };

  /**
   * Check if a specific feature is under development
   */
  const isFeatureUnderDevelopment = (featureId: string): boolean => {
    return features.some((feature) => feature.id === featureId);
  };

  /**
   * Get feature by ID
   */
  const getFeatureById = (
    featureId: string
  ): UnderDevelopmentFeature | undefined => {
    return features.find((feature) => feature.id === featureId);
  };

  /**
   * Request feature notification (mock implementation)
   */
  const requestNotification = async (featureId: string): Promise<boolean> => {
    // In a real app, this would make an API call to subscribe to notifications
    console.log(`Notification requested for feature: ${featureId}`);
    return true;
  };

  return {
    features,
    isLoading,
    getFeaturesByCategory,
    getFeaturesByPriority,
    getHighPriorityFeatures,
    getCategories,
    isFeatureUnderDevelopment,
    getFeatureById,
    requestNotification,
    isUnderDevelopmentMode,
    showUnderDevelopment,
    hideUnderDevelopment,
    toggleUnderDevelopment,
  };
};
