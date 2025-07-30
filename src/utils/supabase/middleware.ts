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

  // Authenticated users - check password reset status
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("password_reset, category")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return supabaseResponse;
    }

    const hasResetPassword = userData?.password_reset || false;
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

    // User has reset password and selected category
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
