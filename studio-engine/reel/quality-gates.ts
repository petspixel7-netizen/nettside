// QUALITY GATES
// ---------------------------------------------------------------------------
// Runs on a storyboard + the final HTML before it ships. Unlike a pure reject
// gate (which can leave the user with nothing), this returns a structured
// report the caller can use to either (a) auto-repair via one more model pass
// or (b) warn. Hard errors should block FINAL FILM mode; warnings should not.

import type { Brand } from "./directions/types";

export interface SceneLike {
  title: string;
  body?: string;
  animation_style: string;
  image_url?: string | null;
}

export interface QualityReport {
  ok: boolean;
  errors: string[];     // block final film
  warnings: string[];   // surface, but allow
  varietyScore: number;        // 0..1 distinct layout families
  assetUseScore: number;       // 0..1 scenes using a real asset (when assets exist)
  brandSpecificityScore: number; // 0..1 scenes grounded in concrete facts
}

const FILLER = [
  "neste nivå", "neste niva", "din partner", "kvalitet i fokus", "opplev kvalitet",
  "vi leverer kvalitet", "skreddersydde løsninger", "skreddersydde losninger",
  "din totalleverandør", "vi bryr oss", "kvalitet du kan stole på",
];

function layoutFamily(arch: string): string {
  if (arch === "big-num" || arch === "signal") return "num";
  if (arch === "grid" || arch === "zones" || arch === "trust" || arch === "pipeline") return "list";
  if (arch === "cta") return "cta";
  if (arch === "logo") return "logo";
  return "title";
}

export function checkStoryboard(
  brand: Brand,
  scenes: SceneLike[],
  facts: string[] = [],
): QualityReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const n = scenes.length || 1;

  // 1. variety — no layout family more than twice; reward distinctness
  const fams = scenes.map((s) => layoutFamily(s.animation_style));
  const distinct = new Set(fams).size;
  const varietyScore = distinct / Math.min(n, 5);
  const counts: Record<string, number> = {};
  fams.forEach((f) => (counts[f] = (counts[f] || 0) + 1));
  for (const [fam, c] of Object.entries(counts)) {
    if (c > 2) errors.push(`Layout-familien «${fam}» brukes ${c} ganger (maks 2).`);
  }
  for (let i = 1; i < fams.length; i++) {
    if (fams[i] === fams[i - 1]) warnings.push(`Scene ${i} og ${i + 1} har samme layout (${fams[i]}).`);
  }

  // 2. asset use — when the brand has imagery, the film must use some
  // NOTE: storyboard rows often carry no image_url — composeReel auto-assigns
  // logo/hero/imagery at compose time. So at the storyboard stage this is only
  // a soft signal; the hard asset check runs on the final HTML (checkFilmHtml).
  const hasAssets = (brand.images?.length ?? 0) > 0 || !!brand.logo;
  const usedAssets = scenes.filter((s) => s.image_url).length;
  const assetUseScore = hasAssets ? Math.min(1, (usedAssets + 1) / Math.max(1, Math.ceil(n / 2))) : 1;

  // 3. brand specificity — copy must reference concrete facts, not filler
  let grounded = 0;
  scenes.forEach((s, i) => {
    const text = `${s.title} ${s.body ?? ""}`.toLowerCase();
    if (FILLER.some((f) => text.includes(f))) {
      errors.push(`Scene ${i + 1} bruker floskel: «${s.title}».`);
    }
    if (facts.length && facts.some((f) => text.includes(f.toLowerCase().slice(0, 12)))) grounded++;
    else if (/\d/.test(text)) grounded++; // a concrete number counts as grounding
  });
  const brandSpecificityScore = facts.length ? grounded / n : Math.min(1, grounded / n + 0.5);
  if (facts.length && grounded / n < 0.7) {
    warnings.push(`Bare ${Math.round((grounded / n) * 100)}% av scenene refererer konkrete fakta (mål 70%).`);
  }

  if (varietyScore < 0.6) warnings.push(`Lav variasjon (${varietyScore.toFixed(2)}) — scenene ligner for mye.`);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    varietyScore: +varietyScore.toFixed(2),
    assetUseScore: +assetUseScore.toFixed(2),
    brandSpecificityScore: +brandSpecificityScore.toFixed(2),
  };
}

// Final-film HTML gate: no editor chrome / play controls may leak into film
// mode, and real brand assets must actually appear when the brand has them.
export function checkFilmHtml(html: string, expectAsset = false): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (/id=["']start-gate["']/.test(html)) errors.push("Final film inneholder #start-gate.");
  if (/<button/i.test(html)) errors.push("Final film inneholder <button>.");
  if (!/data-render-mode=["']film["']/.test(html)) errors.push("Mangler data-render-mode=\"film\".");
  if (/overflow:\s*(auto|scroll)/i.test(html)) errors.push("Final film tillater scroll.");
  if (expectAsset) {
    const usesImg = /background-image:url\(/i.test(html) || /<img\s/i.test(html);
    if (!usesImg) errors.push("Brand har assets, men final film bruker ingen.");
  }
  return { ok: errors.length === 0, errors };
}
