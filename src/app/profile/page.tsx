import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partnerProfiles, users, localTouristProfiles, internationalTouristProfiles } from "@/db/schema";
import { ProfileForm } from "@/components/profile-form";
import { RoleSwitcher } from "@/components/role-switcher";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleDefinition } from "@/lib/roles";
import { Calendar, Clock, Flag, Globe, MapPin, Users, Bed, Plane, Home, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: { roles: true },
  });
  if (!user) redirect("/sign-in");

  const activeRoleDef = getRoleDefinition(user.activeRole);
  const profiles = await db.query.partnerProfiles.findMany({
    where: eq(partnerProfiles.userId, user.id),
  });

  const isTourist = user.activeRole === "tourist";
  let localProfile: typeof localTouristProfiles.$inferSelect | null = null;
  let internationalProfile: typeof internationalTouristProfiles.$inferSelect | null = null;

  if (isTourist) {
    localProfile = await db.query.localTouristProfiles.findFirst({
      where: eq(localTouristProfiles.userId, user.id),
    }) ?? null;
    internationalProfile = await db.query.internationalTouristProfiles.findFirst({
      where: eq(internationalTouristProfiles.userId, user.id),
    }) ?? null;
  }

  return (
    <main className="pt-28">
      <Section title="Your Profile" subtitle="Manage your RoamPK profile and business information">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="text-center">
                {user.image ? (
                  <img src={user.image} alt="" className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-[#006600]/30" />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#006600]/10 text-4xl font-black text-[#006600] ring-2 ring-[#006600]/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="mt-4 text-2xl font-black text-white">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
                {activeRoleDef && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#006600]/10 px-4 py-1.5 text-xs font-black uppercase text-[#006600]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {activeRoleDef.label}
                  </span>
                )}
                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p>{user.roles.length} role{user.roles.length !== 1 ? "s" : ""} assigned</p>
                  {user.bio && <p className="mt-3 text-gray-300">{user.bio}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Local Tourist Profile */}
            {localProfile && (
              <Card>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Flag className="h-5 w-5 text-[#006600]" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">Local Tourist Profile</h3>
                  </div>
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    {localProfile.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">City:</span>
                        <span className="font-semibold text-white">{localProfile.city}</span>
                      </div>
                    )}
                    {localProfile.province && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Province:</span>
                        <span className="font-semibold text-white">{localProfile.province}</span>
                      </div>
                    )}
                    {localProfile.visitPurpose && (
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Purpose:</span>
                        <span className="font-semibold text-white">{localProfile.visitPurpose}</span>
                      </div>
                    )}
                    {localProfile.arrivalDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Travel Date:</span>
                        <span className="font-semibold text-white">{localProfile.arrivalDate}</span>
                      </div>
                    )}
                    {localProfile.durationDays && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-semibold text-white">{localProfile.durationDays} days</span>
                      </div>
                    )}
                    {localProfile.citiesToVisitJson.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-gray-400">Destinations:</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {localProfile.citiesToVisitJson.map((c) => (
                            <span key={c} className="rounded-full bg-[#006600]/10 px-2.5 py-0.5 text-xs font-semibold text-[#006600]">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {localProfile.travelGroup && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Group:</span>
                        <span className="font-semibold text-white">{localProfile.travelGroup}{localProfile.groupSize ? ` (${localProfile.groupSize})` : ""}</span>
                      </div>
                    )}
                    {localProfile.accommodationPreference && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Accommodation:</span>
                        <span className="font-semibold text-white">{localProfile.accommodationPreference}{localProfile.accommodationBudget ? ` - PKR ${localProfile.accommodationBudget}` : ""}</span>
                      </div>
                    )}
                    {localProfile.bio && (
                      <div className="md:col-span-2">
                        <span className="text-gray-400">About:</span>
                        <p className="mt-1 text-white">{localProfile.bio}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* International Tourist Profile */}
            {internationalProfile && (
              <Card>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#006600]" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">International Tourist Profile</h3>
                  </div>
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    {internationalProfile.country && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">From:</span>
                        <span className="font-semibold text-white">{internationalProfile.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-gray-400">Visiting Pakistan:</span>
                      <span className={`font-semibold ${internationalProfile.comingToPakistan ? "text-green-400" : "text-yellow-400"}`}>
                        {internationalProfile.comingToPakistan ? "Yes" : "Exploring options"}
                      </span>
                    </div>
                    {internationalProfile.visitPurpose && (
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Purpose:</span>
                        <span className="font-semibold text-white">{internationalProfile.visitPurpose}</span>
                      </div>
                    )}
                    {internationalProfile.arrivalDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Arrival:</span>
                        <span className="font-semibold text-white">{internationalProfile.arrivalDate}</span>
                      </div>
                    )}
                    {internationalProfile.durationDays && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-semibold text-white">{internationalProfile.durationDays} days</span>
                      </div>
                    )}
                    {internationalProfile.citiesToVisitJson.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-gray-400">Visiting:</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {internationalProfile.citiesToVisitJson.map((c) => (
                            <span key={c} className="rounded-full bg-[#006600]/10 px-2.5 py-0.5 text-xs font-semibold text-[#006600]">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {internationalProfile.travelGroup && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Group:</span>
                        <span className="font-semibold text-white">{internationalProfile.travelGroup}{internationalProfile.groupSize ? ` (${internationalProfile.groupSize})` : ""}</span>
                      </div>
                    )}
                    {internationalProfile.accommodationPreference && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Accommodation:</span>
                        <span className="font-semibold text-white">{internationalProfile.accommodationPreference}{internationalProfile.accommodationBudget ? ` - PKR ${internationalProfile.accommodationBudget}` : ""}</span>
                      </div>
                    )}
                    {internationalProfile.homeCity && (
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 shrink-0 text-gray-500" />
                        <span className="text-gray-400">Home City:</span>
                        <span className="font-semibold text-white">{internationalProfile.homeCity}</span>
                      </div>
                    )}
                    {internationalProfile.bio && (
                      <div className="md:col-span-2">
                        <span className="text-gray-400">About:</span>
                        <p className="mt-1 text-white">{internationalProfile.bio}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const def = getRoleDefinition(profile.role);
                return (
                  <Card key={profile.id}>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-[#006600]">{def?.label || profile.role}</p>
                          <h3 className="mt-1 text-xl font-black text-white">{profile.businessName}</h3>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                          profile.verificationStatus === "verified" ? "bg-green-500/10 text-green-400" :
                          profile.verificationStatus === "rejected" ? "bg-red-500/10 text-red-400" :
                          "bg-yellow-500/10 text-yellow-400"
                        }`}>
                          {profile.verificationStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                        {profile.designation && (
                          <p><span className="text-gray-500">Designation:</span> <span className="font-semibold text-white">{profile.designation}</span></p>
                        )}
                        {profile.city && <p><span className="text-gray-500">City:</span> <span className="font-semibold text-white">{profile.city}</span></p>}
                        {profile.province && <p><span className="text-gray-500">Province:</span> <span className="font-semibold text-white">{profile.province}</span></p>}
                        {profile.contactPhone && <p><span className="text-gray-500">Phone:</span> <span className="font-semibold text-white">{profile.contactPhone}</span></p>}
                        {profile.website && <p><span className="text-gray-500">Website:</span> <span className="font-semibold text-white">{profile.website}</span></p>}
                        {profile.about && (
                          <p className="md:col-span-2"><span className="text-gray-500">About:</span> <span className="text-white">{profile.about}</span></p>
                        )}
                      </div>

                      {profile.proofImageUrl && (
                        <div className="mt-4">
                          <p className="mb-2 text-sm text-gray-500">Verification Document ({profile.proofType || "other"}):</p>
                          <img src={profile.proofImageUrl} alt="Proof" className="h-24 w-auto rounded-xl border border-white/10 object-cover" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              !localProfile && !internationalProfile && (
                <Card>
                  <CardContent>
                    <p className="text-center text-gray-500">No business profiles yet. Complete onboarding to add one.</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          <div className="space-y-6">
            {/* Role switcher */}
            <RoleSwitcher
              roles={user.roles as { id: string; role: import("@/lib/roles").UserRole; status: "pending" | "active" | "suspended" | "rejected" }[]}
              activeRole={user.activeRole}
            />
            <ProfileForm user={user} />
          </div>
        </div>
      </Section>
    </main>
  );
}
