"use client";

import type React from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface UserLoadingProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function UserLoadingProvider({
  children,
  fallback,
}: UserLoadingProviderProps) {
  const { isProfileLoading, isLoading } = useUser();

  if (isProfileLoading && !isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Please Wait</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
