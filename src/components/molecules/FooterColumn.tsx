import React, { useState } from "react";
import FooterColumnTitle from "@/components/atoms/FooterColumnTitle";

/**
 * Props for the FooterColumn component
 * @interface FooterColumnProps
 */
interface FooterColumnProps {
  /** Column title */
  title: string;
  /** Column content */
  children: React.ReactNode;
  /** Optional CSS classes */
  className?: string;
  /** Whether the column is collapsible on mobile */
  collapsible?: boolean;
}

/**
 * FooterColumn component
 * @description A collapsible column component for the footer
 * @param {FooterColumnProps} props - Component props
 * @returns {JSX.Element} FooterColumn component
 */
const FooterColumn: React.FC<FooterColumnProps> = ({
  title,
  children,
  className = "",
  collapsible = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`mb-8 md:mb-0 ${className}`}>
      <div
        className={`flex items-center justify-between ${
          collapsible ? "cursor-pointer md:cursor-default" : ""
        }`}
        onClick={toggleOpen}
      >
        <FooterColumnTitle className="w-full text-center md:text-left">
          {title}
        </FooterColumnTitle>
        {collapsible && (
          <button
            className="block md:hidden transition-transform duration-300"
            aria-expanded={isOpen}
            aria-controls={`column-${title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-white transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        id={`column-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className={`space-y-2 mt-2 transition-all duration-300 overflow-hidden ${
          collapsible
            ? isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default FooterColumn;
