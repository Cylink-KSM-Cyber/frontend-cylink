import React, { forwardRef } from "react";

/**
 * Checkbox properties
 * @interface CheckboxProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Custom CSS class for the container */
  containerClassName?: string;
}

/**
 * Checkbox component
 * @description A stylish custom checkbox component
 * @param props - Checkbox properties
 * @returns Checkbox component
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, className = "", containerClassName = "", id, ...props },
    ref
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    const isError = !!error;

    return (
      <div className={`${containerClassName}`}>
        <div className="flex items-center">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                ref={ref}
                id={checkboxId}
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black ${
                  isError ? "border-red-500" : ""
                } ${className}`}
                {...props}
              />
            </div>

            {label && (
              <div className="ml-2 text-sm">
                <label
                  htmlFor={checkboxId}
                  className="font-medium text-gray-700 cursor-pointer"
                >
                  {label}
                </label>
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
