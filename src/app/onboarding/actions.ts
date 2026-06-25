"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partnerProfiles, touristProfiles, userRoles, users } from "@/db/schema";
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

  if (role === "tourist") {
    const country = String(formData.get("country") ?? "Pakistan");
    const isInternational = country !== "Pakistan";
    const comingToPakistan = formData.get("comingToPakistan") === "yes";
    const citiesRaw = String(formData.get("citiesToVisit") ?? "[]");
    let cities: string[];
    try { cities = JSON.parse(citiesRaw); } catch { cities = []; }

    await db
      .insert(touristProfiles)
      .values({
        id: createId("tprof"),
        userId: dbUser.id,
        country,
        city: String(formData.get("city") ?? ""),
        province: String(formData.get("province") ?? ""),
        isInternational,
        comingToPakistan,
        visitPurpose: String(formData.get("visitPurpose") ?? ""),
        arrivalDate: String(formData.get("arrivalDate") ?? ""),
        durationDays: Number(formData.get("durationDays")) || null,
        citiesToVisitJson: cities,
        travelGroup: String(formData.get("travelGroup") ?? ""),
        groupSize: Number(formData.get("groupSize")) || null,
        accommodationPreference: String(formData.get("accommodationPreference") ?? ""),
        accommodationBudget: Number(formData.get("accommodationBudget")) || null,
        bio: String(formData.get("bio") ?? ""),
      })
      .onConflictDoUpdate({
        target: [touristProfiles.userId],
        set: {
          country,
          city: String(formData.get("city") ?? ""),
          province: String(formData.get("province") ?? ""),
          isInternational,
          comingToPakistan,
          visitPurpose: String(formData.get("visitPurpose") ?? ""),
          arrivalDate: String(formData.get("arrivalDate") ?? ""),
          durationDays: Number(formData.get("durationDays")) || null,
          citiesToVisitJson: cities,
          travelGroup: String(formData.get("travelGroup") ?? ""),
          groupSize: Number(formData.get("groupSize")) || null,
          accommodationPreference: String(formData.get("accommodationPreference") ?? ""),
          accommodationBudget: Number(formData.get("accommodationBudget")) || null,
          bio: String(formData.get("bio") ?? ""),
          updatedAt: new Date().toISOString(),
        },
      });
  }

  if (roleDefinition.isBusiness) {
    await db
      .insert(partnerProfiles)
      .values({
        id: createId("partner"),
        userId: dbUser.id,
        role,
        businessName: String(formData.get("businessName") ?? "") || `${dbUser.name} ${roleDefinition.label}`,
        designation: (formData.get("designation") as typeof partnerProfiles.designation) || null,
        designationOther: formData.get("designation") === "other" ? String(formData.get("designationOther") ?? "") : null,
        contactPhone: String(formData.get("contactPhone") ?? ""),
        city: String(formData.get("city") ?? ""),
        address: String(formData.get("address") ?? ""),
        province: String(formData.get("province") ?? ""),
        area: String(formData.get("area") ?? ""),
        about: String(formData.get("about") ?? ""),
        isBusiness: true,
        website: String(formData.get("website") ?? ""),
        proofImageUrl: String(formData.get("proofImageUrl") ?? "") || null,
        proofType: (formData.get("proofType") as typeof partnerProfiles.proofType) || null,
        verificationStatus: "pending",
        metadataJson: Object.fromEntries(formData.entries()),
      })
      .onConflictDoUpdate({
        target: [partnerProfiles.userId, partnerProfiles.role],
        set: {
          businessName: String(formData.get("businessName") ?? "") || `${dbUser.name} ${roleDefinition.label}`,
          designation: (formData.get("designation") as typeof partnerProfiles.designation) || null,
          designationOther: formData.get("designation") === "other" ? String(formData.get("designationOther") ?? "") : null,
          contactPhone: String(formData.get("contactPhone") ?? ""),
          city: String(formData.get("city") ?? ""),
          address: String(formData.get("address") ?? ""),
          province: String(formData.get("province") ?? ""),
          area: String(formData.get("area") ?? ""),
          about: String(formData.get("about") ?? ""),
          website: String(formData.get("website") ?? ""),
          proofImageUrl: String(formData.get("proofImageUrl") ?? "") || null,
          proofType: (formData.get("proofType") as typeof partnerProfiles.proofType) || null,
          verificationStatus: "pending",
          metadataJson: Object.fromEntries(formData.entries()),
          updatedAt: new Date().toISOString(),
        },
      });
  }

  redirect("/dashboard");
}
