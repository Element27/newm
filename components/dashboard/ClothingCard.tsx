"use client";

import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import type { WardrobeItem } from "@/lib/wardrobe";

const toneClasses = {
  sand: "bg-[#ddcfb8]",
  stone: "bg-[#cbc0ae]",
} as const;

export function ClothingCard({
  item,
  imageUrl,
  onPreview,
  onDelete,
  tone = "sand",
}: {
  item: WardrobeItem;
  imageUrl: string;
  onPreview?: (item: WardrobeItem) => void;
  onDelete?: (item: WardrobeItem) => void;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <article
      className={[
        "group relative min-h-[25rem] overflow-hidden rounded-[2rem] p-5 shadow-[0_18px_40px_rgba(57,39,22,0.08)] transition-all duration-300 hover:-translate-y-1",
        toneClasses[tone],
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex justify-end gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onPreview?.(item)}
            className="rounded-full bg-[rgba(255,248,239,0.92)] p-2 text-[color:var(--primary)] shadow-sm transition hover:scale-105"
            aria-label={`Preview ${item.name}`}
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(item)}
            className="rounded-full bg-[rgba(255,248,239,0.92)] p-2 text-[color:var(--destructive)] shadow-sm transition hover:scale-105"
            aria-label={`Delete ${item.name}`}
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onPreview?.(item)}
          className="mx-auto mt-4 flex h-[12rem] w-[12rem] items-center justify-center overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        <div className="rounded-[1.35rem] bg-[rgba(249,244,237,0.94)] p-4 shadow-[0_12px_24px_rgba(53,37,23,0.08)]">
          {/* <p className="truncate text-[1.05rem] text-foreground">{item.name}</p> */}
          <p className="truncate text-[1.05rem] text-foreground">{item.label && item.label.charAt(0).toUpperCase() + item.label.slice(1)}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[0.95rem] text-[color:var(--muted)]">
              {/* {item.category.charAt(0).toUpperCase() + item.category.slice(1)} */}
              {/* {item.label && item.label.charAt(0).toUpperCase() + item.label.slice(1)} */}
            </p>
            {/* <span
              className="inline-block h-4 w-4 shrink-0 rounded-full border border-white/90 shadow-sm"
              style={{ backgroundColor: item.colorHex }}
            /> */}
          </div>
        </div>
      </div>
    </article>
  );
}
