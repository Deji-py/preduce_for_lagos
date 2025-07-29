"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabaseClient } from "@/utils/supabase/client"; // Assuming this path is correct for your Supabase client

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      // Step 1: Get current user's email
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError || !user || !user.email) {
        throw new Error(
          "Could not retrieve user information. Please log in again."
        );
      }

      // Step 2: Verify current password by attempting to sign in
      const { error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (signInError) {
        // If sign-in fails, it means the current password is incorrect
        throw new Error("Invalid current password. Please try again.");
      }

      // Step 3: Update password with Supabase
      const { error: updateError } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Password Updated", {
        description: "Your password has been updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Password update failed:", error);
      toast.error("Update Failed", {
        description:
          error.message || "Failed to update password. Please try again.",
      });
    },
  });
}
