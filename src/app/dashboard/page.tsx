import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleDefinition } from "@/lib/roles";
import { ProfileForm } from "@/components/profile-form";
import {
  CalendarDays,
  MapPin,
  Shield,
  User,
  BadgeCheck,
  Clock,
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

  return (
    <main className="min-h-screen pt-28">
      <Section>
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="mt-1 text-gray-400">Welcome back, {dbUser.name}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Left Column - User Profile Card */}
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

                <div className="mt-5 space-y-2">
                  <Link href="/onboarding">
                    <Button variant="outline" className="w-full">Add / Change Role</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">Your Roles</h3>
                <div className="mt-4 space-y-2">
                  {dbUser.roles.map((role) => {
                    const def = getRoleDefinition(role.role);
                    const Icon = def?.icon || Shield;
                    return (
                      <div key={role.id} className="flex items-center gap-3 rounded-2xl bg-[#1a201a] p-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#006600]/10 text-[#006600]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-bold text-white">{def?.label || role.role}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          role.status === "active" ? "bg-green-500/10 text-green-400" :
                          role.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                          role.status === "rejected" ? "bg-red-500/10 text-red-400" :
                          "bg-gray-500/10 text-gray-400"
                        }`}>
                          {role.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Editor */}
          <div className="space-y-6">
            <ProfileForm user={dbUser} />

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
