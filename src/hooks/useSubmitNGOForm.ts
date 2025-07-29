"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type NGOData } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitNGOForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to NGO data structure
      const ngoData: Omit<NGOData, "id" | "created_at"> = {
        user_id: user.id,
        organization_name: formData.organizationName,
        type: formData.type,
        type_other: formData.typeOther || null,
        year_established: formData.yearEstablished,
        head_office_address: formData.headOfficeAddress,
        email_address: formData.emailAddress,
        phone_numbers: formData.phoneNumbers,
        website: formData.website || null,
        social_media_handles: formData.socialMediaHandles || null,
        contact_full_name: formData.contactFullName,
        contact_designation: formData.contactDesignation,
        contact_phone_number: formData.contactPhoneNumber,
        contact_email_address: formData.contactEmailAddress,
        alternate_contact: formData.alternateContact || null,
        focus_areas: formData.focusAreas,
        focus_areas_other: formData.focusAreasOther || null,
        past_projects: formData.pastProjects,
        ongoing_projects: formData.ongoingProjects,
        collaborating_agencies: formData.collaboratingAgencies,
        engagement: formData.engagement,
        resources: formData.resources,
        resources_other: formData.resourcesOther || null,
        support_required: formData.supportRequired,
      };

      // Submit NGO form
      const ngoResult = await mutationFunctions.submitNGOForm(ngoData);

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return ngoResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.ngos.byUser(user.id),
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
