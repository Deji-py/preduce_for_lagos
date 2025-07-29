"use client";

import { useUser } from "@/context/UserContext";
import FormRenderer from "@/features/my-form/FormRenderer";
import { formTypes } from "@/type";
import { Loader2 } from "lucide-react";

function MyForm() {
  const { profile, isProfileLoading } = useUser();

  if (isProfileLoading) {
    return (
      <div className="flex flex-col w-full justify-center items-center gap-4 p-4 md:gap-6 md:p-10">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading form...</span>
        </div>
      </div>
    );
  }

  if (!profile?.category) {
    return (
      <div className="flex flex-col w-full justify-center items-center gap-4 p-4 md:gap-6 md:p-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Category Not Selected
          </h2>
          <p className="text-gray-600">
            Please complete your onboarding to access the form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center gap-4 p-4 md:gap-6 md:p-10">
      <div className="w-full max-w-2xl">
        <FormRenderer
          type={profile.category as formTypes}
          isSubmitted={profile.form_submitted || false}
        />
      </div>
    </div>
  );
}

export default MyForm;
