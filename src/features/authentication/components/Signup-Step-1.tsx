"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithRandomPassword, sendOTP } from "../api/auth";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function SignupStep1() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
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

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // First create user with random password
      await createUserWithRandomPassword(data.email);

      toast.success("OTP Sent", {
        description: "Please check your email for the verification code.",
      });

      // Add email to search params and proceed to next step
      updateUrlParams({
        ...Object.fromEntries(searchParams.entries()),
        email: data.email,
        step: "2",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
        <div>
          <h1 className="font-poppins text-primary text-2xl lg:text-3xl mt-6 font-bold">
            Welcome to <br />
            <span className="text-[#8FC645]">Produce For Lagos</span>
          </h1>
          <p className="text-xs lg:text-sm mt-2 opacity-70">
            To get started, Please enter your email
          </p>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Email Address</Label>
            <Input
              {...register("email")}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="example@gmail.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Get Started"}
          </Button>

          <p className="mt-6 text-xs lg:text-sm">
            Already have an account?{" "}
            <Link
              className="text-primary hover:underline font-semibold"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </form>

      <div className="w-full text-xs mt-40 flex flex-col justify-start opacity-60">
        <p>© 2025 Origin group & Lafsinco.</p>
      </div>
    </div>
  );
}
