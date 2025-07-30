import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Define routes
  const publicRoutes = ["/", "/signup"];
  const resetPasswordRoute = "/reset-password";
  const onboardingRoute = "/onboarding";
  const dashboardRoute = "/dashboard";

  const isPublicRoute = publicRoutes.includes(pathname);
  const isResetPasswordRoute = pathname === resetPasswordRoute;
  const isOnboardingRoute = pathname === onboardingRoute;
  const isDashboardRoute = pathname === dashboardRoute;

  // Unauthenticated users
  if (!user) {
    if (isPublicRoute) {
      return supabaseResponse;
    }
    // Redirect all other routes to home
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Authenticated users - check password reset status and other fields
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select(
        "password_reset, category, first_name, last_name, phone, state, gender, company_name, designation, stakeholder_type, years_of_operation, business_description"
      )
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return supabaseResponse;
    }

    const hasResetPassword = userData?.password_reset || false;
    const hasPersonalInfo =
      userData?.first_name &&
      userData?.last_name &&
      userData?.phone &&
      userData?.state &&
      userData?.gender;
    const hasCompanyInfo =
      userData?.company_name &&
      userData?.designation &&
      userData?.stakeholder_type &&
      userData?.years_of_operation &&
      userData?.business_description;
    const hasCategory = userData?.category || false;

    // User hasn't reset password
    if (!hasResetPassword) {
      // Allow public routes and reset password page
      if (isPublicRoute || isResetPasswordRoute) {
        return supabaseResponse;
      }
      // Redirect all other routes to reset password
      const url = request.nextUrl.clone();
      url.pathname = "/reset-password";
      url.searchParams.set("required", "true");
      return NextResponse.redirect(url);
    }

    // User hasn't completed personal info
    if (!hasPersonalInfo && isDashboardRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/signup";
      url.searchParams.set("step", "3");
      url.searchParams.set("required", "true");
      url.searchParams.set("userId", user?.id as string);
      url.searchParams.set("email", user?.email as string);
      return NextResponse.redirect(url);
    }

    // User hasn't completed company info
    if (!hasCompanyInfo && isDashboardRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/signup";
      url.searchParams.set("step", "4");
      url.searchParams.set("required", "true");
      url.searchParams.set("userId", user?.id as string);
      url.searchParams.set("email", user?.email as string);
      return NextResponse.redirect(url);
    }

    // User hasn't selected a category
    if (!hasCategory) {
      // Allow public routes, reset password, and onboarding routes
      if (isPublicRoute || isResetPasswordRoute || isOnboardingRoute) {
        return supabaseResponse;
      }
      // Redirect dashboard and other routes to onboarding
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      url.searchParams.set("required", "true");
      return NextResponse.redirect(url);
    }

    // User has reset password, completed all required fields, and selected category
    if (isResetPasswordRoute || isOnboardingRoute) {
      // Redirect from reset password or onboarding to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Allow all other routes
    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    return supabaseResponse;
  }
}
