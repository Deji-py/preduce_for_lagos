"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type InvestorData } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useSubmitInvestorForm() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Map form data to investor data structure
      const investorData: Omit<InvestorData, "id" | "created_at"> = {
        user_id: user.id,
        name: formData.name,
        company: formData.company || null,
        contact_details: formData.contactDetails,
        investment_focus: formData.investmentFocus,
        past_investment_experience: formData.pastInvestmentExperience,
        preferred_instruments: formData.preferredInstruments,
        investment_size_range: formData.investmentSizeRange,
        time_horizon: formData.timeHorizon,
        areas_of_interest: formData.areasOfInterest,
        co_investment: formData.coInvestment,
        pitch_forums: formData.pitchForums,
      };

      // Submit investor form
      const investorResult = await mutationFunctions.submitInvestorForm(
        investorData
      );

      // Update user form submission status
      await mutationFunctions.updateFormSubmissionStatus(user.id);

      return investorResult;
    },
    onSuccess: () => {
      // Invalidate user profile to refresh form_submitted status
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.investors.byUser(user.id),
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
