import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { syncCurrentUser } from "@/db/queries/users";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRoleDefinition } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const dbUser = await syncCurrentUser();
  if (!dbUser) redirect("/sign-in");

  const activeRole = getRoleDefinition(dbUser.activeRole);

  return (
    <main className="pt-28">
      <Section title={`Welcome, ${dbUser.name}`} subtitle="Your identity is synced into Turso through Drizzle.">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <Card>
            <CardContent>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">Active Role</p>
              <h2 className="mt-3 text-3xl font-black">{activeRole?.label ?? dbUser.activeRole}</h2>
              <p className="mt-3 text-gray-500">{activeRole?.description}</p>
              <Link href="/onboarding">
                <Button className="mt-6" variant="outline">Change / Add Role</Button>
              </Link>
              <Link href="/profile">
                <Button className="mt-3" variant="outline">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-2xl font-black">Your Roles</h2>
              <div className="mt-5 grid gap-3">
                {dbUser.roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                    <span className="font-bold">{getRoleDefinition(role.role)?.label ?? role.role}</span>
                    <span className="rounded-full bg-[#006600]/10 px-3 py-1 text-xs font-black uppercase text-[#006600]">{role.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </main>
  );
}
