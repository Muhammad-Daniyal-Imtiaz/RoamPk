import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { users, userRoles } from "@/db/schema";
import type { UserRole } from "@/lib/roles";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json() as { role: UserRole };

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Verify the user actually owns this role and it's active
    const userRole = await db.query.userRoles.findFirst({
      where: and(
        eq(userRoles.userId, session.user.id),
        eq(userRoles.role, role),
        eq(userRoles.status, "active"),
      ),
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "You do not have an active version of that role" },
        { status: 403 },
      );
    }

    await db
      .update(users)
      .set({ activeRole: role, updatedAt: new Date().toISOString() })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, activeRole: role });
  } catch (error) {
    console.error("Role switch error:", error);
    return NextResponse.json({ error: "Switch failed" }, { status: 500 });
  }
}
