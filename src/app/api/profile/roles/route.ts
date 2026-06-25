import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: { roles: true },
    columns: { activeRole: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    activeRole: user.activeRole,
    roles: user.roles.map((r) => ({
      id: r.id,
      role: r.role,
      status: r.status,
    })),
  });
}
