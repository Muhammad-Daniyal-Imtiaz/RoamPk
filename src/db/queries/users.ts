import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { userRoles, users } from "@/db/schema";
import type { UserRole } from "@/lib/roles";

const createId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkUserId, userId),
    with: { roles: true },
  });

  return existing ?? null;
}

export async function syncCurrentUser(defaultRole: UserRole = "tourist") {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUser.id),
    with: { roles: true },
  });

  if (existing) return existing;

  const userId = createId("usr");
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const displayName = clerkUser.fullName ?? clerkUser.username ?? email.split("@")[0] ?? "RoamPK User";

  await db.insert(users).values({
    id: userId,
    clerkUserId: clerkUser.id,
    email,
    displayName,
    imageUrl: clerkUser.imageUrl,
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
  // 1️⃣ Ensure the caller is an admin
  const { userId: callerId } = await auth();
  if (!callerId) throw new Error('Unauthenticated');

  // Verify caller's role is admin
  const caller = await db.query.users.findFirst({
    where: eq(users.id, callerId),
    with: { roles: true },
  });
  if (!caller) throw new Error('Caller not found');
  const callerIsAdmin = caller.roles.some((r) => r.role === 'admin' && r.status === 'active');
  if (!callerIsAdmin) throw new Error('Forbidden: only admins can promote');

  // 2️⃣ Update the target user's active_role field
  await db
    .update(users)
    .set({ activeRole: 'admin' })
    .where(eq(users.id, targetUserId));

  // 3️⃣ Insert the admin role assignment with status "active"
  await db.insert(userRoles).values({
    id: createId('urole'),
    userId: targetUserId,
    role: 'admin',
    status: 'active',
  });

  // Return the updated user (including new role)
  return db.query.users.findFirst({
    where: eq(users.id, targetUserId),
    with: { roles: true },
  });
}
