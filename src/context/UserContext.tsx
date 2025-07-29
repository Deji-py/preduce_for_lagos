"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  queryKeys,
  queryFunctions,
  mutationFunctions,
  type UserProfile,
} from "@/lib/queries";

interface UserContextType {
  // Auth user from Supabase
  user: User | null;
  // User profile from database
  profile: UserProfile | null;
  // Loading states
  isLoading: boolean;
  isProfileLoading: boolean;
  // Error states
  error: string | null;
  // Methods
  refreshUser: () => Promise<void>;
  refreshProfile: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  // Computed properties
  isAuthenticated: boolean;
  hasResetPassword: boolean;
  hasSelectedCategory: boolean;
  fullName: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// UserProvider component
interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query for authenticated user
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: queryFunctions.getAuthUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (
        error?.message?.includes("Invalid JWT") ||
        error?.message?.includes("JWT expired")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Query for user profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: queryKeys.users.profile(user?.id || ""),
    queryFn: () => queryFunctions.getUserProfile(user?.id || ""),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: mutationFunctions.updateUserProfile,
    onSuccess: (updatedProfile) => {
      // Update the profile cache
      queryClient.setQueryData(
        queryKeys.users.profile(user?.id || ""),
        updatedProfile
      );
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    },
  });

  // Mutation for signing out
  const signOutMutation = useMutation({
    mutationFn: mutationFunctions.signOutUser,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      toast.success("You have been successfully signed out.");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to sign out. Please try again.");
    },
  });

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        // Update user query data
        queryClient.setQueryData(queryKeys.auth.user(), session.user);
        // Invalidate profile query to refetch with new user
        queryClient.invalidateQueries({
          queryKey: queryKeys.users.profile(session.user.id),
        });
      } else if (event === "SIGNED_OUT") {
        // Clear all user-related data
        queryClient.setQueryData(queryKeys.auth.user(), null);
        queryClient.removeQueries({
          queryKey: queryKeys.users.all(),
        });
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Update user data but don't refetch profile
        queryClient.setQueryData(queryKeys.auth.user(), session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Methods
  const refreshUser = async () => {
    await refetchUser();
  };

  const refreshProfile = () => {
    refetchProfile();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error("No authenticated user");
    }

    await updateProfileMutation.mutateAsync({
      userId: user.id,
      updates,
    });
  };

  const signOut = async () => {
    await signOutMutation.mutateAsync();
  };

  // Computed properties
  const isAuthenticated = !!user;
  const hasResetPassword = profile?.password_reset || false;
  const hasSelectedCategory = !!profile?.category;
  const fullName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : null;

  // Combined loading state
  const isLoading = isUserLoading;

  // Combined error state
  const error = userError?.message || profileError?.message || null;

  const contextValue: UserContextType = {
    user: user || null,
    profile: profile || null,
    isLoading,
    isProfileLoading: isProfileLoading || updateProfileMutation.isPending,
    error,
    refreshUser,
    refreshProfile,
    updateProfile,
    signOut,
    isAuthenticated,
    hasResetPassword,
    hasSelectedCategory,
    fullName,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
