"use client";

import React from "react";
import { QrCodeColor } from "@/interfaces/qrcode";

/**
 * Props for ColorSelector component
 */
interface ColorSelectorProps {
  /**
   * Array of color options
   */
  colors: QrCodeColor[];
  /**
   * Currently selected color
   */
  selectedColor: QrCodeColor | null;
  /**
   * Function to call when a color is selected
   */
  onSelect: (color: QrCodeColor) => void;
  /**
   * Label for the color selector
   */
  label: string;
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * ColorSelector Component
 * @description A component for selecting a color from a list of options
 */
const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelect,
  label,
  disabled = false,
}) => {
  if (colors.length === 0) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="text-sm text-gray-500">No colors available</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor?.hex === color.hex
                ? "border-blue-500 shadow-md scale-110"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onSelect(color)}
            disabled={disabled}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
