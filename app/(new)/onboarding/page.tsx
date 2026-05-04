"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "../../../components/onboarding/OnboardingLayout";
import { apiFetch, apiUpload, SERVER_URL } from "../../../lib/api";
import { useAuthStore } from "../../../lib/authStore";
import { getSupabaseBrowser } from "../../../lib/supabase";
import {
  PRIMARY_STYLE_OPTIONS,
  SIZE_OPTIONS,
  STYLE_OPTIONS,
  type OnboardingProfile,
  type WardrobeItem,
} from "../../../lib/wardrobe";

type Step =
  | "welcome"
  | "signup"
  | "about"
  | "style-quiz"
  | "tip-photo"
  | "tip-tagging"
  | "tip-curate"
  | "first-upload"
  | "upsell"
  | "loading"
  | "recommendation"
  | "success";

const FLOW: Step[] = [
  "welcome",
  "signup",
  "about",
  "style-quiz",
  "tip-photo",
  "tip-tagging",
  "tip-curate",
  "first-upload",
  "upsell",
  "loading",
  "recommendation",
  "success",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [primaryStyle, setPrimaryStyle] =
    React.useState<(typeof PRIMARY_STYLE_OPTIONS)[number]>("Neutral");
  const [size, setSize] = React.useState<(typeof SIZE_OPTIONS)[number]>("M");
  const [stylePreferences, setStylePreferences] = React.useState<string[]>([
    "Minimalist",
    "Streetwear",
  ]);
  const [profile, setProfile] = React.useState<OnboardingProfile | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [recommendations, setRecommendations] = React.useState<WardrobeItem[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [hydrating, setHydrating] = React.useState(true);
  const [magicPending, setMagicPending] = React.useState(false);

  const step = FLOW[stepIndex];

  const goNext = React.useCallback(() => {
    setStepIndex((index) => Math.min(index + 1, FLOW.length - 1));
  }, []);

  const goBack = React.useCallback(() => {
    setError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  const saveProfile = React.useCallback(
    async (overrides: Partial<OnboardingProfile> = {}) => {
      if (!user?.id) return null;

      const payload: OnboardingProfile = {
        userId: user.id,
        email: user.email || email || null,
        name: overrides.name ?? name ?? null,
        primaryStyle: overrides.primaryStyle ?? primaryStyle ?? null,
        size: overrides.size ?? size ?? null,
        stylePreferences: overrides.stylePreferences ?? stylePreferences,
        onboardingCompleted:
          overrides.onboardingCompleted ?? profile?.onboardingCompleted ?? false,
        uploadedFirstItem:
          overrides.uploadedFirstItem ?? profile?.uploadedFirstItem ?? false,
      };

      const result = await apiFetch("/onboarding", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setProfile(result.profile || payload);
      return result.profile || payload;
    },
    [email, name, primaryStyle, profile?.onboardingCompleted, profile?.uploadedFirstItem, size, stylePreferences, user?.email, user?.id]
  );

  React.useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get("verified") === "1") {
      setMsg("Magic link verified. You are now signed in.");
    }
    if (search.get("auth_error")) {
      setError("Magic link is invalid or expired. Please request a new one.");
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    async function hydrate() {
      if (loading) return;

      if (!user) {
        if (active) {
          setHydrating(false);
          setStepIndex(0);
        }
        return;
      }

      try {
        const result = await apiFetch("/onboarding");
        if (!active) return;

        const nextProfile = (result.profile || null) as OnboardingProfile | null;
        setProfile(nextProfile);
        setEmail(user.email || "");
        setName(nextProfile?.name || "");
        setPrimaryStyle(
          (nextProfile?.primaryStyle as (typeof PRIMARY_STYLE_OPTIONS)[number]) ||
            "Neutral"
        );
        setSize((nextProfile?.size as (typeof SIZE_OPTIONS)[number]) || "M");
        setStylePreferences(nextProfile?.stylePreferences || ["Minimalist", "Streetwear"]);

        if (nextProfile?.onboardingCompleted) {
          router.replace("/");
          return;
        }

        if (!nextProfile?.name || !nextProfile?.size || !nextProfile?.primaryStyle) {
          setStepIndex(FLOW.indexOf("about"));
        } else if (!nextProfile?.stylePreferences?.length) {
          setStepIndex(FLOW.indexOf("style-quiz"));
        } else if (!nextProfile?.uploadedFirstItem) {
          setStepIndex(FLOW.indexOf("first-upload"));
        } else {
          setStepIndex(FLOW.indexOf("recommendation"));
        }
      } catch (err) {
        if (!active) return;
        console.error("Hydration failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load your profile. Please try again.");
      } finally {
        if (active) {
          setHydrating(false);
        }
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [loading, router, user]);

  React.useEffect(() => {
    if (step !== "loading" || !user?.id) return;

    let active = true;
    const userId = user.id;

    async function loadRecommendations() {
      setBusy(true);
      try {
        const result = await apiFetch("/recommend", {
          method: "POST",
          body: JSON.stringify({
            occasion: "casual",
            prompt: `Style preferences: ${stylePreferences.join(", ")}`,
          }),
        });
        if (!active) return;
        setRecommendations(result.items || []);
        goNext();
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not generate recommendations.");
      } finally {
        if (active) {
          setBusy(false);
        }
      }
    }

    void loadRecommendations();
    return () => {
      active = false;
    };
  }, [goNext, step, stylePreferences, user?.id]);

  async function handleAuthSubmit() {
    setBusy(true);
    setError(null);
    setMsg(null);

    try {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        throw new Error("Supabase client is not configured.");
      }

      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth/callback`;

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
          data: {
            name: name || undefined,
          },
        },
      });
      if (authError) throw authError;

      setMagicPending(true);
      setMsg("Magic link sent. Check your email to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAboutNext() {
    if (!name.trim()) {
      setError("Please add your name to continue.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await saveProfile({
        name: name.trim(),
        primaryStyle,
        size,
      });
      goNext();
    } finally {
      setBusy(false);
    }
  }

  async function handleStyleQuizNext() {
    if (stylePreferences.length < 2) {
      setError("Choose at least two styles to personalize your wardrobe.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await saveProfile({ stylePreferences });
      goNext();
    } finally {
      setBusy(false);
    }
  }

  async function handleUploadNext(skip = false) {
    if (!user?.id) {
      setError("You need an account before uploading.");
      return;
    }

    if (skip) {
      await saveProfile({ uploadedFirstItem: false });
      goNext();
      return;
    }

    if (!selectedFile || !previewUrl) {
      setError("Choose an image to continue.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await apiUpload(selectedFile, selectedFile.name);

      await saveProfile({ uploadedFirstItem: true });
      goNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function finishOnboarding() {
    setBusy(true);
    try {
      await saveProfile({
        onboardingCompleted: true,
        uploadedFirstItem: profile?.uploadedFirstItem ?? Boolean(selectedFile),
      });
      router.replace("/");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
          <p className="mt-4 text-sm text-black">Preparing your onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout stepKey={step}>
      <div className="space-y-6">
        <Progress current={stepIndex + 1} total={FLOW.length} />
        {msg && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {msg}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === "welcome" && (
          <div className="space-y-6">
            <Heading
              title="Build a wardrobe assistant that actually knows your style."
              body="Upload your pieces, shape your style profile, and get outfit ideas in a few guided steps."
            />
            <button type="button" onClick={goNext} className={primaryButton}>
              Start onboarding
            </button>
          </div>
        )}

        {step === "signup" && (
          <div className="space-y-5">
            <Heading
              title="Sign in with magic link"
              body="Enter your email and we will send a secure one-time sign in link."
            />

            <div className="space-y-3">
              <Field label="Name (optional)">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </Field>
            </div>

            {magicPending && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Waiting for verification. Open the email link, then return here.
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleAuthSubmit()}
                className={primaryButton}
                disabled={busy}
              >
                {busy ? "Sending..." : "Send magic link"}
              </button>
            </div>
          </div>
        )}

        {step === "about" && (
          <div className="space-y-5">
            <Heading
              title="About you"
              body="We'll use this to tailor recommendations and organize your closet."
            />

            <Field label="Your name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </Field>

            <Field label="Primary style">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PRIMARY_STYLE_OPTIONS.map((option) => (
                  <SelectableChip
                    key={option}
                    active={primaryStyle === option}
                    onClick={() => setPrimaryStyle(option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </Field>

            <Field label="Standard size">
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((option) => (
                  <SelectableChip
                    key={option}
                    active={size === option}
                    onClick={() => setSize(option)}
                  >
                    {option}
                  </SelectableChip>
                ))}
              </div>
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleAboutNext()}
                className={primaryButton}
                disabled={busy}
              >
                {busy ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "style-quiz" && (
          <div className="space-y-5">
            <Heading
              title="Style quiz"
              body="Choose at least two styles that feel most like you."
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {STYLE_OPTIONS.map((option) => {
                const active = stylePreferences.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setStylePreferences((current) =>
                        current.includes(option)
                          ? current.filter((item) => item !== option)
                          : [...current, option]
                      )
                    }
                    className={[
                      "rounded-3xl border p-4 text-left text-sm font-medium transition",
                      active
                        ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10  shadow-md"
                        : "border-border bg-white  hover:border-primary/40",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleStyleQuizNext()}
                className={primaryButton}
                disabled={busy}
              >
                {busy ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step.startsWith("tip-") && (
          <div className="space-y-5">
            <Heading
              title={
                step === "tip-photo"
                  ? "Use clear outfit photos"
                  : step === "tip-tagging"
                  ? "Mura tags your pieces"
                  : "Curate better recommendations"
              }
              body={
                step === "tip-photo"
                  ? "Well-lit photos help the classifier spot clothing categories and colors more accurately."
                  : step === "tip-tagging"
                  ? "Every upload becomes a searchable item in your closet, ready for recommendations."
                  : "The more you add, the sharper the AI stylist becomes."
              }
            />

            <div className="rounded-[2rem] border border-border bg-white p-6 text-sm text-black shadow-sm">
              {step === "tip-photo" &&
                "Try a flat lay or hanger photo with the item centered in frame."}
              {step === "tip-tagging" &&
                "Mura combines filename hints, image classification, and color extraction before saving."}
              {step === "tip-curate" &&
                "You can start small with one item now and keep building from the dashboard later."}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button type="button" onClick={goNext} className={primaryButton}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "first-upload" && (
          <div className="space-y-5">
            <Heading
              title="Upload your first piece"
              body="Add one top, jacket, or favorite staple so the stylist has something real to work with."
            />

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-white px-6 py-10 text-center shadow-sm transition hover:border-primary/40">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setSelectedFile(file);
                  setPreviewUrl(file ? URL.createObjectURL(file) : null);
                }}
              />
              {!previewUrl ? (
                <>
                  <div className="text-4xl">+</div>
                  <p className="mt-3 text-base font-medium ">Tap to choose a photo</p>
                  <p className="mt-1 text-sm text-black">JPEG or PNG up to 10MB</p>
                </>
              ) : (
                <img
                  src={previewUrl}
                  alt="Selected clothing item"
                  className="max-h-80 w-full rounded-3xl object-contain"
                />
              )}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleUploadNext(true)}
                className={secondaryButton}
                disabled={busy}
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => void handleUploadNext(false)}
                className={primaryButton}
                disabled={busy}
              >
                {busy ? "Uploading..." : "Save item"}
              </button>
            </div>
          </div>
        )}

        {step === "upsell" && (
          <div className="space-y-5">
            <Heading
              title="You’re almost there"
              body="Your wardrobe foundation is ready. Next, Mura will generate your first tailored suggestion."
            />

            <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
              <p className="text-sm text-black">
                You can keep refining your closet later with more uploads, more styles, and better recommendations.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button type="button" onClick={goNext} className={primaryButton}>
                Generate my first look
              </button>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="space-y-5 text-center">
            <Heading
              title="Building your style profile"
              body="Mura is looking through your saved preferences and wardrobe pieces."
            />
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-border border-t-primary" />
            <p className="text-sm text-black">
              {busy ? "Generating recommendations..." : "Almost ready..."}
            </p>
          </div>
        )}

        {step === "recommendation" && (
          <div className="space-y-5">
            <Heading
              title="Your first recommendation"
              body="Here’s a first pass based on the style profile you just created."
            />

            {recommendations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((item) => {
                  const src = item.processedPath || item.originalPath;
                  const imageUrl = src.startsWith("http") ? src : `${SERVER_URL}${src}`;
                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-[color:var(--background)]">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold ">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black">
                              {item.category}
                            </p>
                          </div>
                          <span
                            className="mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-white shadow"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-border bg-white px-6 py-10 text-center">
                <p className="text-sm font-medium ">No pieces yet.</p>
                <p className="mt-1 text-sm text-black">
                  You can finish onboarding now and start adding items from the dashboard.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button type="button" onClick={goNext} className={primaryButton}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-5">
            <Heading
              title="Your wardrobe is ready"
              body="You’ve finished setup. From here on out, the dashboard becomes your daily home."
            />

            <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
              <p className="text-sm text-black">
                You can upload more items, regenerate looks for different occasions, and grow your closet over time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goBack} className={secondaryButton}>
                Back
              </button>
              <button
                type="button"
                onClick={() => void finishOnboarding()}
                className={primaryButton}
                disabled={busy}
              >
                {busy ? "Finishing..." : "Go to dashboard"}
              </button>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black">
        <span>Step {current}</span>
        <span>{total} total</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Heading({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-black">{title}</h1>
      <p className="text-sm text-black">{body}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs uppercase tracking-[0.2em] text-black">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectableChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-3 text-sm font-medium transition",
        active
          ? "border-primary bg-gradient-to-r from-primary to-[color:var(--primary-hover)] text-black"
          : "border-border bg-white  hover:border-primary/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm  outline-none transition focus:border-primary text-black";
const primaryButton =
  "inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] px-5 py-3 text-sm font-medium text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 text-white";
const secondaryButton =
  "inline-flex w-full items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-medium  transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-70 text-black";
