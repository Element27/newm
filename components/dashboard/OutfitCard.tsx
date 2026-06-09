"use client";

import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import type { WardrobeItem } from "@/lib/wardrobe";

interface OutfitCardProps {
  item: WardrobeItem;
  imageUrl: string;
  onPreview?: (item: WardrobeItem) => void;
  onDelete?: (item: WardrobeItem) => void;
  showActions?: boolean;
  aspectRatio?: "4/5" | "3/4" | "square";
}

export function OutfitCard({
  item,
  imageUrl,
  onPreview,
  onDelete,
  showActions = false,
  aspectRatio = "4/5",
}: OutfitCardProps) {
  const aspectClasses = {
    "4/5": "aspect-[4/5]",
    "3/4": "aspect-[3/4]",
    square: "aspect-square",
  };

  return (
    <div className="group relative">
      {showActions && (
        <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-100">
          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="rounded-full bg-white/90 p-2 text-[color:var(--primary)] shadow-sm transition hover:scale-105"
              aria-label={`Preview ${item.name}`}
            >
              <FiEye className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-full bg-white/90 p-2 text-[color:var(--destructive)] shadow-sm transition hover:scale-105"
              aria-label={`Delete ${item.name}`}
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <article
        className={[
          "overflow-hidden rounded-3xl border border-border bg-white shadow-sm",
          showActions && "transition hover:-translate-y-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          onClick={() => onPreview?.(item)}
          className="block w-full"
          disabled={!onPreview}
        >
          <div className={`${aspectClasses[aspectRatio]} overflow-hidden bg-[color:var(--background)]`}>
            <img
              src={imageUrl}
              alt={item.label ?? item.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.label
                  ? item.label.charAt(0).toUpperCase() + item.label.slice(1)
                  : item.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
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
    </div>
  );
}