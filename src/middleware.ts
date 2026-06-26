import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default auth(async (req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ["/dashboard", "/onboarding", "/admin", "/profile"];
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + "/"));

  // Redirect authenticated users away from auth pages
  const authPaths = ["/sign-in", "/sign-up"];
  const isAuthPage = authPaths.includes(path);

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check if user is trying to access onboarding but has already completed it
  if (path === "/onboarding" && isLoggedIn && req.auth?.user?.id) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.auth.user.id),
        columns: {
          onboardingComplete: true,
        },
      });

      if (user?.onboardingComplete) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.error("Error checking onboarding status in middleware:", error);
    }
  }

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|uploads|api/auth).*)",
  ],
};
