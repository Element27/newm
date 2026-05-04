"use client";

import React from "react";
import { FiCalendar, FiGrid, FiUser, FiZap } from "react-icons/fi";

export type DashboardTab = "closet" | "planner" | "stylist" | "profile";

const tabs: Array<{
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "closet", label: "Closet", icon: FiGrid },
  { id: "planner", label: "Planner", icon: FiCalendar },
  { id: "stylist", label: "Stylist", icon: FiZap },
  { id: "profile", label: "Profile", icon: FiUser },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}) {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 md:left-1/2 md:w-[42rem] md:max-w-[calc(100vw-4rem)] md:-translate-x-1/2">
      <div className="mura-dock mx-auto flex items-center justify-between rounded-[2rem] p-3 text-[#cab189]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={[
                "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[1.55rem] px-3 py-4 text-sm tracking-[0.18em] uppercase transition-all duration-300",
                isActive
                  ? "bg-[#d6b47a] text-[color:var(--primary)] shadow-[0_10px_24px_rgba(26,18,11,0.22)]"
                  : "text-[#9d8767] hover:text-[#edd9ba]",
              ].join(" ")}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
