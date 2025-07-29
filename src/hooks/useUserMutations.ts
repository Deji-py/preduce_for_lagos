"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys, mutationFunctions, type UserProfile } from "@/lib/queries";
import { useUser } from "@/context/UserContext";

export function useUpdateProfile() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) => {
      if (!user) {
        throw new Error("No authenticated user");
      }
      return mutationFunctions.updateUserProfile({
        userId: user.id,
        updates,
      });
    },
    onMutate: async (updates) => {
      if (!user) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.users.profile(user.id),
      });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(
        queryKeys.users.profile(user.id)
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.users.profile(user.id),
        (old: UserProfile | undefined) => {
          if (!old) return old;
          return { ...old, ...updates };
        }
      );

      // Return a context object with the snapshotted value
      return { previousProfile };
    },
    onError: (error: any, updates, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfile && user) {
        queryClient.setQueryData(
          queryKeys.users.profile(user.id),
          context.previousProfile
        );
      }
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onSettled: () => {
      if (user) {
        // Always refetch after error or success
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(user.id),
        });
      }
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFunctions.signOutUser,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      toast.success("You have been successfully signed out.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to sign out. Please try again.");
    },
  });
}
