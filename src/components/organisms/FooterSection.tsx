import React from "react";
import FooterColumn from "@/components/molecules/FooterColumn";
import FooterSocialLinks from "@/components/molecules/FooterSocialLinks";
import FooterLink from "@/components/atoms/FooterLink";
import "@/styles/footer.css";

/**
 * Props for the FooterSection component
 * @interface FooterSectionProps
 */
interface FooterSectionProps {
  /** Optional CSS classes */
  className?: string;
}

/**
 * FooterSection component
 * @description A modern Japanese-inspired footer section for the homepage
 * @param {FooterSectionProps} props - Component props
 * @returns {JSX.Element} FooterSection component
 */
const FooterSection: React.FC<FooterSectionProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-black text-white py-16 px-6 md:px-12 footer-texture ${className}`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Thin decorative line inspired by Japanese minimalism */}
        <div className="w-16 h-px bg-white opacity-50 mb-12 mx-auto"></div>

        <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-24 gap-y-10">
          {/* Brand and Contact Information */}
          <FooterColumn
            title="Cylink"
            className="mb-12 md:mb-0 text-center md:text-left"
            defaultOpen={true}
          >
            <p className="mb-4 text-white opacity-80">
              Elevate your digital presence with powerful branded links and
              valuable insights.
            </p>
            <div className="space-y-2 mt-6">
              <p className="text-white opacity-80">
                Email: cybersecurity@upnvj.ac.id
              </p>
              <p className="text-white opacity-80">Phone: +62 878-8798-5688</p>
            </div>
            <div className="flex justify-center md:justify-start mt-6">
              <FooterSocialLinks />
            </div>
          </FooterColumn>

          {/* Legal Links */}
          <FooterColumn
            title="Legal"
            className="mb-0 text-center md:text-left"
            defaultOpen={true}
          >
            <div className="space-y-3 flex flex-col items-center md:items-start">
              <div>
                <FooterLink href="/terms" className="footer-link-hover">
                  Terms of Service
                </FooterLink>
              </div>
              <div>
                <FooterLink href="/privacy" className="footer-link-hover">
                  Privacy Policy
                </FooterLink>
              </div>
              <div>
                <FooterLink href="/cookies" className="footer-link-hover">
                  Cookie Policy
                </FooterLink>
              </div>
            </div>
          </FooterColumn>
        </div>

        {/* Thin decorative line */}
        <div className="w-full h-px bg-white opacity-20 my-8"></div>

        {/* Copyright Notice */}
        <div className="text-center">
          <p className="text-sm text-white opacity-60">
            © {currentYear} Cylink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
