"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partnerProfiles, userRoles, users } from "@/db/schema";
import { syncCurrentUser } from "@/db/queries/users";
import { getRoleDefinition, type UserRole } from "@/lib/roles";

const createId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

export async function completeOnboarding(formData: FormData) {
  const role = formData.get("role") as UserRole;
  const roleDefinition = getRoleDefinition(role);

  if (!roleDefinition) {
    throw new Error("Invalid role selected");
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const dbUser = await syncCurrentUser(role);
  if (!dbUser) {
    redirect("/sign-in");
  }

  await db
    .insert(userRoles)
    .values({
      id: createId("urole"),
      userId: dbUser.id,
      role,
      status: role === "tourist" || role === "local_user" ? "active" : "pending",
    })
    .onConflictDoUpdate({
      target: [userRoles.userId, userRoles.role],
      set: {
        status: role === "tourist" || role === "local_user" ? "active" : "pending",
        updatedAt: new Date().toISOString(),
      },
    });

  await db
    .update(users)
    .set({
      activeRole: role,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, dbUser.id));

  if (roleDefinition.category === "partner" || roleDefinition.category === "operator") {
    const businessName =
      String(formData.get("businessName") ?? "") ||
      String(formData.get("organizationName") ?? "") ||
      `${dbUser.displayName} ${roleDefinition.label}`;

    await db
      .insert(partnerProfiles)
      .values({
        id: createId("partner"),
        userId: dbUser.id,
        role,
        businessName,
        contactPhone: String(formData.get("phone") ?? ""),
        city: String(formData.get("city") ?? ""),
        address: String(formData.get("address") ?? ""),
        verificationStatus: "pending",
        metadataJson: Object.fromEntries(formData.entries()),
      })
      .onConflictDoUpdate({
        target: [partnerProfiles.userId, partnerProfiles.role],
        set: {
          businessName,
          contactPhone: String(formData.get("phone") ?? ""),
          city: String(formData.get("city") ?? ""),
          address: String(formData.get("address") ?? ""),
          verificationStatus: "pending",
          metadataJson: Object.fromEntries(formData.entries()),
          updatedAt: new Date().toISOString(),
        },
      });
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      activeRole: role,
      onboardingComplete: true,
    },
  });

  redirect("/dashboard");
}
