"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Briefcase } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import {
  sendMagicLink,
  sendPasswordResetLink,
  updateUserProfile,
} from "../api/auth";
import { toast } from "sonner";
import { supabaseClient } from "@/utils/supabase/client";

const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  stakeholderType: z.string().min(1, "Please select stakeholder type"),
  yearsOfOperation: z.string().min(1, "Please select years of operation"),
  businessDescription: z
    .string()
    .min(10, "Business description must be at least 10 characters"),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

type SignUpStepProps = {
  next: () => void;
};

export default function SignupStep4({ next }: SignUpStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email and userId from search params
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
  });

  const watchedStakeholderType = watch("stakeholderType");
  const watchedYearsOfOperation = watch("yearsOfOperation");

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

  const onSubmit = async (data: CompanyInfoFormData) => {
    setIsLoading(true);
    try {
      // Update user profile with company information
      await updateUserProfile(userId, {
        company_name: data.companyName,
        designation: data.designation,
        stakeholder_type: data.stakeholderType,
        years_of_operation: data.yearsOfOperation,
        business_description: data.businessDescription,
      });

      // Check user's password_reset status and category
      const { data: userData, error } = await supabaseClient
        .from("users")
        .select("password_reset, category")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error("Failed to fetch user data");
      }

      // If password_reset is false, send password reset OTP
      if (!userData?.password_reset) {
        await sendMagicLink(email);
      }
      // If user doesn't have a category, redirect to onboarding
      else if (!userData?.category) {
        router.push("/onboarding");
        return;
      }
      // If password_reset is true and category exists, go to dashboard
      else {
        router.push("/dashboard");
        return;
      }

      // Mark as complete in search params
      updateUrlParams({
        ...Object.fromEntries(searchParams.entries()),
        complete: "true",
      });

      next();
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to complete registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full -mt-8 flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
        <div>
          <h1 className="font-poppins text-black text-xl lg:text-2xl font-semibold">
            Company Information
          </h1>
          <p className="text-xs lg:text-sm mt-2 opacity-70">
            Enter Your Company Info Below.
          </p>
        </div>

        <div className="mt-10 flex flex-col space-y-6">
          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Company Name *</Label>
            <Input
              {...register("companyName")}
              leftIcon={<Building2 className="w-4 h-4" />}
              placeholder="Your Company Name"
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Designation *</Label>
            <Input
              {...register("designation")}
              leftIcon={<Briefcase className="w-4 h-4" />}
              placeholder="Your designation"
              className={errors.designation ? "border-red-500" : ""}
            />
            {errors.designation && (
              <p className="text-red-500 text-xs">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">
              What type of stakeholder are you? *
            </Label>
            <Select
              value={watchedStakeholderType}
              onValueChange={(value) => setValue("stakeholderType", value)}
            >
              <SelectTrigger
                className={`w-full ${
                  errors.stakeholderType ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="processor">Processor</SelectItem>
                <SelectItem value="logistics">Logistics Provider</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.stakeholderType && (
              <p className="text-red-500 text-xs">
                {errors.stakeholderType.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">
              How many years have you operated in this sector? *
            </Label>
            <Select
              value={watchedYearsOfOperation}
              onValueChange={(value) => setValue("yearsOfOperation", value)}
            >
              <SelectTrigger
                className={`w-full ${
                  errors.yearsOfOperation ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-5">2-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="11-15">11-15 years</SelectItem>
                <SelectItem value="16-20">16-20 years</SelectItem>
                <SelectItem value="20+">20+ years</SelectItem>
              </SelectContent>
            </Select>
            {errors.yearsOfOperation && (
              <p className="text-red-500 text-xs">
                {errors.yearsOfOperation.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm leading-normal">
              Please describe your business or organization within the
              agriculture or logistics value chain? *
            </Label>
            <Textarea
              {...register("businessDescription")}
              placeholder="Describe your business..."
              className={`min-h-[100px] resize-none ${
                errors.businessDescription ? "border-red-500" : ""
              }`}
            />
            {errors.businessDescription && (
              <p className="text-red-500 text-xs">
                {errors.businessDescription.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Completing..." : "Finish Registration"}
          </Button>
        </div>
      </form>

      <div className="w-full text-xs mt-10 flex flex-col justify-center items-center opacity-60">
        <p>© 2025 Origin group & Lafsinco.</p>
      </div>
    </div>
  );
}
