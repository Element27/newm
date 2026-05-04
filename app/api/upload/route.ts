import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File | null;
  const name = (form.get("name") as string) || "item";
  if (!file)
    return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const id = randomUUID();
  const ext = path.extname(name) || ".png";
  const filename = `${id}${ext}`;

  // Always save original locally. We no longer store originals in Supabase.
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);
  const originalPath = `/uploads/${filename}`;

  return NextResponse.json({ ok: true, id, originalPath });
}

export async function DELETE(request: Request) {
  try {
    let originalPath: string | null = null;
    try {
      const body = await request.json();
      originalPath = (body?.originalPath as string) || null;
    } catch {}
    if (!originalPath) {
      const url = new URL(request.url);
      originalPath = url.searchParams.get("path");
    }
    if (!originalPath || !originalPath.startsWith("/uploads/")) {
      return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }
    const localFile = path.join(process.cwd(), "public", originalPath.replace(/^\//, ""));
    if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
