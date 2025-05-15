/**
 * useHoverEffect hook
 * @description Custom hook for handling hover effects
 */

"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook that provides hover state and handler functions
 * @returns Object containing isHovered state and event handlers
 */
const useHoverEffect = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useHoverEffect;
