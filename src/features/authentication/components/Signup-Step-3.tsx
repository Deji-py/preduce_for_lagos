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
import { User, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { updateUserProfile } from "../api/auth";
import { toast } from "sonner";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  state: z.string().min(1, "Please select a state"),
  gender: z.string().min(1, "Please select a gender"),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

type SignUpStepProps = {
  next: () => void;
};

const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function SignupStep3({ next }: SignUpStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Get userId from search params
  const userId = searchParams.get("userId") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  const watchedState = watch("state");
  const watchedGender = watch("gender");

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    try {
      await updateUserProfile(userId, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        state: data.state,
        gender: data.gender,
      });

      toast.success("Profile Updated", {
        description: "Your personal information has been saved.",
      });

      next();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to update profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col">
        <div>
          <h1 className="font-poppins text-xl lg:text-2xl font-semibold">
            Personal Information
          </h1>
          <p className="text-xs lg:text-sm mt-2 opacity-70">
            Enter Your Personal Info Below.
          </p>
        </div>

        <div className="mt-10 flex flex-col space-y-6">
          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">First Name *</Label>
            <Input
              {...register("firstName")}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="First Name"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Last Name *</Label>
            <Input
              {...register("lastName")}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="Last Name"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Phone *</Label>
            <Input
              {...register("phone")}
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="Phone Number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">State *</Label>
            <Select
              value={watchedState}
              onValueChange={(value) => setValue("state", value)}
            >
              <SelectTrigger
                className={`w-full ${errors.state ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state, index) => (
                  <SelectItem value={state} key={index}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-xs">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="!text-sm">Gender *</Label>
            <Select
              value={watchedGender}
              onValueChange={(value) => setValue("gender", value)}
            >
              <SelectTrigger
                className={`w-full ${errors.gender ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>

      <div className="w-full text-xs mt-20 flex flex-col justify-center items-center opacity-60">
        <p>© 2025 Origin group & Lafsinco.</p>
      </div>
    </div>
  );
}
