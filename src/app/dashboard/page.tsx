import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users, localTouristProfiles, internationalTouristProfiles } from "@/db/schema";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleDefinition } from "@/lib/roles";
import { ProfileForm } from "@/components/profile-form";
import { RoleSwitcher } from "@/components/role-switcher";
import {
  CalendarDays,
  MapPin,
  BadgeCheck,
  Globe,
  Flag,
  Users,
  Bed,
  Calendar,
  Clock,
  Plane,
  Home,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: { roles: true },
  });
  if (!dbUser) redirect("/sign-in");

  const activeRole = getRoleDefinition(dbUser.activeRole);
  const roleCount = dbUser.roles.length;
  const verifiedRoles = dbUser.roles.filter((r) => r.status === "active").length;
  const pendingRoles = dbUser.roles.filter((r) => r.status === "pending").length;
  const memberSince = new Date(dbUser.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isTourist = dbUser.activeRole === "tourist";
  let localProfile: typeof localTouristProfiles.$inferSelect | null = null;
  let internationalProfile: typeof internationalTouristProfiles.$inferSelect | null = null;

  if (isTourist) {
    localProfile = await db.query.localTouristProfiles.findFirst({
      where: eq(localTouristProfiles.userId, dbUser.id),
    }) ?? null;
    internationalProfile = await db.query.internationalTouristProfiles.findFirst({
      where: eq(internationalTouristProfiles.userId, dbUser.id),
    }) ?? null;
  }

  return (
    <main className="min-h-screen pt-28">
      <Section>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="mt-1 text-gray-400">Welcome back, {dbUser.name}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardContent className="text-center">
                {dbUser.image ? (
                  <img src={dbUser.image} alt="" className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-[#006600]/30" />
                ) : (
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#006600]/10 text-4xl font-black text-[#006600] ring-2 ring-[#006600]/30">
                    {dbUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="mt-4 text-2xl font-black text-white">{dbUser.name}</h2>
                <p className="text-sm text-gray-400">{dbUser.email}</p>
                {activeRole && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#006600]/10 px-4 py-1.5 text-xs font-black uppercase text-[#006600]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {activeRole.label}
                  </span>
                )}
                <div className="mt-5 space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                  {dbUser.city && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{dbUser.city}{dbUser.province ? `, ${dbUser.province}` : ""}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role stats */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">Stats</h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#1a201a] p-3 text-center">
                    <p className="text-2xl font-black text-white">{roleCount}</p>
                    <p className="text-xs text-gray-400">Roles</p>
                  </div>
                  <div className="rounded-2xl bg-[#1a201a] p-3 text-center">
                    <p className="text-2xl font-black text-green-400">{verifiedRoles}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                  <div className="rounded-2xl bg-[#1a201a] p-3 text-center">
                    <p className="text-2xl font-black text-yellow-400">{pendingRoles}</p>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role switcher — lets user pick which role is active */}
            <RoleSwitcher
              roles={dbUser.roles as { id: string; role: import("@/lib/roles").UserRole; status: "pending" | "active" | "suspended" | "rejected" }[]}
              activeRole={dbUser.activeRole}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Active role context banner */}
            {activeRole && (
              <Card>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#006600]/15 text-[#006600]">
                      <activeRole.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006600]">
                        You are browsing as
                      </p>
                      <p className="mt-0.5 text-lg font-black text-white">{activeRole.label}</p>
                      <p className="mt-1 text-sm text-gray-400">{activeRole.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <ProfileForm user={dbUser} />

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

            {dbUser.bio && (
              <Card>
                <CardContent>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">About</h3>
                  <p className="mt-3 text-gray-300">{dbUser.bio}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
