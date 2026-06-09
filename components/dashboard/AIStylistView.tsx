"use client";

import React from "react";
import { FiRefreshCw, FiZap } from "react-icons/fi";
import type { WardrobeItem } from "@/lib/wardrobe";
import { OutfitCard } from "./OutfitCard";

const SUGGESTION_PILLS = [
  { id: "date-night", label: "✨ Date night", prompt: "A stylish and confident outfit for a date night in the city." },
  { id: "movie-night", label: "🍿 Movie night", prompt: "A cozy, comfortable, and relaxed outfit for a movie night." },
  { id: "casual-hangout", label: "☕ Casual hangout", prompt: "An effortless and relaxed outfit for grabbing coffee with friends." },
  { id: "office", label: "🏢 Office", prompt: "A polished, professional, yet comfortable outfit for the office." },
];

export function AIStylistView({
  prompt,
  onPromptChange,
  onGenerate,
  recommendations,
  loading,
  getImageUrl,
}: {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  recommendations: WardrobeItem[];
  loading: boolean;
  getImageUrl: (item: WardrobeItem) => string;
}) {
  return (
    <section className="space-y-6 pb-28">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Outfit engine
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          AI Stylist
        </h1>
        <p className="max-w-xl text-sm text-[color:var(--muted)]">
          Turn your wardrobe into ready-made looks tailored to the day ahead.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Where are you heading today? Describe your ideal outfit..."
          className="w-full resize-none rounded-3xl border border-border bg-white p-5 text-base text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
        />
        
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SUGGESTION_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => onPromptChange(pill.prompt)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <FiRefreshCw className="h-4 w-4 animate-spin" /> : <FiZap className="h-4 w-4" />}
          {loading ? "Generating..." : "Generate outfit"}
        </button>

        {recommendations.length > 0 && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh suggestions
          </button>
        )}
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-3xl border border-border bg-white p-4">
              <div className="animate-shimmer h-56 rounded-2xl bg-white/70" />
            </div>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiZap className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No recommendation yet.</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Pick an occasion and let Mura style from your saved pieces.
          </p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((item) => (
            <OutfitCard
              key={item.id}
              item={item}
              imageUrl={getImageUrl(item)}
              aspectRatio="4/5"
            />
          ))}
        </div>
      )}
    </section>
  );
}
