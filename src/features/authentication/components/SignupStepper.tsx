import type React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export function SignupStepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={cn("space-y-6 hidden lg:block 2xl:space-y-10", className)}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const IconComponent = step.icon;

        return (
          <div
            key={step.id}
            className="flex relative font-inter cursor-not-allowed items-start space-x-4"
          >
            {/* Icon Container */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border  transition-colors",
                isCompleted
                  ? "border-primary bg-[#E3EDD2] text-primary"
                  : isActive
                  ? "bg-white border-black text-black"
                  : "border bg-white text-gray-400"
              )}
            >
              <IconComponent className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-sm font-medium transition-colors",
                  isCompleted
                    ? "text-primary"
                    : isActive
                    ? "text-black"
                    : "text-gray-400"
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "text-xs transition-colors mt-1",
                  isCompleted
                    ? "text-primary"
                    : isActive
                    ? "text-gray-500"
                    : "text-gray-400"
                )}
              >
                {step.description}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-5 mt-10 h-10 w-0.5 ",
                  !isCompleted || currentStep === 0
                    ? "bg-gray-200"
                    : "bg-primary"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
