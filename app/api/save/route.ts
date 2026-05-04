import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getSupabaseServer, STORAGE_BUCKET } from "../../../lib/supabase";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

type SavePayload = {
  id: string;
  name: string;
  category: "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory";
  colorHex: string;
  originalPath: string;
  userId?: string | null;
  label?: string | null;
  confidence?: number | null;
  processedDataUrl?: string | null;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SavePayload;
  const { id, name, category, colorHex, originalPath } = payload;
  const supabase = getSupabaseServer();
  // Obtain authenticated user id for attribution when available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  let userId: string | null = null;
  try {
    if (supabaseUrl && supabaseAnon) {
      const authClient = createRouteHandlerClient(
        { cookies },
        {
          supabaseUrl,
          supabaseKey: supabaseAnon,
        }
      );
      const { data } = await authClient.auth.getUser();
      userId = data.user?.id ?? null;
    }
  } catch {}
  if (!userId && payload.userId) {
    userId = payload.userId;
  }
  if (supabase) {
    const localFilePath = path.join(
      process.cwd(),
      "public",
      originalPath.replace(/^\//, "")
    );
    let buffer: Buffer | null = null;
    let ext = path.extname(localFilePath) || ".png";
    let contentType = "image/png";
    if (
      payload.processedDataUrl &&
      payload.processedDataUrl.startsWith("data:")
    ) {
      const [hdr, b64] = payload.processedDataUrl.split(",");
      const mt = hdr.substring(5, hdr.indexOf(";"));
      contentType = mt || "image/png";
      const guessedExt = mt.includes("jpeg")
        ? ".jpg"
        : mt.includes("webp")
        ? ".webp"
        : ".png";
      ext = guessedExt;
      buffer = Buffer.from(b64, "base64");
    } else if (fs.existsSync(localFilePath)) {
      buffer = fs.readFileSync(localFilePath);
      contentType =
        ext.toLowerCase() === ".jpg" || ext.toLowerCase() === ".jpeg"
          ? "image/jpeg"
          : ext.toLowerCase() === ".webp"
          ? "image/webp"
          : "image/png";
    }
    const key = `processed/${id}${ext}`;
    if (buffer) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(key, buffer, {
          contentType,
          upsert: true,
        });
      if (error)
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
    }
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
    const processedPath = data.publicUrl;

    let dbErr: { message: string } | null = null;
    const insertPayload = {
      id,
      name,
      category,
      color_hex: colorHex,
      original_url: originalPath,
      processed_url: processedPath,
      user_id: userId,
      label: payload.label ?? null,
      confidence: payload.confidence ?? null,
    };
    let ins = await supabase.from("items").insert(insertPayload);
    dbErr = ins.error;
    if (dbErr) {
      const minimal = {
        id,
        name,
        category,
        color_hex: colorHex,
        original_url: originalPath,
        processed_url: processedPath,
        user_id: userId,
      };
      ins = await supabase.from("items").insert(minimal);
      dbErr = ins.error;
    }
    if (dbErr)
      return NextResponse.json(
        { ok: false, error: dbErr.message },
        { status: 500 }
      );

    // Clean up local original upload since we uploaded to storage
    if (originalPath?.startsWith("/uploads/")) {
      try {
        const localFile = path.join(
          process.cwd(),
          "public",
          originalPath.replace(/^\//, "")
        );
        if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      item: {
        id,
        name,
        category,
        colorHex,
        originalPath,
        processedPath,
        user_id: userId,
        label: payload.label || null,
        confidence: payload.confidence ?? null,
      },
    });
  }

  const processedDir = path.join(process.cwd(), "public", "processed");
  if (!fs.existsSync(processedDir))
    fs.mkdirSync(processedDir, { recursive: true });
  const originalLocal = path.join(
    process.cwd(),
    "public",
    originalPath.replace(/^\//, "")
  );
  const processedFilePath = path.join(
    processedDir,
    `${id}${path.extname(originalLocal) || ".png"}`
  );
  try {
    if (
      payload.processedDataUrl &&
      payload.processedDataUrl.startsWith("data:")
    ) {
      const [, b64] = payload.processedDataUrl.split(",");
      const buf = Buffer.from(b64, "base64");
      fs.writeFileSync(processedFilePath, buf);
    } else if (fs.existsSync(originalLocal)) {
      fs.copyFileSync(originalLocal, processedFilePath);
    }
  } catch {}
  const processedPath = `/processed/${path.basename(processedFilePath)}`;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbFile = path.join(dataDir, "items.json");
  let items: Array<{
    id: string;
    name: string;
    category: "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory";
    colorHex: string;
    originalPath: string;
    processedPath: string;
    user_id: string | null;
    label: string | null;
    confidence: number | null;
  }> = [];
  if (fs.existsSync(dbFile)) {
    try {
      items = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    } catch {}
  }
  const newItem = {
    id,
    name,
    category,
    colorHex,
    originalPath,
    processedPath,
    user_id: userId,
    label: payload.label || null,
    confidence: payload.confidence ?? null,
  };
  items.push(newItem);
  fs.writeFileSync(dbFile, JSON.stringify(items, null, 2));

  // Clean up local original upload in the fallback path as well
  if (originalPath?.startsWith("/uploads/")) {
    try {
      const localFile = path.join(
        process.cwd(),
        "public",
        originalPath.replace(/^\//, "")
      );
      if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    } catch {}
  }

  return NextResponse.json({ ok: true, item: newItem });
}
