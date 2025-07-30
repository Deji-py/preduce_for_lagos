"use client";
import { SignupStepper, type Step } from "../components/SignupStepper";
import Image from "next/image";
import stepperImg from "@/../public/png/stepper-img.png";
import logo from "@/../public/png/logo.png";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";

import SignupComplete from "../components/Signup-Complete";
import { Hand, Mail, User, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import SignupStep1 from "../components/Signup-Step-1";
import SignupStep2 from "../components/Signup-Step-2";
import SignupStep3 from "../components/Signup-Step-3";
import SignupStep4 from "../components/Signup-Step-4";
import { supabaseClient } from "@/utils/supabase/client";

const SignupSteps: Step[] = [
  {
    id: 1,
    title: "Welcome",
    description: "Welcome to produce4lagos",
    icon: Hand,
  },
  {
    id: 2,
    title: "Verify Email Address",
    description: "Verify 6 Digit OTP",
    icon: Mail,
  },
  {
    id: 3,
    title: "Personal Information",
    description: "Enter Your Personal Info",
    icon: User,
  },
  {
    id: 4,
    title: "Company Information",
    description: "Enter Your Company Info",
    icon: Briefcase,
  },
];

function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current step from URL params, default to 1
  const currentStep = Number.parseInt(searchParams.get("step") || "1");
  const isComplete = searchParams.get("complete") === "true";

  // Function to update URL with new parameters
  const updateUrlParams = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value.toString());
        } else {
          current.delete(key);
        }
      });
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}`);
    },
    [router, searchParams]
  );

  // Handle OTP verification and get user ID
  const handleOTPVerified = useCallback(async () => {
    try {
      // Get the current user after OTP verification
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        updateUrlParams({
          ...Object.fromEntries(searchParams.entries()),
          step: 3,
          userId: user.id,
        });
      }
    } catch (error) {
      console.error("Error getting user:", error);
      // Fallback - still proceed to next step
      updateUrlParams({
        ...Object.fromEntries(searchParams.entries()),
        step: 3,
      });
    }
  }, [updateUrlParams, searchParams]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (currentStep >= SignupSteps.length) {
      // Mark as complete
      updateUrlParams({
        ...Object.fromEntries(searchParams.entries()),
        complete: "true",
        step: SignupSteps.length + 1,
      });
      return;
    }
    const nextStepNumber = currentStep + 1;
    updateUrlParams({
      ...Object.fromEntries(searchParams.entries()),
      step: nextStepNumber,
    });
  }, [currentStep, updateUrlParams, searchParams]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep <= 1) return;
    updateUrlParams({
      ...Object.fromEntries(searchParams.entries()),
      step: currentStep - 1,
    });
  }, [currentStep, updateUrlParams, searchParams]);

  const RenderStep = ({ currentStep }: { currentStep: number }) => {
    switch (currentStep) {
      case 1:
        return <SignupStep1 />;
      case 2:
        return <SignupStep2 next={handleOTPVerified} />;
      case 3:
        return <SignupStep3 next={nextStep} />;
      case 4:
        return <SignupStep4 next={nextStep} />;
      default:
        return <SignupStep1 />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Layout */}
      <div className="bg-white p-2 2xl:gap-20 lg:gap-2 w-full h-full flex flex-col lg:grid lg:grid-cols-12">
        {/* Stepper */}
        <section className="relative border overflow-hidden bg-sidebar h-[100px] lg:h-full rounded-2xl lg:col-span-3">
          {/* Heading */}
          <div className="p-10">
            <div className="w-full pl-6 lg:mb-20">
              <div className="w-24 absolute lg:relative right-5 h-auto">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="stepperImg"
                  className="w-full"
                />
              </div>
            </div>
            <SignupStepper steps={SignupSteps} currentStep={currentStep} />
          </div>
          <svg
            width="182"
            height="167"
            viewBox="0 0 182 167"
            fill="none"
            className="absolute bottom-0 z-10 left-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="44" cy="138.19" r="137.764" fill="#136B3B" />
            <circle cx="36.2834" cy="143.218" r="122.309" fill="#8FC645" />
            <circle
              cx="23.3521"
              cy="156.149"
              r="109.377"
              fill="#136B3B"
              fillOpacity="0.18"
            />
          </svg>
          {/* image */}
          <Image
            src={stepperImg || "/placeholder.svg"}
            alt="stepperImg"
            className="w-[80%] lg:block hidden absolute bottom-0 right-0"
          />
        </section>
        {/* Main */}
        <section className="2xl:mr-20 h-full overflow-y-scroll scrollbar-hidden flex flex-col justify-start items-center lg:col-span-9">
          {/* Form */}
          <div className="w-full p-4 lg:p-10 flex-1 max-w-xl">
            {/* formHeader */}
            {currentStep !== SignupSteps.length + 1 && (
              <div className="w-full mb-20 2xl:mb-28 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#F7F7F7] !text-xs rounded-full text-gray-500"
                  onClick={prevStep}
                  disabled={currentStep <= 3}
                >
                  <ArrowLeft /> Back
                </Button>
                <StepIndicator
                  variant="lines"
                  currentStep={currentStep}
                  totalSteps={SignupSteps.length}
                  className="w-[80px]"
                />
              </div>
            )}
            {/* Main Form */}
            {!isComplete ? (
              <RenderStep currentStep={currentStep} />
            ) : (
              <SignupComplete />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup;
