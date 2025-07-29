"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  queryKeys,
  mutationFunctions,
  type GovernmentAgencyData,
} from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitGovernmentAgencyForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to government agency data structure
      const governmentAgencyData: Omit<
        GovernmentAgencyData,
        "id" | "created_at"
      > = {
        user_id: user.id,
        agency_name: formData.agencyName,
        mandate: formData.mandate,
        department: formData.department,
        contact_address: formData.contactAddress,
        website: formData.website || null,
        email_address: formData.emailAddress,
        phone_numbers: formData.phoneNumbers,
        focal_person_name: formData.focalPersonName,
        focal_person_position: formData.focalPersonPosition,
        focal_person_phone: formData.focalPersonPhone,
        focal_person_email: formData.focalPersonEmail,
        alternate_contact: formData.alternateContact || null,
        geographic_coverage: formData.geographicCoverage,
        involvement: formData.involvement,
        involvement_others: formData.involvementOthers || null,
        ongoing_initiatives: formData.ongoingInitiatives,
        partnerships: formData.partnerships,
        contribution_plan: formData.contributionPlan,
        support_required: formData.supportRequired,
      };

      // Submit government agency form
      const governmentAgencyResult =
        await mutationFunctions.submitGovernmentAgencyForm(
          governmentAgencyData
        );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return governmentAgencyResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.governmentAgencies.byUser(user.id),
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
