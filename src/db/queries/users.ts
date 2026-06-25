import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { userRoles, users } from "@/db/schema";
import type { UserRole } from "@/lib/roles";
import { createId } from "@/lib/id";

export async function getCurrentDbUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: { roles: true },
  });

  return existing ?? null;
}

export async function syncCurrentUser(defaultRole: UserRole = "tourist") {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { roles: true },
  });

  if (existing) return existing;

  const email = session.user?.email ?? "";
  const name = session.user?.name ?? email.split("@")[0] ?? "RoamPK User";

  await db.insert(users).values({
    id: userId,
    name,
    email,
    image: session.user?.image,
    activeRole: defaultRole,
  });

  await db.insert(userRoles).values({
    id: createId("urole"),
    userId,
    role: defaultRole,
    status: "active",
  });

  return db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { roles: true },
  });
}

export async function promoteUserToAdmin(targetUserId: string) {
  const session = await auth();
  const callerId = session?.user?.id;
  if (!callerId) throw new Error("Unauthenticated");

  const caller = await db.query.users.findFirst({
    where: eq(users.id, callerId),
    with: { roles: true },
  });
  if (!caller) throw new Error("Caller not found");

  const callerIsAdmin = caller.roles.some((r) => r.role === "admin" && r.status === "active");
  if (!callerIsAdmin) throw new Error("Forbidden: only admins can promote");

  await db
    .update(users)
    .set({ activeRole: "admin" })
    .where(eq(users.id, targetUserId));

  await db.insert(userRoles).values({
    id: createId("urole"),
    userId: targetUserId,
    role: "admin",
    status: "active",
  });

  return db.query.users.findFirst({
    where: eq(users.id, targetUserId),
    with: { roles: true },
  });
}
