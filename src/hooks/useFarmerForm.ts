"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type FarmerData } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitFarmerForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to farmer data structure
      const farmerData: Omit<FarmerData, "id" | "created_at"> = {
        user_id: user.id,
        full_name: formData.fullName,
        farm_name: formData.farmName || "", // You might want to add this field to the form
        farm_address: formData.farmLocations,
        phone_numbers: formData.contactInformation,
        email_address: user.email || null,
        farm_size: formData.farmSize,
        commodities_produced: formData.mainCrops,
        farming_methods: formData.farmingType,
        farming_methods_other: formData.irrigationMethods || null,
        average_yield: formData.monthlyOutput,
        market_channels: [], // You might want to add this field to the form
        market_channels_other: null,
        programme_goals: formData.seasonalCalendar, // Mapping this for now
        support_needed: `Cooperative: ${formData.cooperativeMember}, Extension: ${formData.extensionService}`,
      };

      // Submit farmer form
      const farmerResult = await mutationFunctions.submitFarmerForm(farmerData);

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
