"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type FarmerData } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

// matches public.farmers insertable columns
type FarmerInsert = {
  user_id: string;
  full_name: string;
  contact_information: string | null;
  farm_locations: string | null;
  farm_size: string | null;
  farming_type: string[] | null; // text[]
  main_crops: string | null;
  seasonal_calendar: string | null;
  monthly_output: string | null;
  cooperative_member: boolean | null;
  extension_service: boolean | null;
};

export function useSubmitFarmerForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // normalize helpers
      const toNullableString = (v: any) =>
        typeof v === "string" && v.trim() !== "" ? v.trim() : null;

      const toStringArrayOrNull = (v: any): string[] | null => {
        if (Array.isArray(v)) return v.map(String);
        if (typeof v === "string" && v.trim() !== "") {
          // if you accept comma-separated input from the UI
          return v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return null;
        // Postgres array is fine with a JS string[] via supabase-js. :contentReference[oaicite:2]{index=2}
      };

      const toNullableBool = (v: any): boolean | null =>
        typeof v === "boolean" ? v : v == null ? null : !!v;

      // Map form data to farmer data structure
      const farmerData: FarmerInsert = {
        user_id: user.id,
        full_name: (formData.fullName ?? "").trim(),
        contact_information: toNullableString(formData.contactInformation),
        farm_locations: toNullableString(formData.farmLocations),
        farm_size: toNullableString(formData.farmSize),
        farming_type: toStringArrayOrNull(formData.farmingType),
        main_crops: toNullableString(formData.mainCrops),
        seasonal_calendar: toNullableString(formData.seasonalCalendar),
        monthly_output: toNullableString(formData.monthlyOutput),
        cooperative_member: toNullableBool(formData.cooperativeMember),
        extension_service: toNullableBool(formData.extensionService),
      };
      // Submit farmer form
      const farmerResult = await mutationFunctions.submitFarmerForm(
        farmerData as any
      );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return farmerResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.farmers.byUser(user.id),
        });
      }
      toast.success(
        "Form submitted successfully! Your application is now under review."
      );
    },
    onError: (error: any) => {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to submit form. Please try again.");
    },
  });
}
