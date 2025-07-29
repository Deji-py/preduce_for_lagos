"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  queryKeys,
  mutationFunctions,
  type BulkTraderData,
} from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitBulkTraderForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to bulk trader data structure
      const bulkTraderData: Omit<BulkTraderData, "id" | "created_at"> = {
        user_id: user.id,
        business_name: formData.businessName,
        business_entity: formData.businessEntity,
        year_established: formData.yearEstablished,
        business_address: formData.businessAddress,
        email_address: formData.emailAddress,
        phone_numbers: formData.phoneNumbers,
        website: formData.website || null,
        registration_number: formData.registrationNumber,
        contact_full_name: formData.contactFullName,
        contact_position: formData.contactPosition,
        contact_phone_number: formData.contactPhoneNumber,
        contact_email_address: formData.contactEmailAddress,
        primary_commodities: formData.primaryCommodities,
        monthly_trade_volume: formData.monthlyTradeVolume,
        points_of_origin: formData.pointsOfOrigin,
        distribution_channels: formData.distributionChannels,
        transport_vehicles: formData.transportVehicles,
        storage_facilities: formData.storageFacilities,
        storage_capacity: formData.storageCapacity || null,
        trading_hubs: formData.tradingHubs,
        programme_participation: formData.programmeParticipation,
        support_required: formData.supportRequired,
      };

      // Submit bulk trader form
      const bulkTraderResult = await mutationFunctions.submitBulkTraderForm(
        bulkTraderData
      );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return bulkTraderResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.bulkTraders.byUser(user.id),
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
