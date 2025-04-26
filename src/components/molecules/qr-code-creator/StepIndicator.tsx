"use client";

import React from "react";

/**
 * Props for StepIndicator component
 */
interface StepIndicatorProps {
  /**
   * Current active step
   */
  currentStep: number;
  /**
   * Array of step names/titles
   */
  steps: string[];
}

/**
 * StepIndicator Component
 *
 * @description Visual indicator for multi-step processes showing current progress
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>

              {/* Connector line (except after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 ${
                    currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-center mt-2">
        {steps.map((step, index) => (
          <div key={index} className="text-xs text-center w-20">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
