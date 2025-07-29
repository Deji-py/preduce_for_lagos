import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  variant?: "dots" | "numbers" | "lines";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  dots: {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  },
  numbers: {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  },
};

export function StepIndicator({
  currentStep,
  totalSteps,
  className,
  variant = "dots",
  size = "md",
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  if (variant === "lines") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {steps.map((step) => (
          <div
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              step <= currentStep ? "bg-primary flex-2" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "numbers") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "rounded-full flex items-center justify-center font-medium transition-colors duration-200",
                sizeStyles.numbers[size],
                step <= currentStep
                  ? "bg-primary text-white"
                  : step === currentStep + 1
                  ? "bg-teal-100 text-teal-600 border-2 border-primary"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 transition-colors duration-200",
                  step < currentStep ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Default: dots variant
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {steps.map((step) => (
        <div
          key={step}
          className={cn(
            "rounded-full transition-colors duration-200",
            sizeStyles.dots[size],
            step <= currentStep ? "bg-primary" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}
