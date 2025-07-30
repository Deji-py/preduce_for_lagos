import { supabaseClient } from "@/utils/supabase/client";

// Generate random password
function generateRandomPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function sendOTP(email: string) {
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) throw error;
  return { success: true };
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabaseClient.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throw error;
  return data;
}

export async function createUserWithRandomPassword(email: string) {
  const randomPassword = generateRandomPassword();

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password: randomPassword,
  });

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profileData: any) {
  const { error } = await supabaseClient
    .from("users")
    .update(profileData)
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}

export async function sendPasswordResetLink(email: string) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return { success: true };
}

export async function sendMagicLink(email: string) {
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
  return { success: true };
}
export async function resetPassword(newPassword: string) {
  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  // Mark password as reset in the database
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (user) {
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({ password_reset: true })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating password_reset flag:", updateError);
      // Don't throw error here as the password was successfully updated
    }
  }

  return { success: true };
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
  return { success: true };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function sendPasswordResetOTP(email: string): Promise<void> {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`, // Ensure this matches your actual password update page
  });

  if (error) {
    // Supabase often returns specific error messages for rate limits
    if (
      error.message.includes(
        "For security purposes, you can only request a password reset once every"
      )
    ) {
      throw new Error(
        "You have requested a password reset recently. Please check your email or try again later."
      );
    }
    throw new Error(error.message || "Failed to send password reset email.");
  }
}

export async function verifyPasswordResetOTP(
  email: string,
  token: string,
  newPassword: string
) {
  // First verify the OTP
  const { data, error: verifyError } = await supabaseClient.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (verifyError) throw verifyError;

  // Then update the password
  const { error: updateError } = await supabaseClient.auth.updateUser({
    password: newPassword,
  });

  if (updateError) throw updateError;

  // Mark password as reset in the database
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (user) {
    const { error: dbError } = await supabaseClient
      .from("users")
      .update({ password_reset: true })
      .eq("id", user.id);

    if (dbError) {
      console.error("Error updating password_reset flag:", dbError);
    }
  }

  return data;
}

export async function checkUserExists(email: string) {
  // This is a workaround since Supabase doesn't have a direct way to check if user exists
  // We'll try to send a password reset and catch the error
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

    if (error) {
      return error;
    }

    // If no error, user exists
    return { exists: true };
  } catch (error: any) {
    // If error contains "User not found", user doesn't exist
    if (
      error.message?.includes("User not found") ||
      error.message?.includes("not found")
    ) {
      return { exists: false };
    }
    // For other errors, assume user exists to be safe
    return { exists: true };
  }
}

export async function updateUserCategory(userId: string, category: string) {
  const { error } = await supabaseClient
    .from("users")
    .update({ category })
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}
