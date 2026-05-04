"use client";

import React from "react";
import { FiCheckCircle, FiLogOut, FiUser } from "react-icons/fi";
import type { OnboardingProfile, WardrobeItem } from "@/lib/wardrobe";

export function ProfileView({
  profile,
  items,
  onLogout,
}: {
  profile: OnboardingProfile | null;
  items: WardrobeItem[];
  onLogout: () => Promise<void>;
}) {
  const styleSummary =
    profile?.stylePreferences && profile.stylePreferences.length > 0
      ? profile.stylePreferences.join(", ")
      : "Not set yet";

  return (
    <section className="space-y-6 pb-28">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Profile</h1>
      </div>

      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiUser className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground">
              {profile?.name || "Mura Member"}
            </p>
            <p className="truncate text-sm text-[color:var(--muted)]">
              {profile?.email || "Signed in"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Items" value={String(items.length)} />
          <StatCard label="Primary style" value={profile?.primaryStyle || "Unset"} />
          <StatCard label="Size" value={profile?.size || "Unset"} />
          <StatCard
            label="Onboarding"
            value={profile?.onboardingCompleted ? "Done" : "Pending"}
          />
        </div>

        <div className="mt-6 rounded-3xl bg-[color:var(--background)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FiCheckCircle className="h-4 w-4 text-primary" />
            Style profile
          </div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{styleSummary}</p>
        </div>

        <button
          type="button"
          onClick={() => void onLogout()}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <FiLogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
