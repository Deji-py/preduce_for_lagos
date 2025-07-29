"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { signOut } from "@/features/authentication/api/auth";
import { toast } from "sonner";

const resetPasswordSchema = z
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isRequired, setIsRequired] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password");

  // Check if user has a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if this is a required password reset
        const required = searchParams.get("required") === "true";
        setIsRequired(required);

        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
        } else {
          setIsValidSession(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [searchParams]);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error", {
        description: "Failed to logout. Please try again.",
      });
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // Mark password as reset in the database
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        const { error: updateError } = await supabaseClient
          .from("users")
          .update({ password_reset: true })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating password_reset flag:", updateError);
          // Don't throw error here as the password was successfully updated
        }
      }

      toast.success("Password Updated", {
        description: "Your password has been successfully updated.",
      });

      setIsSuccess(true);

      // Redirect to dashboard after 3 seconds if this was required, otherwise to login
      setTimeout(() => {
        router.replace(isRequired ? "/onboarding" : "/");
      }, 3000);
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.message || "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Invalid session state
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-8">
              This password reset link is invalid or has expired. Please request
              a new password reset link.
            </p>
            <Link href="/forgot-password">
              <Button size="lg" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Password Updated Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your password has been updated. You will be redirected{" "}
              {isRequired ? "to your dashboard" : "to the login page"} shortly.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Redirecting, Pleasw Wait...</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isRequired && (
            <div className="flex justify-start mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isRequired ? "Set Your Password" : "Reset Your Password"}
          </h1>
          <p className="text-gray-600">
            {isRequired
              ? "Please set a secure password to complete your account setup."
              : "Enter your new password below to complete the reset process."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
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
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Password strength:</span>
                  <span
                    className={`font-medium ${
                      passwordStrength.strength >= 3
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                className={`pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Password must contain:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li
                className={`flex items-center ${
                  password?.length >= 8 ? "text-green-600" : ""
                }`}
              >
                <span className="mr-2">
                  {password?.length >= 8 ? "✓" : "•"}
                </span>
                At least 8 characters
              </li>
              <li
                className={`flex items-center ${
                  /[a-z]/.test(password || "") ? "text-green-600" : ""
                }`}
              >
                <span className="mr-2">
                  {/[a-z]/.test(password || "") ? "✓" : "•"}
                </span>
                One lowercase letter
              </li>
              <li
                className={`flex items-center ${
                  /[A-Z]/.test(password || "") ? "text-green-600" : ""
                }`}
              >
                <span className="mr-2">
                  {/[A-Z]/.test(password || "") ? "✓" : "•"}
                </span>
                One uppercase letter
              </li>
              <li
                className={`flex items-center ${
                  /\d/.test(password || "") ? "text-green-600" : ""
                }`}
              >
                <span className="mr-2">
                  {/\d/.test(password || "") ? "✓" : "•"}
                </span>
                One number
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>© 2025 Origin group & Lafsinco.</p>
        </div>
      </div>
    </div>
  );
}
