import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getSupabaseServer } from "../../../lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = getSupabaseServer();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  let userId: string | null = null;
  if (supabaseUrl && supabaseAnon) {
    try {
      const authClient = createRouteHandlerClient(
        { cookies },
        { supabaseUrl, supabaseKey: supabaseAnon }
      );
      const { data: userData } = await authClient.auth.getUser();
      userId = userData.user?.id ?? null;
    } catch {}
  }

  if (!userId) {
    try {
      const url = new URL(request.url);
      const qp = url.searchParams.get("userId");
      if (qp) userId = qp;
    } catch {}
  }

  if (supabase) {
    console.log("supabase", userId);

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    type DbItem = {
      id: string;
      name: string;
      category: "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory";
      color_hex: string;
      original_url: string;
      processed_url: string;
      label?: string | null;
      confidence?: number | null;
    };
    const q = await supabase
      .from("items")
      .select("id,name,category,color_hex,original_url,processed_url,label,confidence")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    let data = q.data as DbItem[] | null; let error = q.error;
    if (error) {
      const q2 = await supabase
        .from("items")
        .select("id,name,category,color_hex,original_url,processed_url")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      data = q2.data as DbItem[] | null; error = q2.error;
    }
    if (error)
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    const items = (data || []).map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      colorHex: i.color_hex,
      originalPath: i.original_url,
      processedPath: i.processed_url,
      label: i.label ?? null,
      confidence: i.confidence ?? null,
    }));
    return NextResponse.json({ items });
  } else {
    console.log("no supabase");
  }

  const dbFile = path.join(process.cwd(), "data", "items.json");
  type LocalItem = {
    id: string;
    name: string;
    category: "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory";
    colorHex: string;
    originalPath: string;
    processedPath: string;
    user_id?: string | null;
    label?: string | null;
    confidence?: number | null;
  };
  let items: LocalItem[] = [];
  if (fs.existsSync(dbFile)) {
    try {
      items = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    } catch {}
  }
  if (!userId) {
    return NextResponse.json({ items: [] });
  }
  const filtered = items.filter((i) => i?.user_id === userId);
  return NextResponse.json({ items: filtered });
}
