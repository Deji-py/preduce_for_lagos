"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  queryKeys,
  mutationFunctions,
  type AggregatorData,
} from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitAggregatorForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to aggregator data structure
      const aggregatorData: Omit<AggregatorData, "id" | "created_at"> = {
        user_id: user.id,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        primary_commodities: formData.primaryCommodities,
        operational_regions: formData.operationalRegions,
        monthly_aggregation_volume: formData.monthlyAggregationVolume,
        collection_points: formData.collectionPoints,
        storage_facilities: formData.storageFacilities,
        farmer_relationships: formData.farmerRelationships,
        logistics_partners: formData.logisticsPartners || null,
        sectors_interested: formData.sectorsInterested,
        support_needed: formData.supportNeeded,
      };

      // Submit aggregator form
      const aggregatorResult = await mutationFunctions.submitAggregatorForm(
        aggregatorData
      );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return aggregatorResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.aggregators.byUser(user.id),
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
