import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { completeOnboarding } from "@/app/onboarding/actions";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { roleDefinitions } from "@/lib/roles";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="pt-28">
      <Section title="Complete Your RoamPK Profile" subtitle="Choose your active role. You can add more roles later.">
        <Card className="mx-auto max-w-3xl">
          <CardContent>
            <form action={completeOnboarding} className="grid gap-4">
              <Select name="role" required>
                {roleDefinitions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </Select>
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="businessName" placeholder="Business / display name (if partner)" />
                <Input name="organizationName" placeholder="Organization name (if emergency/admin)" />
                <Input name="city" placeholder="City" />
                <Input name="phone" placeholder="Phone" />
              </div>
              <Input name="address" placeholder="Address or operating area" />
              <Input name="notes" placeholder="Languages, destinations, provider, cuisine, or verification notes" />
              <Button size="lg" type="submit">Finish Onboarding</Button>
            </form>
          </CardContent>
        </Card>
      </Section>
    </main>
  );
}
