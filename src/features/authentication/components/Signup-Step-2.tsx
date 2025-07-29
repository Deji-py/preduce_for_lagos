"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { sendOTP, verifyOTP } from "../api/auth";
import { supabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

type SignUpStepProps = {
  next: () => void;
};

export default function SignupStep2({ next }: SignUpStepProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email from search params
  const email = searchParams.get("email") || "example@gmail.com";

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const updateUrlParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setValue("otp", newOtp.join(""));

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      await verifyOTP(email, data.otp);

      // Get the current user after OTP verification
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      toast.success("Email Verified", {
        description: "Your email has been successfully verified.",
      });

      // Add userId to search params and proceed to next step
      updateUrlParams({
        ...Object.fromEntries(searchParams.entries()),
        userId: user?.id || "",
      });

      next();
    } catch (error: any) {
      toast.error("Verification Failed", {
        description: error.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await sendOTP(email);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      setValue("otp", "");

      toast("OTP Resent", {
        description: "A new OTP has been sent to your email.",
      });
    } catch (error: any) {
      toast("Error", { description: error.message || "Failed to resend OTP." });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex gap-2 w-full justify-center items-center flex-col">
        <svg
          width="82"
          height="69"
          viewBox="0 0 82 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6897 19.8317L31.1827 26.0376C37.2995 29.6542 39.7426 29.6542 45.8629 26.0376L56.3559 19.8317"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.91364 37.5792C3.14547 48.5109 3.26317 53.9785 7.29701 58.0266C11.3309 62.0783 16.9447 62.2174 28.176 62.4991C35.0953 62.6775 41.9503 62.6775 48.8696 62.4991C60.1008 62.2174 65.7147 62.0783 69.7485 58.0266C73.7824 53.9785 73.9001 48.5109 74.1355 37.5792C74.2068 34.0625 74.2068 30.5672 74.1355 27.0505C73.9001 16.1188 73.7824 10.6512 69.7485 6.60307C65.7147 2.55139 60.1008 2.41229 48.8696 2.13052C41.9728 1.95649 35.0728 1.95649 28.176 2.13052C16.9447 2.41229 11.3309 2.55139 7.29701 6.60307C3.26317 10.6512 3.14547 16.1188 2.91007 27.0505C2.83499 30.5597 2.83856 34.07 2.91364 37.5792Z"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <mask
            id="mask0_9_196"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="49"
            y="37"
            width="31"
            height="31"
          >
            <path
              d="M64.4243 66.6733C66.2546 66.6756 68.0673 66.3161 69.7582 65.6157C71.4492 64.9153 72.9851 63.8876 74.2777 62.5917C75.5735 61.2992 76.6012 59.7633 77.3016 58.0723C78.0021 56.3813 78.3615 54.5686 78.3592 52.7383C78.3615 50.908 78.0021 49.0953 77.3016 47.4043C76.6012 45.7134 75.5735 44.1775 74.2777 42.8849C72.9851 41.589 71.4492 40.5614 69.7582 39.8609C68.0673 39.1605 66.2546 38.8011 64.4243 38.8033C62.594 38.8011 60.7813 39.1605 59.0903 39.8609C57.3993 40.5614 55.8634 41.589 54.5708 42.8849C53.275 44.1775 52.2473 45.7134 51.5469 47.4043C50.8464 49.0953 50.487 50.908 50.4893 52.7383C50.487 54.5686 50.8464 56.3813 51.5469 58.0723C52.2473 59.7633 53.275 61.2992 54.5708 62.5917C55.8634 63.8876 57.3993 64.9153 59.0903 65.6157C60.7813 66.3161 62.594 66.6756 64.4243 66.6733Z"
              fill="white"
              stroke="#484848"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M58.8503 52.7383L63.0308 56.9188L71.3918 48.5578"
              stroke="#484848"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
          <g mask="url(#mask0_9_196)">
            <path
              d="M80.8965 36.2663V69.2107H47.9521V36.2663H80.8965Z"
              fill="#8FC645"
              stroke="#484848"
              strokeWidth="0.5"
            />
          </g>
        </svg>

        <h1 className="font-poppins text-2xl lg:text-2xl mt-6 font-semibold">
          Verify Email Address
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          We sent an OTP to {email}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 w-full justify-center items-center flex flex-col"
        >
          <div className="flex gap-3 mx-auto justify-start mb-8">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="lg:w-12 lg:h-12 w-12 h-12 text-center text-lg font-semibold border focus:border-primary"
                required
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-red-500 text-xs mb-4">{errors.otp.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={otp.join("").length !== 6 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs lg:text-sm">
              {"Didn't get an OTP? "}
              {countdown > 0 ? (
                <span className="opacity-70">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-primary hover:underline font-semibold"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              )}
            </p>
          </div>
        </form>
      </div>

      <div className="w-full text-xs mt-40 flex flex-col justify-center items-center opacity-60">
        <p>© 2025 Origin group & Lafsinco.</p>
      </div>
    </div>
  );
}
