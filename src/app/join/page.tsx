"use client";

import { ArrowRight, CheckCircle2, Database, KeyRound, Plus, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MotionDiv } from "@/components/motion";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import {
  followTargetTypes,
  roleCategories,
  roleDefinitions,
  type RoleCategory,
  type UserRole,
} from "@/lib/roles";

const categoryOrder: RoleCategory[] = ["traveler", "partner", "community", "operator"];

export default function JoinPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("tourist");
  const activeRole = roleDefinitions.find((role) => role.id === selectedRole) ?? roleDefinitions[0];
  const groupedRoles = useMemo(
    () =>
      categoryOrder.map((category) => ({
        category,
        roles: roleDefinitions.filter((role) => role.category === category),
      })),
    [],
  );

  return (
    <main className="pt-24">
      <section className="relative isolate overflow-hidden bg-[#101510] px-4 py-24 text-white lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,102,0,.55),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,215,0,.25),transparent_30%)]" />
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#FFD700]" />
              NextAuth + Turso ready role architecture
            </p>
            <h1 className="text-balance text-5xl font-black tracking-tight md:text-7xl">
              Join RoamPK as anyone in the travel ecosystem.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              Tourists, local users, hotels, hostels, cafés, SIM partners, guides, food experts, emergency teams, and admins all share one extensible role model.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg">
                  Join RoamPK
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">View Role Model</Button>
            </div>
          </div>
          <Card className="border-white/10 bg-white/10 text-white backdrop-blur">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFD700] text-[#1a1a1a]">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Active role preview</p>
                  <h2 className="text-2xl font-black">{activeRole.label}</h2>
                </div>
              </div>
              <p className="mt-5 text-white/70">{activeRole.description}</p>
              <div className="mt-6 grid gap-3">
                {activeRole.permissions.slice(0, 4).map((permission) => (
                  <div key={permission} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    {permission}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      </section>

      <Section title="Pick a Role" subtitle="Adding another role later is one new object in src/lib/roles.ts — tiny door, huge hallway.">
        <div className="grid gap-8">
          {groupedRoles.map(({ category, roles }) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-black">{roleCategories[category]}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`rounded-2xl border p-5 text-left shadow-sm hover:-translate-y-1 hover:shadow-2xl ${
                        isSelected ? "border-[#006600] bg-[#006600]/5 ring-4 ring-[#006600]/10" : "border-black/5 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#006600]/10 text-[#006600]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-black">{role.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-gray-500">{role.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Role-Aware Onboarding Form" subtitle="NextAuth owns identity, Turso owns roles and partner profiles.">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <Card>
            <CardContent className="grid gap-4">
              <label className="text-sm font-bold text-gray-500">Selected Role</label>
              <Select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as UserRole)}>
                {roleDefinitions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </Select>
              <Input placeholder="Full name" />
              <Input placeholder="Email address" />
              {activeRole.onboardingFields.map((field) => (
                <Input key={field} placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())} />
              ))}
              <Button
                size="lg"
                onClick={() => toast(`${activeRole.label} onboarding saved as UI demo`)}
              >
                Save Onboarding Draft
              </Button>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent>
              <div className="flex items-center gap-3">
                <KeyRound className="h-6 w-6 text-[#006600]" />
                <h3 className="text-2xl font-black">Implementation Notes</h3>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-gray-600">
                <p>NextAuth (Auth.js) stores identity, session, credentials, and OAuth providers.</p>
                <p>Turso stores app truth: roles, partner verification, follows, and role-specific metadata.</p>
                <p>Credentials provider (email/password) + Google OAuth for authentication.</p>
              </div>
              <div className="mt-6 rounded-2xl bg-[#101510] p-5 text-sm text-emerald-100">
                <div className="mb-3 flex items-center gap-2 font-black text-white">
                  <Database className="h-4 w-4" />
                  NextAuth + Turso stack
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs leading-6">{`users
- id, name, email, password
- active_role, onboarding_complete

user_roles
- id, user_id, role, status

partner_profiles
- id, user_id, role, business_name
- designation, proof_image_url
- city, province, about, verification_status`}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Follow Anything" subtitle="Users can follow people, partners, places, routes, and future objects without redesigning the database.">
        <div className="flex flex-wrap justify-center gap-3">
          {followTargetTypes.map((type) => (
            <span key={type} className="rounded-full border border-[#006600]/15 bg-[#006600]/5 px-4 py-2 text-sm font-bold text-[#006600]">
              {type}
            </span>
          ))}
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-bold text-white">
            <Plus className="h-4 w-4" />
            Add more later
          </span>
        </div>
      </Section>
    </main>
  );
}
