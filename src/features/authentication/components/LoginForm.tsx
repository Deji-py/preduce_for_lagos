"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  checkUserExists,
  sendPasswordResetOTP,
  signInWithEmail,
  verifyPasswordResetOTP,
} from "../api/auth"; // Updated import path
import { toast } from "sonner";

type LoginStep =
  | "login"
  | "forgot-password"
  | "forgot-password-sent"
  | "reset-otp"
  | "new-password";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

function LoginForm() {
  const [currentStep, setCurrentStep] = useState<LoginStep>("login");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  // Form configurations
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });
  const newPasswordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    if (countdown > 0 && currentStep === "reset-otp") {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, currentStep]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast.success("Login Successful", { description: "Welcome back!" });
      router.push("/dashboard"); // Redirect to dashboard on successful login
    } catch (error: any) {
      toast.error("Login Failed", {
        description:
          error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await sendPasswordResetOTP(data.email);
      setEmail(data.email);
      setCurrentStep("forgot-password-sent");
      setCountdown(60); // Reset countdown for the next OTP screen
      toast.success("OTP Sent", {
        description: "Please check your email for the verification code.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message || "Failed to send reset code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      otpForm.setValue("otp", newOtp.join(""));
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

  const handleVerifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      // The actual password update happens in handleNewPassword,
      // this step just verifies the OTP to proceed.
      // Supabase's verifyOtp is usually part of the resetPasswordForEmail flow
      // where the user clicks a link. For an OTP input, you'd typically
      // verify the OTP and then allow password change.
      // For this flow, we'll just proceed to new-password step after OTP input.
      // The actual verification with Supabase will happen in handleNewPassword.
      setCurrentStep("new-password");
      toast.success("OTP Verified", {
        description: "You can now set your new password.",
      });
    } catch (error: any) {
      toast.error("Verification Failed", {
        description: error.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (data: NewPasswordFormData) => {
    setIsLoading(true);
    try {
      await verifyPasswordResetOTP(email, otp.join(""), data.password);
      toast.success("Password Reset Successful", {
        description: "Your password has been updated successfully.",
      });
      router.push("/dashboard"); // Redirect to dashboard or login page
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetOTP(email);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      otpForm.setValue("otp", "");
      toast.success("OTP Resent", {
        description: "A new OTP has been sent to your email.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to resend OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div>
        <h1 className="font-poppins text-black text-2xl mt-5 lg:mt-0 lg:text-3xl font-bold">
          Welcome Back,
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          Login to your Account
        </p>
      </div>
      <form
        onSubmit={loginForm.handleSubmit(handleLogin)}
        className=" flex mt-6 flex-col"
      >
        <div className="space-y-2 flex flex-col">
          <Label className="!text-sm">Email Address</Label>
          <Input
            {...loginForm.register("email")}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="example@gmail.com"
            type="email"
            className={loginForm.formState.errors.email ? "border-red-500" : ""}
          />
          {loginForm.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2 mt-4 flex flex-col">
          <div className="flex justify-between items-center">
            <Label className="!text-sm">Password</Label>
            <button
              type="button"
              onClick={() => setCurrentStep("forgot-password")}
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input
              {...loginForm.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`pr-10 ${
                loginForm.formState.errors.password ? "border-red-500" : ""
              }`}
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button
          size="lg"
          className="w-full mt-8"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <p className="mt-6 text-xs lg:text-sm">
          {"Don't have an account? "}
          <Link
            className="text-primary hover:underline font-semibold"
            href="/signup"
          >
            Signup
          </Link>
        </p>
      </form>
    </>
  );
  const renderForgotPasswordForm = () => (
    <>
      <div>
        <button
          type="button"
          onClick={() => setCurrentStep("login")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
        <h1 className="font-poppins text-black text-2xl lg:text-3xl mt-2 font-bold">
          Forgot Password?
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          Enter your email address and we'll send you a verification code to
          reset your password
        </p>
      </div>
      <form
        onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
        className="mt-10 flex flex-col"
      >
        <div className="space-y-2 flex flex-col">
          <Label className="!text-sm">Email Address</Label>
          <Input
            {...forgotPasswordForm.register("email")}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="example@gmail.com"
            type="email"
            className={
              forgotPasswordForm.formState.errors.email ? "border-red-500" : ""
            }
          />
          {forgotPasswordForm.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {forgotPasswordForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <Button
          size="lg"
          className="w-full mt-8"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
        <p className="mt-6 text-xs lg:text-sm text-center">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => setCurrentStep("login")}
            className="text-primary hover:underline font-semibold"
          >
            Back to Login
          </button>
        </p>
      </form>
    </>
  );
  const renderForgotPasswordSent = () => (
    <>
      <div className="flex justify-center mb-6 mt-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div className="text-center">
        <h1 className="font-poppins text-black text-2xl lg:text-3xl font-bold">
          Check Your Email
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          If an account exists, we’ve sent a password reset link.
        </p>
        <p className="text-sm font-medium mt-1">{email}</p>
      </div>
      <div className="mt-10 flex flex-col">
        <Button
          size="lg"
          className="w-full"
          onClick={() => setCurrentStep("reset-otp")}
        >
          Enter Verification Code
        </Button>
        <p className="mt-6 text-xs lg:text-sm text-center">
          {"Didn't receive the email? "}
          <button
            type="button"
            onClick={() => setCurrentStep("forgot-password")}
            className="text-primary hover:underline font-semibold"
          >
            Try again
          </button>
        </p>
      </div>
    </>
  );
  const renderResetOTP = () => (
    <>
      <div>
        <button
          type="button"
          onClick={() => setCurrentStep("forgot-password-sent")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="font-poppins text-black text-2xl lg:text-3xl mt-2 font-bold">
          Enter Verification Code
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          We sent a 6-digit code to {email}
        </p>
      </div>
      <form
        onSubmit={otpForm.handleSubmit(handleVerifyOTP)}
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
        {otpForm.formState.errors.otp && (
          <p className="text-red-500 text-xs mb-4">
            {otpForm.formState.errors.otp.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={otp.join("").length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
        <div className="mt-4 text-center">
          <p className="text-xs lg:text-sm">
            {"Didn't get a code? "}
            {countdown > 0 ? (
              <span className="opacity-70">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-primary hover:underline font-semibold"
              >
                {isLoading ? "Sending..." : "Resend"}
              </button>
            )}
          </p>
        </div>
      </form>
    </>
  );
  const renderNewPassword = () => (
    <>
      <div>
        <button
          type="button"
          onClick={() => setCurrentStep("reset-otp")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="font-poppins text-black text-2xl lg:text-3xl mt-2 font-bold">
          Set New Password
        </h1>
        <p className="text-xs lg:text-sm mt-2 opacity-70">
          Enter your new password below
        </p>
      </div>
      <form
        onSubmit={newPasswordForm.handleSubmit(handleNewPassword)}
        className="mt-10 flex flex-col space-y-6"
      >
        <div className="space-y-2 flex flex-col">
          <Label className="!text-sm">New Password</Label>
          <div className="relative">
            <Input
              {...newPasswordForm.register("password")}
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              className={`pr-10 ${
                newPasswordForm.formState.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {newPasswordForm.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {newPasswordForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2 flex flex-col">
          <Label className="!text-sm">Confirm New Password</Label>
          <div className="relative">
            <Input
              {...newPasswordForm.register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              className={`pr-10 ${
                newPasswordForm.formState.errors.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {newPasswordForm.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {newPasswordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </>
  );
  return (
    <div className="flex lg:mt-20 flex-1 w-full flex-col">
      {/* Form */}
      <div className="flex gap-2 flex-col">
        {currentStep === "login" && renderLoginForm()}
        {currentStep === "forgot-password" && renderForgotPasswordForm()}
        {currentStep === "forgot-password-sent" && renderForgotPasswordSent()}
        {currentStep === "reset-otp" && renderResetOTP()}
        {currentStep === "new-password" && renderNewPassword()}
      </div>
      {/* Copyright */}
      <div className="w-full flex-1 flex justify-between items-end text-xs flex-row opacity-60">
        <p>© 2025 Origin group & Lafsinco.</p>
        <p>v.1.0</p>
      </div>
    </div>
  );
}
export default LoginForm;
