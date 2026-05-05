"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { Modal } from "@/components/ui/modal";
import { apiFetch, SERVER_URL } from "@/lib/api";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useAuthStore } from "@/lib/authStore";
import type {
  Occasion,
  OnboardingProfile,
  WardrobeCategory,
  WardrobeItem,
  WeeklyPlan,
  WeeklyPlanDay,
} from "@/lib/wardrobe";
import { AIStylistView } from "./AIStylistView";
import { BottomNav, type DashboardTab } from "./BottomNav";
import { ClosetView } from "./ClosetView";
import { ProfileView } from "./ProfileView";
import { UploadModal } from "./UploadModal";
import { WeeklyPlannerView } from "./WeeklyPlannerView";

export function DashboardClient() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [tab, setTab] = React.useState<DashboardTab>("closet");
  const [filter, setFilter] = React.useState<WardrobeCategory | "all">("all");
  const [occasion, setOccasion] = React.useState<Occasion>("casual");
  const [stylistPrompt, setStylistPrompt] = React.useState<string>("");
  const [items, setItems] = React.useState<WardrobeItem[]>([]);
  const [recommendations, setRecommendations] = React.useState<WardrobeItem[]>([]);
  const [profile, setProfile] = React.useState<OnboardingProfile | null>(null);
  const [screenLoading, setScreenLoading] = React.useState(true);
  const [recommendationLoading, setRecommendationLoading] = React.useState(false);
  const [plannerGenerating, setPlannerGenerating] = React.useState(false);
  const [plan, setPlan] = React.useState<WeeklyPlan | null>(null);
  const [regeneratingDayDate, setRegeneratingDayDate] = React.useState<string | null>(null);
  const [updatingDayDate, setUpdatingDayDate] = React.useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [previewItem, setPreviewItem] = React.useState<WardrobeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<WardrobeItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const userId = user?.id;

  const loadItems = React.useCallback(async () => {
    if (!userId) return;
    const data = await apiFetch("/items");
    setItems(data.items || []);
  }, [userId]);

  const loadProfile = React.useCallback(async () => {
    if (!userId) return null;
    const data = await apiFetch("/onboarding");
    const nextProfile = (data.profile || null) as OnboardingProfile | null;
    setProfile(nextProfile);
    return nextProfile;
  }, [userId]);

  const loadWeeklyPlan = React.useCallback(async () => {
    if (!userId) return null;
    const data = await apiFetch("/planner");
    const nextPlan = (data.plan || null) as WeeklyPlan | null;
    setPlan(nextPlan);
    return nextPlan;
  }, [userId]);

  React.useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (loading) return;

      if (!user) {
        router.replace("/onboarding");
        return;
      }

      setScreenLoading(true);
      try {
        const loadedProfile = await loadProfile();
        if (!active) return;

        if (!loadedProfile?.onboardingCompleted) {
          router.replace("/onboarding");
          return;
        }

        await Promise.all([loadItems(), loadWeeklyPlan()]);
      } finally {
        if (active) {
          setScreenLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      active = false;
    };
  }, [loadItems, loadProfile, loadWeeklyPlan, loading, router, userId]);

  const getImageUrl = React.useCallback((item: WardrobeItem) => {
    const src = item.processedPath || item.originalPath;
    return src.startsWith("http") ? src : `${SERVER_URL}${src}`;
  }, []);

  async function generateRecommendations() {
    if (!user?.id) return;

    setRecommendationLoading(true);
    try {
      const data = await apiFetch("/recommend", {
        method: "POST",
        body: JSON.stringify({
          occasion,
          prompt:
            (stylistPrompt ? `${stylistPrompt}. ` : "") +
            (profile?.stylePreferences && profile.stylePreferences.length > 0
              ? `Style preferences: ${profile.stylePreferences.join(", ")}`
              : ""),
          userProfile: {
            primaryStyle: profile?.primaryStyle ?? null,
            stylePreferences: profile?.stylePreferences ?? [],
            size: profile?.size ?? null,
          },
        }),
      });
      setRecommendations(data.items || []);
    } finally {
      setRecommendationLoading(false);
    }
  }

  async function generateWeeklyPlan() {
    if (!user?.id) return;
    setPlannerGenerating(true);
    try {
      const data = await apiFetch("/planner/generate", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setPlan((data.plan || null) as WeeklyPlan | null);
    } finally {
      setPlannerGenerating(false);
    }
  }

  async function regenerateDay(date: string) {
    if (!user?.id) return;
    setRegeneratingDayDate(date);
    try {
      const data = await apiFetch("/planner/day/regenerate", {
        method: "POST",
        body: JSON.stringify({
          weekStart: plan?.weekStart || undefined,
          date,
        }),
      });
      setPlan((data.plan || null) as WeeklyPlan | null);
    } finally {
      setRegeneratingDayDate(null);
    }
  }

  async function updatePlanDay(date: string, patch: Partial<WeeklyPlanDay>) {
    if (!user?.id) return;
    setUpdatingDayDate(date);
    try {
      const data = await apiFetch("/planner/day", {
        method: "PATCH",
        body: JSON.stringify({
          weekStart: plan?.weekStart || undefined,
          date,
          ...patch,
        }),
      });
      setPlan((data.plan || null) as WeeklyPlan | null);
    } finally {
      setUpdatingDayDate(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const result = await apiFetch(`/items/${deleteTarget.id}`, { method: "DELETE" });
      if (result.ok) {
        setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
        setRecommendations((current) =>
          current.filter((item) => item.id !== deleteTarget.id)
        );
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuth(null, null);
    router.replace("/onboarding");
  }

  if (loading || screenLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="mt-4 text-sm text-[color:var(--muted)]">Loading your wardrobe...</p>
        </div>
      </div>
    );
  }

  const headerName = profile?.name || user?.email || "A";
  const avatarLabel = headerName.trim().charAt(0).toUpperCase() || "A";

  return (
    <>
      <div className="min-h-screen pb-40">
        <header className="glass-strong sticky top-0 z-30 border-b border-[color:rgba(164,140,104,0.28)]">
          <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-4 px-5 py-6 md:px-10">
            <button
              type="button"
              onClick={() => setTab("closet")}
              className="mura-display text-[2.2rem] leading-none text-foreground transition hover:text-primary"
            >
              Mura
            </button>

            <nav className="hidden items-center gap-6 text-[1rem] text-[color:var(--muted)] md:flex">
              <HeaderTab label="Closet" active={tab === "closet"} onClick={() => setTab("closet")} />
              <HeaderTab label="Planner" active={tab === "planner"} onClick={() => setTab("planner")} />
              <HeaderTab label="Stylist" active={tab === "stylist"} onClick={() => setTab("stylist")} />
              <button
                type="button"
                className="px-4 py-2 text-[color:var(--muted)] transition hover:text-foreground"
                onClick={() => setTab("profile")}
              >
                Trends
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setTab("profile")}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary)] text-xl text-[#f4e5cb] shadow-md transition hover:scale-[1.02]"
              aria-label="Open profile"
            >
              {avatarLabel}
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[92rem] px-5 py-8 md:px-10 md:py-10">
        {tab === "closet" && (
          <ClosetView
            items={items}
            filter={filter}
            onFilterChange={setFilter}
            getImageUrl={getImageUrl}
            onPreview={setPreviewItem}
            onDelete={setDeleteTarget}
            recommendations={recommendations}
            onOpenStylist={() => setTab("stylist")}
            onAddPiece={() => setUploadOpen(true)}
          />
        )}

        {tab === "stylist" && (
          <AIStylistView
            prompt={stylistPrompt}
            onPromptChange={setStylistPrompt}
            onGenerate={generateRecommendations}
            recommendations={recommendations}
            loading={recommendationLoading}
            getImageUrl={getImageUrl}
          />
        )}

        {tab === "planner" && (
          <WeeklyPlannerView
            plan={plan}
            items={items}
            getImageUrl={getImageUrl}
            generating={plannerGenerating}
            regeneratingDate={regeneratingDayDate}
            updatingDate={updatingDayDate}
            onGenerateWeek={generateWeeklyPlan}
            onRegenerateDay={regenerateDay}
            onUpdateDay={updatePlanDay}
          />
        )}

        {tab === "profile" && (
          <ProfileView profile={profile} items={items} onLogout={handleLogout} />
        )}
        </div>
      </div>

      {user && (
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSaved={async (item) => {
            if (item) {
              setItems((current) => [item, ...current.filter((existing) => existing.id !== item.id)]);
            }
            setProfile((current) =>
              current
                ? {
                    ...current,
                    uploadedFirstItem: true,
                  }
                : current
            );
          }}
        />
      )}

      <button
        type="button"
        onClick={() => setUploadOpen(true)}
        className="fixed bottom-36 right-5 z-50 flex h-18 w-18 items-center justify-center rounded-full bg-[color:var(--accent)] text-[color:var(--primary)] shadow-[0_24px_40px_rgba(95,69,35,0.2)] transition hover:scale-105 md:bottom-32 md:right-10"
        aria-label="Add clothing item"
      >
        <FiPlus className="h-8 w-8" />
      </button>

      <BottomNav active={tab} onChange={setTab} />

      <Modal open={!!previewItem} onClose={() => setPreviewItem(null)}>
        {previewItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{previewItem.name}</h3>
                <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {previewItem.category}
                </p>
              </div>
              <span
                className="inline-block h-5 w-5 rounded-full"
                style={{ backgroundColor: previewItem.colorHex }}
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-[color:var(--background)]">
              <img
                src={getImageUrl(previewItem)}
                alt={previewItem.name}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Delete this item?</h3>
          <p className="text-sm text-[color:var(--muted)]">
            {deleteTarget?.name} will be removed from your wardrobe.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="rounded-full bg-gradient-to-r from-[color:var(--destructive)] to-red-600 px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete item"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function HeaderTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 text-[1rem] transition",
        active ? "text-foreground" : "text-[color:var(--muted)] hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
