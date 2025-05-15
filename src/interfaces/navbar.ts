/**
 * Navbar interfaces
 * @description Type definitions for navbar components
 */

/**
 * NavbarProps interface
 * @description Props for the Navbar component
 */
export interface NavbarProps {
  /** CSS class name to apply to the component */
  className?: string;
}

/**
 * NavbarDecorationsProps interface
 * @description Props for the NavbarDecorations component
 */
export interface NavbarDecorationsProps {
  /** Whether the navbar is in scrolled state */
  isScrolled: boolean;
}

/**
 * LogoProps interface
 * @description Props for the Logo component
 */
export interface LogoProps {
  /** CSS class name to apply to the component */
  className?: string;
}

/**
 * NavButtonProps interface
 * @description Props for the NavButton component
 */
export interface NavButtonProps {
  /** The text to display on the button */
  children: React.ReactNode;
  /** The URL to navigate to when clicked */
  href: string;
  /** CSS class name to apply to the component */
  className?: string;
}

/**
 * JapanesePatternProps interface
 * @description Props for the JapanesePattern component
 */
export interface JapanesePatternProps {
  /** CSS class name to apply to the component */
  className?: string;
  /** Opacity level of the pattern (0-100) */
  opacity?: number;
  /** Whether the pattern should be animated */
  animated?: boolean;
  /** Pattern type */
  pattern?: "dots" | "lines" | "grid" | "asanoha";
}
