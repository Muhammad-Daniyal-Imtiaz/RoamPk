import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ["/dashboard", "/onboarding", "/admin", "/profile"];
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + "/"));

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
