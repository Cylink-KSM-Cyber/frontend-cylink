import React from "react";

/**
 * Prop types for ButtonIcon component
 */
interface ButtonIconProps {
  /**
   * The icon to display
   */
  icon: React.ReactNode;
  /**
   * Function to call when button is clicked
   */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Optional tooltip text
   */
  tooltip?: string;
  /**
   * Optional aria-label for accessibility
   */
  ariaLabel: string;
  /**
   * Button variant (determines styling)
   */
  variant?: "default" | "primary" | "danger" | "success" | "warning";
  /**
   * Optional CSS classes to apply
   */
  className?: string;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

/**
 * ButtonIcon Component
 * @description An icon button with tooltip for various actions
 */
const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  onClick,
  tooltip,
  ariaLabel,
  variant = "default",
  className = "",
  disabled = false,
}) => {
  // Determine button styling based on variant
  const getButtonClasses = () => {
    const baseClasses =
      "p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (variant) {
      case "primary":
        return `${baseClasses} text-white bg-black hover:bg-[#333333] focus:ring-black`;
      case "danger":
        return `${baseClasses} text-white bg-[#D32F2F] hover:bg-[#C62828] focus:ring-[#D32F2F]`;
      case "success":
        return `${baseClasses} text-white bg-[#009688] hover:bg-[#00897B] focus:ring-[#009688]`;
      case "warning":
        return `${baseClasses} text-white bg-[#FFC107] hover:bg-[#FFB300] focus:ring-[#FFC107]`;
      default:
        return `${baseClasses} text-[#333333] bg-[#F5F5F5] hover:bg-[#E0E0E0] focus:ring-[#333333]`;
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`${getButtonClasses()} ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {icon}
      </button>

      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 px-2 py-1 bg-[#333333] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default ButtonIcon;
