"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type RetailerData } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitRetailerForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to retailer data structure
      const retailerData: Omit<RetailerData, "id" | "created_at"> = {
        user_id: user.id,
        business_name: formData.businessName,
        retail_operation_type: formData.retailOperationType,
        retail_operation_type_other: formData.retailOperationTypeOther || null,
        year_established: formData.yearEstablished,
        store_addresses: formData.storeAddresses,
        email_address: formData.emailAddress,
        phone_numbers: formData.phoneNumbers,
        business_registration_number:
          formData.businessRegistrationNumber || null,
        owner_full_name: formData.ownerFullName,
        owner_position: formData.ownerPosition,
        owner_phone_number: formData.ownerPhoneNumber,
        owner_email_address: formData.ownerEmailAddress,
        commodities_sold: formData.commoditiesSold,
        daily_sales_volume: formData.dailySalesVolume,
        primary_suppliers: formData.primarySuppliers,
        customer_base: formData.customerBase,
        payment_methods: formData.paymentMethods,
        programme_goals: formData.programmeGoals,
        support_needed: formData.supportNeeded,
      };

      // Submit retailer form
      const retailerResult = await mutationFunctions.submitRetailerForm(
        retailerData
      );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return retailerResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.retailers.byUser(user.id),
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
