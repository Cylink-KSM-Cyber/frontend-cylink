/**
 * Password strength utility
 * @description Provides password strength analysis and validation
 */

/**
 * Password strength level type
 */
export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

/**
 * Password strength analysis type
 */
export interface PasswordStrength {
  score: number;
  level: PasswordStrengthLevel;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Analyze password strength
 * @param password - Password to analyze
 * @returns Password strength analysis
 */
export const analyzePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  // Calculate score based on requirements
  const score = Object.values(requirements).filter(Boolean).length;

  // Determine strength level
  let level: PasswordStrengthLevel;
  if (score < 2) {
    level = "weak";
  } else if (score < 3) {
    level = "fair";
  } else if (score < 5) {
    level = "good";
  } else {
    level = "strong";
  }

  // Generate feedback messages
  const feedback: string[] = [];
  if (!requirements.minLength) {
    feedback.push("Password must be at least 8 characters long");
  }
  if (!requirements.hasUppercase) {
    feedback.push("Include at least one uppercase letter");
  }
  if (!requirements.hasLowercase) {
    feedback.push("Include at least one lowercase letter");
  }
  if (!requirements.hasNumber) {
    feedback.push("Include at least one number");
  }
  if (!requirements.hasSpecialChar) {
    feedback.push("Include at least one special character");
  }

  return {
    score,
    level,
    feedback,
    requirements,
  };
};

/**
 * Get password strength color
 * @param level - Password strength level
 * @returns CSS color class
 */
export const getPasswordStrengthColor = (
  level: PasswordStrengthLevel
): string => {
  switch (level) {
    case "weak":
      return "text-red-600";
    case "fair":
      return "text-orange-600";
    case "good":
      return "text-green-600";
    case "strong":
      return "text-emerald-700";
    default:
      return "text-gray-400";
  }
};

/**
 * Get password strength background color
 * @param level - Password strength level
 * @returns CSS background color class
 */
export const getPasswordStrengthBgColor = (
  level: PasswordStrengthLevel
): string => {
  switch (level) {
    case "weak":
      return "bg-red-600";
    case "fair":
      return "bg-orange-600";
    case "good":
      return "bg-green-600";
    case "strong":
      return "bg-emerald-700";
    default:
      return "bg-gray-300";
  }
};

/**
 * Get password strength text
 * @param level - Password strength level
 * @returns Human readable strength text
 */
export const getPasswordStrengthText = (
  level: PasswordStrengthLevel
): string => {
  switch (level) {
    case "weak":
      return "Weak";
    case "fair":
      return "Fair";
    case "good":
      return "Good";
    case "strong":
      return "Strong";
    default:
      return "";
  }
};
