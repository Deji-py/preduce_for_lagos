"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  queryKeys,
  mutationFunctions,
  type InputSupplierData,
} from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitInputSupplierForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to input supplier data structure
      const inputSupplierData: Omit<InputSupplierData, "id" | "created_at"> = {
        user_id: user.id,
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        inputs_supplied: formData.inputsSupplied,
        regions_of_distribution: formData.regionsOfDistribution,
        sales_volume: formData.salesVolume,
        distribution_channels: formData.distributionChannels,
        partnerships: formData.partnerships,
        training_farmers: formData.trainingFarmers,
        bulk_packages: formData.bulkPackages,
      };

      // Submit input supplier form
      const inputSupplierResult =
        await mutationFunctions.submitInputSupplierForm(inputSupplierData);

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return inputSupplierResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.inputSuppliers.byUser(user.id),
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
