export type WardrobeCategory =
  | "top"
  | "bottom"
  | "shoes"
  | "outer"
  | "dress"
  | "accessory";

export type Occasion = "work" | "casual" | "travel";

export type WardrobeItem = {
  id: string;
  name: string;
  category: WardrobeCategory;
  colorHex: string;
  originalPath: string;
  processedPath: string;
  label?: string | null;
  confidence?: number | null;
};

export type OnboardingProfile = {
  userId: string;
  email?: string | null;
  name?: string | null;
  primaryStyle?: string | null;
  size?: string | null;
  stylePreferences?: string[];
  onboardingCompleted?: boolean;
  uploadedFirstItem?: boolean;
};

export type WeeklyPlanDay = {
  date: string;
  occasion: Occasion;
  itemIds: string[];
  notes?: string;
  locked?: boolean;
};

export type WeeklyPlan = {
  userId: string;
  weekStart: string;
  days: WeeklyPlanDay[];
  generatedAt: string;
  updatedAt: string;
};

export const STYLE_OPTIONS = [
  "Minimalist",
  "Streetwear",
  "Classic",
  "Athleisure",
  "Vintage",
  "Preppy",
  "Bohemian",
  "Grunge",
] as const;

export const PRIMARY_STYLE_OPTIONS = ["Masculine", "Feminine", "Neutral"] as const;
export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;
