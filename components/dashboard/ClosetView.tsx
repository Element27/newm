"use client";

import React from "react";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { OutfitCard } from "./OutfitCard";
import type { WardrobeCategory, WardrobeItem } from "@/lib/wardrobe";

const filterOptions: Array<{ label: string; value: WardrobeCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Tops", value: "top" },
  { label: "Bottoms", value: "bottom" },
  { label: "Outerwear", value: "outer" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessories", value: "accessory" },
];

const suggestionFrames = [
  { eyebrow: "Casual Friday", title: "Easy Linen Look" },
  { eyebrow: "Weekend", title: "Soft Sunday" },
  { eyebrow: "Evening", title: "Warm Dusk Out" },
];

function buildSuggestionGroups(items: WardrobeItem[], recommendations: WardrobeItem[]) {
  const source = recommendations.length > 0 ? recommendations : items;
  const unique = source.filter(
    (item, index) => source.findIndex((candidate) => candidate.id === item.id) === index
  );

  return suggestionFrames.map((frame, index) => {
    const start = index * 3;
    let group = unique.slice(start, start + 3);

    if (group.length === 0) {
      group = items.slice(0, 3);
    } else if (group.length < 3) {
      const filler = items.filter((item) => !group.some((entry) => entry.id === item.id));
      group = [...group, ...filler.slice(0, 3 - group.length)];
    }

    return {
      ...frame,
      items: group,
    };
  });
}

export function ClosetView({
  items,
  filter,
  onFilterChange,
  getImageUrl,
  onPreview,
  onDelete,
  recommendations,
  dailySuggestion,
  onOpenStylist,
  onAddPiece,
}: {
  items: WardrobeItem[];
  filter: WardrobeCategory | "all";
  onFilterChange: (filter: WardrobeCategory | "all") => void;
  getImageUrl: (item: WardrobeItem) => string;
  onPreview: (item: WardrobeItem) => void;
  onDelete: (item: WardrobeItem) => void;
  recommendations: WardrobeItem[];
  dailySuggestion: { message: string; weather: { city: string; temp: number; condition: string } | null } | null;
  onOpenStylist: () => void;
  onAddPiece: () => void;
}) {
  const filtered =
    filter === "all" ? items : items.filter((item) => item.category === filter);
  const categoriesCount = new Set(items.map((item) => item.category)).size;
  const displayedPieces = filtered;
  const suggestionGroups = buildSuggestionGroups(filtered, recommendations);

  return (
    <section className="space-y-10 pb-28 md:space-y-12">
      <div className="space-y-3">
        <p className="mura-label">Digital wardrobe</p>
        <h1 className="mura-display text-[3.6rem] leading-[0.92] text-foreground md:text-[4.8rem]">
          My Closet
        </h1>
        <p className="text-[1.25rem] text-[color:var(--muted)]">
          {items.length} item{items.length === 1 ? "" : "s"} across {categoriesCount || 0} categor{categoriesCount === 1 ? "y" : "ies"}
        </p>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-[color:var(--primary)] px-6 py-6 text-[#f4e5cb] shadow-[0_28px_60px_rgba(43,29,19,0.14)] md:px-10 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-3 h-4 w-4 shrink-0 rounded-full bg-[color:var(--accent)]" />
            <div className="space-y-1">
              <p className="mura-label !text-[color:#9d8465]">Stylist AI</p>
              {dailySuggestion?.weather && (
                <p className="text-xs uppercase tracking-[0.18em] text-[color:#9d8465]">
                  {dailySuggestion.weather.temp}°C · {dailySuggestion.weather.city}
                </p>
              )}
              <p className="text-xl leading-tight text-[#f7f0e6] md:text-[1.45rem]">
                {dailySuggestion?.message || "Loading suggestion..."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenStylist}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[color:#7f6748] px-6 py-3 text-lg text-[color:#d9b57a] transition hover:border-[color:#b8945e] hover:text-[#f0cf95] md:self-center"
          >
            See outfit
            <FiArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {filterOptions.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onFilterChange(option.value)}
              className={[
                "shrink-0 rounded-full px-7 py-3 text-[1.05rem] transition",
                active ? "mura-chip-active" : "mura-chip",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        <p className="mura-label">All pieces</p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {displayedPieces.map((item) => (
            <OutfitCard
              key={item.id}
              item={item}
              imageUrl={getImageUrl(item)}
              onPreview={onPreview}
              onDelete={onDelete}
              showActions
              aspectRatio="3/4"
            />
          ))}

          <button
            type="button"
            onClick={onAddPiece}
            className="flex min-h-[25rem] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[color:var(--border)] bg-[rgba(255,250,244,0.5)] text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--primary)]"
          >
            <FiPlus className="h-14 w-14" />
            <span className="mt-3 text-[1.05rem]">Add piece</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <p className="mura-label">Outfit suggestions</p>
        <div className="grid gap-5 xl:grid-cols-3">
          {suggestionGroups.map((group) => (
            <article
              key={group.eyebrow}
              className="mura-panel rounded-[2rem] bg-[rgba(247,241,232,0.72)] px-7 py-7"
            >
              <p className="mura-label">{group.eyebrow}</p>
              <h3 className="mura-display mt-3 text-[2.25rem] leading-none text-foreground">
                {group.title}
              </h3>

              <div className="mt-6 flex gap-3">
                {group.items.map((item) => (
                  <button
                    key={`${group.eyebrow}-${item.id}`}
                    type="button"
                    onClick={() => onPreview(item)}
                    className="h-18 w-18 overflow-hidden rounded-[1.1rem] bg-[rgba(216,198,166,0.7)] p-2 transition hover:scale-[1.02]"
                    aria-label={`Preview ${item.name}`}
                  >
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="h-full w-full rounded-[0.9rem] object-cover"
                    />
                  </button>
                ))}
              </div>

              <p className="mt-5 flex items-center gap-2 text-[1.05rem] text-[color:var(--muted)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                AI styled
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
