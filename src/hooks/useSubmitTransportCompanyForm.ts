"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  queryKeys,
  mutationFunctions,
  type TransportCompanyData,
} from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitTransportCompanyForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to transport company data structure
      const transportCompanyData: Omit<
        TransportCompanyData,
        "id" | "created_at"
      > = {
        user_id: user.id,
        company_name: formData.companyName,
        contact_person: formData.contactPerson,
        fleet_size_refrigerated: formData.fleetSizeRefrigerated || null,
        fleet_size_flatbed: formData.fleetSizeFlatbed || null,
        fleet_size_vans: formData.fleetSizeVans || null,
        regions_of_service: formData.regionsOfService,
        vehicle_ownership: formData.vehicleOwnership,
        commodities_transported: formData.commoditiesTransported,
        volume_capacity: formData.volumeCapacity,
        cold_chain_capabilities: formData.coldChainCapabilities,
        warehousing_points: formData.warehousingPoints,
      };

      // Submit transport company form
      const transportCompanyResult =
        await mutationFunctions.submitTransportCompanyForm(
          transportCompanyData
        );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return transportCompanyResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.transportCompanies.byUser(user.id),
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
