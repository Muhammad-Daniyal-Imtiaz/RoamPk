import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/onboarding(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
    // Additional admin role check for /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { userId } = auth;
      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }
      // Pull user role from DB
      const { db } = await import('@/db/client');
      const { users } = await import('@/db/schema');
      const user = await db.select().from(users).where(users.id.eq(userId)).limit(1);
      const role = user?.[0]?.active_role;
      if (role !== 'admin') {
        return new Response('Forbidden: Admins only', { status: 403 });
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
