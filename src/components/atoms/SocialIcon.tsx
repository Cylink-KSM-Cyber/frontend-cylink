import React from "react";
import Link from "next/link";

/**
 * Props for the SocialIcon component
 * @interface SocialIconProps
 */
interface SocialIconProps {
  /** URL where the social icon links to */
  href: string;
  /** Aria label for accessibility */
  ariaLabel: string;
  /** Icon SVG path data */
  path: string;
  /** Optional viewBox for SVG */
  viewBox?: string;
  /** Optional CSS classes */
  className?: string;
}

/**
 * SocialIcon component
 * @description A reusable component for social media icons with hover effects
 * @param {SocialIconProps} props - Component props
 * @returns {JSX.Element} SocialIcon component
 */
const SocialIcon: React.FC<SocialIconProps> = ({
  href,
  ariaLabel,
  path,
  viewBox = "0 0 24 24",
  className = "",
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`inline-block transition-transform duration-300 ease-in-out hover:scale-110 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className="h-6 w-6 fill-current text-white"
      >
        <path d={path} />
      </svg>
    </Link>
  );
};

export default SocialIcon;
