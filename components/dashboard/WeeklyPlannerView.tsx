"use client";

import React from "react";
import type { WardrobeItem, WeeklyPlan, WeeklyPlanDay, Occasion } from "@/lib/wardrobe";

const occasionOptions: Occasion[] = ["work", "casual", "travel"];
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatISODateLabel(dateISO: string) {
  const [yearRaw, monthRaw, dayRaw] = dateISO.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!year || !month || !day) return dateISO;

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const weekday = weekdayLabels[utcDate.getUTCDay()] || "";
  const monthLabel = monthLabels[month - 1] || "";
  return `${weekday}, ${monthLabel} ${day}`;
}

export function WeeklyPlannerView({
  plan,
  items,
  getImageUrl,
  generating,
  regeneratingDate,
  updatingDate,
  onGenerateWeek,
  onRegenerateDay,
  onUpdateDay,
}: {
  plan: WeeklyPlan | null;
  items: WardrobeItem[];
  getImageUrl: (item: WardrobeItem) => string;
  generating: boolean;
  regeneratingDate: string | null;
  updatingDate: string | null;
  onGenerateWeek: () => Promise<void>;
  onRegenerateDay: (date: string) => Promise<void>;
  onUpdateDay: (date: string, patch: Partial<WeeklyPlanDay>) => Promise<void>;
}) {
  const byId = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  return (
    <section className="space-y-6 pb-28">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Weekly automation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Outfit Planner</h1>
        <p className="max-w-2xl text-sm text-[color:var(--muted)]">
          Plans are auto-built every Saturday for the coming week. You can regenerate and adjust each day whenever you want.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onGenerateWeek()}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {generating ? "Generating..." : "Generate Week Plan"}
        </button>
        {plan?.weekStart && (
          <span className="rounded-full border border-border bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Week of {plan.weekStart}
          </span>
        )}
      </div>

      {!plan && (
        <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">No weekly plan yet.</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Click Generate Week Plan to create your upcoming outfit schedule.
          </p>
        </div>
      )}

      {plan && (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.days.map((day) => (
            <PlannerDayCard
              key={day.date}
              day={day}
              byId={byId}
              getImageUrl={getImageUrl}
              isRegenerating={regeneratingDate === day.date}
              isUpdating={updatingDate === day.date}
              onRegenerate={onRegenerateDay}
              onSave={onUpdateDay}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PlannerDayCard({
  day,
  byId,
  getImageUrl,
  isRegenerating,
  isUpdating,
  onRegenerate,
  onSave,
}: {
  day: WeeklyPlanDay;
  byId: Map<string, WardrobeItem>;
  getImageUrl: (item: WardrobeItem) => string;
  isRegenerating: boolean;
  isUpdating: boolean;
  onRegenerate: (date: string) => Promise<void>;
  onSave: (date: string, patch: Partial<WeeklyPlanDay>) => Promise<void>;
}) {
  const [occasion, setOccasion] = React.useState<Occasion>(day.occasion);
  const [notes, setNotes] = React.useState(day.notes || "");
  const [itemIdsText, setItemIdsText] = React.useState(day.itemIds.join(", "));

  React.useEffect(() => {
    setOccasion(day.occasion);
    setNotes(day.notes || "");
    setItemIdsText(day.itemIds.join(", "));
  }, [day.date, day.itemIds, day.notes, day.occasion]);

  const resolvedItems = day.itemIds.map((id) => byId.get(id)).filter(Boolean) as WardrobeItem[];

  return (
    <article className="space-y-4 rounded-3xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{formatISODateLabel(day.date)}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{day.date}</p>
        </div>
        <button
          type="button"
          onClick={() => void onRegenerate(day.date)}
          disabled={isRegenerating}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary/40 disabled:opacity-60"
        >
          {isRegenerating ? "Regenerating..." : "Regenerate Day"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {resolvedItems.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-[color:var(--muted)]">
            No items assigned.
          </div>
        )}
        {resolvedItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-[color:var(--background)]">
            <div className="aspect-square overflow-hidden">
              <img src={getImageUrl(item)} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Occasion</span>
          <select
            value={occasion}
            onChange={(event) => setOccasion(event.target.value as Occasion)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          >
            {occasionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Item IDs (comma-separated)
          </span>
          <input
            value={itemIdsText}
            onChange={(event) => setItemIdsText(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="id1, id2, id3"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            placeholder="Any adjustment note for this day..."
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() =>
          void onSave(day.date, {
            occasion,
            notes,
            itemIds: itemIdsText
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          })
        }
        disabled={isUpdating}
        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-70"
      >
        {isUpdating ? "Saving..." : "Save adjustments"}
      </button>
    </article>
  );
}
