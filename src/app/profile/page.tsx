import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partnerProfiles, users } from "@/db/schema";
import { ProfileForm } from "@/components/profile-form";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleDefinition } from "@/lib/roles";

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
              <Card>
                <CardContent>
                  <p className="text-center text-gray-500">No business profiles yet. Complete onboarding to add one.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <ProfileForm user={user} />
          </div>
        </div>
      </Section>
    </main>
  );
}
