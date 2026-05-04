import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { recommendOutfit, WardrobeItem } from "../../../lib/recommend";
import OpenAI from "openai";
import { getSupabaseServer } from "../../../lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { occasion, prompt } = (await request.json()) as {
    occasion: "work" | "casual" | "travel";
    prompt?: string | null;
  };

  let items: WardrobeItem[] = [];
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
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    type DbItem = {
      id: string;
      name: string;
      category: WardrobeItem["category"];
      color_hex: string;
      original_url: string;
      processed_url: string;
      label?: string | null;
      confidence?: number | null;
    };
    const q = await supabase
      .from("items")
      .select(
        "id,name,category,color_hex,original_url,processed_url,label,confidence"
      )
      .eq("user_id", userId);
    const data = q.data as DbItem[] | null;
    const error = q.error;
    if (error) {
      const q2 = await supabase
        .from("items")
        .select("id,name,category,color_hex,original_url,processed_url")
        .eq("user_id", userId);
      const data2 = q2.data as DbItem[] | null;
      const error2 = q2.error;
      if (!error2) {
        items = (data2 || []).map((i) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          colorHex: i.color_hex,
          originalPath: i.original_url,
          processedPath: i.processed_url,
        }));
      }
    }
    if (!error && data) {
      items = data.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        colorHex: i.color_hex,
        originalPath: i.original_url,
        processedPath: i.processed_url,
      }));
    }
  } else {
    const dbFile = path.join(process.cwd(), "data", "items.json");
    if (fs.existsSync(dbFile)) {
      try {
        items = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
      } catch {}
    }
    if (!userId) {
      return NextResponse.json({ items: [] });
    }
    items = (items || []).filter(
      (i) => (i as { user_id?: string }).user_id === userId
    );
  }

  const apiKey = process.env.OPENAI_API_KEY || "";
  if (apiKey && items.length > 0) {
    try {
      const openai = new OpenAI({ apiKey });
      const sys =
        "You are a wardrobe stylist. If a user prompt is provided, tailor the outfit to that prompt while ensuring pieces coordinate by color and category. Prefer neutral colors for work, comfortable for travel, and expressive for casual. Return JSON with an `ids` array of item ids.";
      const user = JSON.stringify({
        occasion,
        prompt: prompt || undefined,
        items,
      });
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      });
      const content = resp.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      const ids: string[] = Array.isArray(parsed?.ids) ? parsed.ids : [];
      if (ids.length) {
        const byId = new Map(items.map((i) => [i.id, i]));
        const rec = ids
          .map((id) => byId.get(id))
          .filter(Boolean) as WardrobeItem[];
        if (rec.length) return NextResponse.json({ items: rec });
      }
    } catch {}
  }

  const rec = recommendOutfit(items, occasion);
  return NextResponse.json({ items: rec });
}
