import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Logo properties interface
 * @interface LogoProps
 */
interface LogoProps {
  /** Logo size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to include link to homepage */
  withLink?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Logo component
 * @description Displays the CyLink logo with optional link to homepage
 * @param props - Logo properties
 * @returns Logo component
 */
const Logo: React.FC<LogoProps> = ({
  size = "md",
  withLink = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  const logoContent = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-bold ${sizeClasses[size]} ${className}`}
    >
      <span>Cy</span>
      <span className="text-black">Link</span>
    </motion.div>
  );

  if (withLink) {
    return (
      <Link href="/" className="focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
