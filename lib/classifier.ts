export type Category =
  | "top"
  | "bottom"
  | "shoes"
  | "outer"
  | "dress"
  | "accessory";

const LABEL_TO_CATEGORY: Record<string, Category> = {
  tshirt: "top",
  shirt: "top",
  blouse: "top",
  sweater: "top",
  hoodie: "top",
  jeans: "bottom",
  pants: "bottom",
  shorts: "bottom",
  skirt: "bottom",
  sneaker: "shoes",
  boot: "shoes",
  heel: "shoes",
  loafer: "shoes",
  shoe: "shoes",
  jacket: "outer",
  coat: "outer",
  cardigan: "outer",
  blazer: "outer",
  dress: "dress",
  hat: "accessory",
  belt: "accessory",
  bag: "accessory",
  scarf: "accessory",
  watch: "accessory",
};

function canonicalize(label: string): string {
  const raw = String(label || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  const alias: Record<string, string> = {
    tshirts: "tshirt",
    sweatshirt: "sweater",
    jumper: "sweater",
    pullover: "sweater",
    sneakers: "sneaker",
    boots: "boot",
    loafers: "loafer",
    heels: "heel",
    runningshoe: "sneaker",
    dressshoe: "shoe",
    flipflop: "shoe",
    sandal: "shoe",
    trousers: "pants",
    legging: "leggings",
  };
  return alias[raw] || raw;
}

function inferCategoryFromRaw(raw: string): Category | null {
  const s = String(raw || "").toLowerCase();
  if (/shirt|tee|blouse|sweater|hoodie|top/.test(s)) return "top";
  if (/jeans|pant|trouser|skirt|short/.test(s)) return "bottom";
  if (/shoe|sneaker|boot|loafer|heel|flip\s?flop|sandal/.test(s))
    return "shoes";
  if (/jacket|coat|cardigan|blazer/.test(s)) return "outer";
  if (/dress/.test(s)) return "dress";
  if (/hat|belt|bag|scarf|watch/.test(s)) return "accessory";
  return null;
}

export async function classifyImage(
  imgEl: HTMLImageElement
): Promise<{ label: string; category: Category | null; confidence: number }> {
  try {
    const mobilenetModule = (await import("@tensorflow-models/mobilenet")) as typeof import("@tensorflow-models/mobilenet");
    await import("@tensorflow/tfjs");
    const model = await mobilenetModule.load({ version: 2, alpha: 1.0 });
    const results = (await model.classify(imgEl, 3)) as Array<{ className: string; probability: number }>;
    const top = results?.[0] || { className: "", probability: 0 };
    const rawLabel = top.className || "";
    const label = canonicalize(rawLabel);
    const category = LABEL_TO_CATEGORY[label] || inferCategoryFromRaw(rawLabel);
    return { label, category, confidence: Number(top.probability || 0) };
  } catch {
    return { label: "unknown", category: null, confidence: 0 };
  }
}
