/**
 * Hero section interface definitions
 */

/**
 * DecryptedText component props interface
 */
export interface DecryptedTextProps {
  /** Text to be displayed with decryption effect */
  text: string;
  /** Speed in ms between each iteration */
  speed?: number;
  /** Max number of random iterations (non-sequential mode) */
  maxIterations?: number;
  /** Whether to reveal one character at a time in sequence */
  sequential?: boolean;
  /** From which position characters begin to reveal in sequential mode */
  revealDirection?: "start" | "end" | "center";
  /** Restrict scrambling to only the characters already in the text */
  useOriginalCharsOnly?: boolean;
  /** Characters to use in the decryption effect */
  characters?: string;
  /** CSS class for revealed characters */
  className?: string;
  /** CSS class for the main characters container */
  parentClassName?: string;
  /** CSS class for encrypted characters */
  encryptedClassName?: string;
  /** Trigger scrambling on hover or scroll-into-view */
  animateOn?: "view" | "hover";
}

/**
 * Hero section component props interface
 */
export interface HeroSectionProps {
  /** Main headline text */
  headline: string;
  /** Subheadline text */
  subheadline: string;
  /** CTA button text */
  ctaText: string;
  /** CTA button URL */
  ctaUrl: string;
  /** CSS class names to apply to the component */
  className?: string;
}
