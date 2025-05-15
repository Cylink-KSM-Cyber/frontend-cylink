import React from "react";

/**
 * Props for the FooterColumnTitle component
 * @interface FooterColumnTitleProps
 */
interface FooterColumnTitleProps {
  /** Title text content */
  children: React.ReactNode;
  /** Optional CSS classes */
  className?: string;
}

/**
 * FooterColumnTitle component
 * @description A styled title component for footer columns
 * @param {FooterColumnTitleProps} props - Component props
 * @returns {JSX.Element} FooterColumnTitle component
 */
const FooterColumnTitle: React.FC<FooterColumnTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <h3 className={`mb-4 font-medium text-white text-lg ${className}`}>
      {children}
    </h3>
  );
};

export default FooterColumnTitle;
