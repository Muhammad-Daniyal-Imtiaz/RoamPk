"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  Moon,
  User,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoleDefinition } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";

const links = [
  ["Hotels", "/hotels"],
  ["SIM", "/sim"],
  ["Currency", "/currency"],
  ["Tours", "/tours"],
  ["Emergency", "/emergency"],
  ["Language", "/language"],
  ["Join", "/join"],
];

type RoleRow = {
  id: string;
  role: UserRole;
  status: "pending" | "active" | "suspended" | "rejected";
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Role state
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [switching, setSwitching] = useState(false);
  const [roleView, setRoleView] = useState(false); // sub-panel: show roles list
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Fetch roles when signed in
  const fetchRoles = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const res = await fetch("/api/profile/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles ?? []);
        setActiveRole(data.activeRole ?? null);
      }
    } catch {
      // silent
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) fetchRoles();
  }, [isSignedIn, fetchRoles]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setRoleView(false);
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

  const handleSwitchRole = async (role: UserRole) => {
    if (role === activeRole || switching) return;
    setSwitching(true);
    try {
      const res = await fetch("/api/profile/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setActiveRole(role);
        setToast({ msg: `Switched to ${getRoleDefinition(role)?.label ?? role}`, ok: true });
        setMenuOpen(false);
        setRoleView(false);
        router.refresh();
      } else {
        const { error } = await res.json();
        setToast({ msg: error ?? "Failed to switch", ok: false });
      }
    } catch {
      setToast({ msg: "Network error", ok: false });
    } finally {
      setSwitching(false);
    }
  };

  const activeRoleDef = activeRole ? getRoleDefinition(activeRole) : null;
  const ActiveIcon = activeRoleDef?.icon ?? Shield;
  const activeRoles = roles.filter((r) => r.status === "active");
  const hasMultipleRoles = roles.length > 1;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-white/10",
          dark ? "bg-[#101510]/90 text-white backdrop-blur-md" : "glass",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#006600] text-white shadow-lg shadow-green-900/20">
              PK
            </span>
            Roam-PK
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#006600]/10 hover:text-[#006600]",
                  dark ? "text-gray-200" : "text-gray-700",
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
              <Moon className="h-4 w-4" />
            </Button>

            {!isSignedIn && (
              <Link href="/sign-up" className="hidden sm:block">
                <Button size="sm">Join RoamPK</Button>
              </Link>
            )}

            {isSignedIn && (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                {/* Profile trigger */}
                <button
                  id="navbar-profile-btn"
                  onClick={() => { setMenuOpen(!menuOpen); setRoleView(false); }}
                  className="flex items-center gap-2 rounded-full bg-[#1a201a] px-3 py-1.5 text-sm font-semibold transition hover:bg-[#006600]/20"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span>{session.user?.name?.split(" ")[0] || "User"}</span>
                  {/* Active role indicator dot */}
                  {activeRoleDef && (
                    <span className="hidden items-center gap-1 rounded-full bg-[#006600]/20 px-2 py-0.5 text-[10px] font-black text-[#006600] sm:flex">
                      <ActiveIcon className="h-2.5 w-2.5" />
                      {activeRoleDef.label.split(" ")[0]}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#131813] shadow-2xl">
                    {/* Main menu */}
                    {!roleView && (
                      <>
                        {/* User info header */}
                        <div className="border-b border-white/5 px-4 py-3">
                          <p className="font-bold text-white">
                            {session.user?.name?.split(" ")[0]}
                          </p>
                          {activeRoleDef && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <ActiveIcon className="h-3 w-3 text-[#006600]" />
                              <span className="text-xs font-semibold text-[#006600]">
                                {activeRoleDef.label}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Nav links */}
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#006600]/10"
                          >
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#006600]/10"
                          >
                            <User className="h-4 w-4" /> Profile
                          </Link>

                          {/* Switch role — show if user has roles loaded */}
                          {roles.length > 0 && (
                            <button
                              id="navbar-switch-role-btn"
                              onClick={() => setRoleView(true)}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#006600]/10"
                            >
                              <RefreshCw className="h-4 w-4 text-[#006600]" />
                              <span className="flex-1 text-left">Switch Role</span>
                              <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                            </button>
                          )}
                        </div>

                        <div className="border-t border-white/5 p-2">
                          <button
                            onClick={() => signOut()}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    )}

                    {/* Role switcher sub-panel */}
                    {roleView && (
                      <>
                        <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
                          <button
                            onClick={() => setRoleView(false)}
                            className="grid h-7 w-7 place-items-center rounded-lg hover:bg-white/5"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180 text-gray-400" />
                          </button>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Switch Role
                          </p>
                        </div>

                        <div className="max-h-72 overflow-y-auto py-1">
                          {roles.map((r) => {
                            const def = getRoleDefinition(r.role);
                            const Icon = def?.icon ?? Shield;
                            const isCurrent = r.role === activeRole;
                            const canSwitch = r.status === "active";

                            return (
                              <button
                                key={r.id}
                                id={`role-option-${r.role}`}
                                disabled={!canSwitch || switching}
                                onClick={() => handleSwitchRole(r.role)}
                                className={cn(
                                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                                  isCurrent && "bg-[#006600]/10",
                                  canSwitch && !isCurrent && "hover:bg-white/5 cursor-pointer",
                                  !canSwitch && "cursor-not-allowed opacity-40",
                                )}
                              >
                                <div
                                  className={cn(
                                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                                    isCurrent
                                      ? "bg-[#006600] text-white"
                                      : "bg-[#1a201a] text-[#006600]",
                                  )}
                                >
                                  {switching && isCurrent ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Icon className="h-3.5 w-3.5" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "truncate font-bold",
                                      isCurrent ? "text-[#006600]" : "text-white",
                                    )}
                                  >
                                    {def?.label ?? r.role}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {r.status === "pending"
                                      ? "Awaiting approval"
                                      : r.status === "active"
                                      ? "Active"
                                      : r.status}
                                  </p>
                                </div>
                                {isCurrent ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#006600]" />
                                ) : r.status === "pending" ? (
                                  <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>

                        <div className="border-t border-white/5 px-4 py-2">
                          <Link
                            href="/onboarding"
                            onClick={() => { setMenuOpen(false); setRoleView(false); }}
                            className="text-xs font-semibold text-[#006600] hover:underline"
                          >
                            + Add another role
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div
            className={cn(
              "mx-4 mb-4 grid gap-2 rounded-2xl p-4 shadow-xl lg:hidden",
              dark ? "bg-[#1a201a] text-white" : "bg-white",
            )}
          >
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10"
              >
                {label}
              </Link>
            ))}
            {isSignedIn && (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10">
                  Dashboard
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-[#006600]/10">
                  Profile
                </Link>

                {/* Mobile role switcher */}
                {activeRoles.length > 1 && (
                  <div className="rounded-2xl border border-white/10 bg-[#111511] p-3">
                    <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Switch Role
                    </p>
                    {roles.map((r) => {
                      const def = getRoleDefinition(r.role);
                      const Icon = def?.icon ?? Shield;
                      const isCurrent = r.role === activeRole;
                      const canSwitch = r.status === "active";
                      return (
                        <button
                          key={r.id}
                          disabled={!canSwitch || switching}
                          onClick={() => { handleSwitchRole(r.role); setOpen(false); }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm",
                            isCurrent && "bg-[#006600]/10",
                            canSwitch && !isCurrent && "hover:bg-white/5",
                            !canSwitch && "opacity-40",
                          )}
                        >
                          <div className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                            isCurrent ? "bg-[#006600] text-white" : "bg-[#1a201a] text-[#006600]",
                          )}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className={cn("flex-1 font-bold", isCurrent ? "text-[#006600]" : "text-white")}>
                            {def?.label ?? r.role}
                          </span>
                          {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-[#006600]" />}
                          {r.status === "pending" && <Clock className="h-3.5 w-3.5 text-yellow-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => signOut()} className="rounded-xl px-4 py-3 text-left font-semibold text-red-400 hover:bg-red-400/10">
                  Sign Out
                </button>
              </>
            )}
            {!isSignedIn && (
              <Link href="/sign-up" onClick={() => setOpen(false)} className="rounded-xl bg-[#006600] px-4 py-3 text-center font-black text-white">
                Join RoamPK
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl transition-all",
            toast.ok ? "bg-[#006600] text-white" : "bg-red-600 text-white",
          )}
        >
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}
    </>
  );
}
