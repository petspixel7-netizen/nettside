// DIRECTION ROUTER
// ---------------------------------------------------------------------------
// Replaces the old hash(name+color) picker. Chooses a direction from:
//   1. business category  → a ranked shortlist of directions that suit it
//   2. asset inventory     → image-led directions only win when images exist
//   3. a per-reel SEED     → so the same brand can be re-rolled into variants
//
// Returns the chosen direction id + a rationale (shown in the studio) + the
// seed used (so a generation is reproducible and "reroll" just bumps it).

import type { Brand } from "./directions/types";
import { ALL_DIRECTIONS, directionById } from "./directions";
import { hashString } from "./helpers";

export interface RouteResult {
  directionId: string;
  rationale: string;
  seed: number;
}

// Category → ordered preference of direction ids. Only ids that are actually
// implemented are kept at route time; the rest are aspirational and ignored
// until their module ships.
const CATEGORY_MAP: Record<string, string[]> = {
  hotel: ["cinematic", "editorial", "swiss"],
  restaurant: ["cinematic", "editorial", "swiss"],
  spa: ["cinematic", "editorial", "swiss"],
  wellness: ["cinematic", "editorial", "swiss"],
  travel: ["cinematic", "editorial", "swiss"],
  realestate: ["cinematic", "editorial", "swiss"],
  mining: ["cinematic", "editorial", "swiss"],
  industrial: ["cinematic", "swiss", "editorial"],
  architecture: ["editorial", "cinematic", "swiss"],
  interior: ["editorial", "cinematic", "swiss"],
  fashion: ["editorial", "cinematic", "swiss"],
  beauty: ["editorial", "cinematic", "swiss"],
  lifestyle: ["editorial", "cinematic", "swiss"],
  food: ["cinematic", "editorial", "swiss"],
  saas: ["swiss", "cinematic", "editorial"],
  it: ["swiss", "cinematic", "editorial"],
  finance: ["swiss", "editorial", "cinematic"],
  b2b: ["swiss", "editorial", "cinematic"],
  consulting: ["swiss", "editorial", "cinematic"],
  agency: ["editorial", "swiss", "cinematic"],
  default: ["swiss", "cinematic", "editorial"],
};

function normCategory(c?: string): string {
  const s = (c || "").toLowerCase();
  for (const key of Object.keys(CATEGORY_MAP)) {
    if (s.includes(key)) return key;
  }
  // a few synonyms
  if (/hotell|overnatting|resort/.test(s)) return "hotel";
  if (/restaurant|spis|cafe|kafe|bar|mat/.test(s)) return "restaurant";
  if (/eiendom|bolig|megler/.test(s)) return "realestate";
  if (/klinikk|helse|tannlege/.test(s)) return "wellness";
  if (/teknolog|software|programvare|app|devtool/.test(s)) return "saas";
  if (/regnskap|bank|forsikring|\bfinans/.test(s)) return "finance";
  return "default";
}

export function routeDirection(
  brand: Brand,
  opts?: { seed?: number; forceDirectionId?: string },
): RouteResult {
  const baseSeed =
    opts?.seed ??
    hashString((brand.siteName || brand.title || "brand") + "|" + (brand.colors?.[0] ?? ""));

  if (opts?.forceDirectionId && directionById(opts.forceDirectionId)) {
    return {
      directionId: opts.forceDirectionId,
      rationale: "Valgt manuelt i studio.",
      seed: baseSeed,
    };
  }

  const cat = normCategory(brand.category);
  // A logo alone is NOT enough for photo-led directions — they need real photos.
  const hasPhotos = (brand.images?.length ?? 0) > 0;
  const PHOTO_LED = new Set(["cinematic", "editorial"]);

  let shortlist = (CATEGORY_MAP[cat] || CATEGORY_MAP.default).filter((id) => directionById(id));
  if (!hasPhotos) {
    // drop photo-led directions entirely; they'd render empty placeholders
    const typeLed = shortlist.filter((id) => !PHOTO_LED.has(id));
    shortlist = typeLed.length ? typeLed : shortlist;
  }
  if (shortlist.length === 0) shortlist = ALL_DIRECTIONS.map((d) => d.id);

  // seed picks within the shortlist, weighted toward the top (best-fit) choice
  const r = baseSeed % 100;
  const idx = r < 60 ? 0 : r < 85 ? Math.min(1, shortlist.length - 1) : Math.min(2, shortlist.length - 1);
  const directionId = shortlist[idx];

  const dir = directionById(directionId)!;
  const rationale = `Kategori «${cat}» → ${dir.label}. ${
    hasPhotos ? "Brand har ekte foto, så bilde-ledet retning er i spill." : "Ingen foto funnet (kun logo/ingen) — velger typografi-ledet retning."
  } (seed ${baseSeed}).`;

  return { directionId, rationale, seed: baseSeed };
}
