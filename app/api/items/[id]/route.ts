import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { getSupabaseServer, STORAGE_BUCKET } from "../../../../lib/supabase";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseServer();
  

  if (supabase) {
    let key: string | null = null;
    try {
      const { data } = await supabase
        .from("items")
        .select("processed_url")
        .eq("id", id)
        .single();
      const url = (data as { processed_url?: string } | null)?.processed_url;
      if (url) {
        const idx = url.indexOf(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
        if (idx >= 0) {
          key = url.substring(idx + (`/storage/v1/object/public/${STORAGE_BUCKET}/`).length);
        }
      }
    } catch {}
    if (key) {
      await supabase.storage.from(STORAGE_BUCKET).remove([key]);
    }
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const dbFile = path.join(process.cwd(), "data", "items.json");
  type LocalItem = {
    id: string;
    name: string;
    category: "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory";
    colorHex?: string;
    originalPath?: string;
    processedPath?: string;
    processed_url?: string;
    user_id?: string | null;
    label?: string | null;
    confidence?: number | null;
  };
  let items: LocalItem[] = [];
  if (fs.existsSync(dbFile)) {
    try {
      items = JSON.parse(fs.readFileSync(dbFile, "utf-8")) as LocalItem[];
    } catch {}
  }
  try {
    const it = items.find((i) => i.id === id);
    const p = it?.processedPath || it?.processed_url;
    if (p) {
      const local = path.join(process.cwd(), "public", p.replace(/^\//, ""));
      if (fs.existsSync(local)) fs.unlinkSync(local);
    } else {
      const tryPng = path.join(process.cwd(), "public", "processed", `${id}.png`);
      const tryWebp = path.join(process.cwd(), "public", "processed", `${id}.webp`);
      const tryJpg = path.join(process.cwd(), "public", "processed", `${id}.jpg`);
      [tryPng, tryWebp, tryJpg].forEach((f) => {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
      });
    }
  } catch {}
  items = (items || []).filter((i) => i.id !== id);
  fs.writeFileSync(dbFile, JSON.stringify(items, null, 2));
  return NextResponse.json({ ok: true });
}
