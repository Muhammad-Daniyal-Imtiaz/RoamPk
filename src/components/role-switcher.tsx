"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CheckCircle2, Clock, Shield, Loader2 } from "lucide-react";
import { getRoleDefinition } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";
import { Card, CardContent } from "@/components/ui/card";

type UserRoleRow = {
  id: string;
  role: UserRole;
  status: "pending" | "active" | "suspended" | "rejected";
};

type RoleSwitcherProps = {
  roles: UserRoleRow[];
  activeRole: UserRole;
};

export function RoleSwitcher({ roles, activeRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<UserRole>(activeRole);
  const [switching, setSwitching] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const activeRoles = roles.filter((r) => r.status === "active");
  const currentDef = getRoleDefinition(current);
  const CurrentIcon = currentDef?.icon ?? Shield;

  const handleSwitch = async (role: UserRole) => {
    if (role === current || switching) return;
    setOpen(false);
    setSwitching(true);

    try {
      const res = await fetch("/api/profile/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        setCurrent(role);
        setToast({ msg: `Switched to ${getRoleDefinition(role)?.label ?? role}`, ok: true });
        // Refresh server components so dashboard re-renders with new role
        router.refresh();
      } else {
        const { error } = await res.json();
        setToast({ msg: error ?? "Failed to switch role", ok: false });
      }
    } catch {
      setToast({ msg: "Network error — please try again", ok: false });
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#006600]">
          Active Role
        </h3>

        {/* Trigger button */}
        <div ref={dropdownRef} className="relative mt-4">
          <button
            id="role-switcher-trigger"
            type="button"
            disabled={switching || activeRoles.length <= 1}
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-[#006600]/40 bg-[#006600]/10 px-4 py-3 text-left transition hover:border-[#006600]/70 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#006600] text-white shadow">
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CurrentIcon className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-black text-white">
                {currentDef?.label ?? current}
              </p>
              <p className="text-xs text-[#006600]">
                {switching ? "Switching…" : "Active role"}
              </p>
            </div>
            {activeRoles.length > 1 && (
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#121812] shadow-2xl">
              <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Switch role
              </p>
              {roles.map((r) => {
                const def = getRoleDefinition(r.role);
                const Icon = def?.icon ?? Shield;
                const isActive = r.role === current;
                const canSwitch = r.status === "active";

                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={!canSwitch}
                    onClick={() => handleSwitch(r.role)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition
                      ${isActive ? "bg-[#006600]/15" : ""}
                      ${canSwitch && !isActive ? "hover:bg-white/5" : ""}
                      ${!canSwitch ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg
                        ${isActive ? "bg-[#006600] text-white" : "bg-[#1a201a] text-[#006600]"}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate text-sm font-bold ${isActive ? "text-[#006600]" : "text-white"}`}>
                        {def?.label ?? r.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.status === "active"
                          ? def?.permissions.slice(0, 2).join(", ")
                          : r.status === "pending"
                          ? "Awaiting approval"
                          : r.status}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isActive ? (
                        <CheckCircle2 className="h-4 w-4 text-[#006600]" />
                      ) : r.status === "pending" ? (
                        <Clock className="h-4 w-4 text-yellow-400" />
                      ) : r.status === "rejected" ? (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-400">
                          Rejected
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}

              {/* Add role link */}
              <div className="border-t border-white/5 px-4 py-3">
                <a
                  href="/onboarding"
                  className="flex items-center gap-2 text-xs font-semibold text-[#006600] hover:underline"
                >
                  + Add another role
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Permissions preview */}
        {currentDef && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Role permissions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentDef.permissions.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-[#006600]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#006600]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl transition-all
            ${toast.ok ? "bg-[#006600] text-white" : "bg-red-600 text-white"}
          `}
        >
          {toast.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <Shield className="h-4 w-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}
    </Card>
  );
}
