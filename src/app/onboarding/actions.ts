"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partnerProfiles, userRoles, users } from "@/db/schema";
import { syncCurrentUser } from "@/db/queries/users";
import { getRoleDefinition, type UserRole } from "@/lib/roles";
import { createId } from "@/lib/id";

export async function completeOnboarding(formData: FormData) {
  const role = formData.get("role") as UserRole;
  const roleDefinition = getRoleDefinition(role);

  if (!roleDefinition) {
    throw new Error("Invalid role selected");
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const dbUser = await syncCurrentUser(role);
  if (!dbUser) redirect("/sign-in");

  const updateData: Record<string, unknown> = {};

  const bio = formData.get("bio");
  if (bio) updateData.bio = bio;

  const city = formData.get("city");
  if (city) updateData.city = city;

  const province = formData.get("province");
  if (province) updateData.province = province;

  const about = formData.get("about");
  if (about) updateData.about = about;

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

  const isBusiness = roleDefinition.isBusiness;

  if (isBusiness) {
    const businessName = String(formData.get("businessName") ?? "");
    const designation = formData.get("designation") as string | null;
    const designationOther = formData.get("designationOther") as string | null;
    const contactPhone = String(formData.get("contactPhone") ?? "");
    const address = String(formData.get("address") ?? "");
    const area = String(formData.get("area") ?? "");
    const website = String(formData.get("website") ?? "");
    const proofImageUrl = String(formData.get("proofImageUrl") ?? "");
    const proofType = formData.get("proofType") as string | null;

    await db
      .insert(partnerProfiles)
      .values({
        id: createId("partner"),
        userId: dbUser.id,
        role,
        businessName: businessName || `${dbUser.name} ${roleDefinition.label}`,
        designation: (designation && designation !== "other" ? designation : null) as typeof partnerProfiles.designation,
        designationOther: designation === "other" ? designationOther : null,
        contactPhone,
        city: String(formData.get("city") ?? ""),
        address,
        province: String(formData.get("province") ?? ""),
        area,
        about: String(formData.get("about") ?? ""),
        isBusiness: true,
        website,
        proofImageUrl: proofImageUrl || null,
        proofType: (proofType as typeof partnerProfiles.proofType) || null,
        verificationStatus: "pending",
        metadataJson: Object.fromEntries(formData.entries()),
      })
      .onConflictDoUpdate({
        target: [partnerProfiles.userId, partnerProfiles.role],
        set: {
          businessName: businessName || `${dbUser.name} ${roleDefinition.label}`,
          designation: (designation && designation !== "other" ? designation : null) as typeof partnerProfiles.designation,
          designationOther: designation === "other" ? designationOther : null,
          contactPhone,
          city: String(formData.get("city") ?? ""),
          address,
          province: String(formData.get("province") ?? ""),
          area,
          about: String(formData.get("about") ?? ""),
          website,
          proofImageUrl: proofImageUrl || null,
          proofType: (proofType as typeof partnerProfiles.proofType) || null,
          verificationStatus: "pending",
          metadataJson: Object.fromEntries(formData.entries()),
          updatedAt: new Date().toISOString(),
        },
      });
  }

  redirect("/dashboard");
}
