import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type ProcessRequest = {
  id: string;
  name: string;
  originalPath: string;
};

function inferCategoryFromName(
  name: string
): "top" | "bottom" | "shoes" | "outer" | "dress" | "accessory" | null {
  const lower = String(name || "").toLowerCase();
  if (/(shirt|tee|top|blouse|sweater|hoodie)/.test(lower)) return "top";
  if (/(jeans|pant|trouser|skirt|short)/.test(lower)) return "bottom";
  if (/(shoe|sneaker|boot|loafer|heel|sandal|flip\s?flop)/.test(lower))
    return "shoes";
  if (/(jacket|coat|cardigan|blazer)/.test(lower)) return "outer";
  if (/(dress)/.test(lower)) return "dress";
  if (/(hat|belt|bag|scarf|watch)/.test(lower)) return "accessory";
  return null;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProcessRequest;
    const { id, name, originalPath } = body;

    if (!id || !originalPath) {
      return NextResponse.json(
        { ok: false, error: "Missing id or originalPath" },
        { status: 400 }
      );
    }

    const localFilePath = path.join(
      process.cwd(),
      "public",
      originalPath.replace(/^\//, "")
    );

    if (!fs.existsSync(localFilePath)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Original file not found",
          needClientProcessing: true,
        },
        { status: 404 }
      );
    }

    // No transformation needed; we only verify existence and return metadata

    // No background removal – process images as uploaded
    const processedDataUrl: string | null = null;

    // Low-confidence label/category based on filename (optional defaults)
    const category = inferCategoryFromName(name);
    const label = String(name || "").split(".")[0];
    const confidence = category ? 0.5 : 0;

    // Always return metadata and indicate no client background removal is needed
    return NextResponse.json({
      ok: true,
      needClientProcessing: false,
      id,
      name,
      originalPath,
      processedDataUrl,
      label,
      category,
      confidence,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Processing error",
        needClientProcessing: true,
      },
      { status: 500 }
    );
  }
}
