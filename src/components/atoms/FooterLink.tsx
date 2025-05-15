import React from "react";
import Link from "next/link";

/**
 * Props for the FooterLink component
 * @interface FooterLinkProps
 */
interface FooterLinkProps {
  /** URL where the link points to */
  href: string;
  /** Link text content */
  children: React.ReactNode;
  /** Optional CSS classes */
  className?: string;
}

/**
 * FooterLink component
 * @description A styled link component specifically for the footer
 * @param {FooterLinkProps} props - Component props
 * @returns {JSX.Element} FooterLink component
 */
const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`text-white transition-opacity duration-300 ease-in-out hover:opacity-80 ${className}`}
    >
      {children}
    </Link>
  );
};

export default FooterLink;
