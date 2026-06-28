// BRAND INTELLIGENCE EXTRACTOR
// ---------------------------------------------------------------------------
// Turns raw fetched website HTML (+ optional CSS text) into a structured brand
// profile WITH a classified asset inventory. This is the piece that was missing:
// the live scraper returned "no images" for sites like teck.com even though the
// page ships an og:image logo and dozens of real photos. The bug is extraction,
// not rendering — so this module is pure string parsing (no DOM lib, no network)
// and is fully unit-testable against a saved HTML file.
//
// Drop-in for Lovable as `src/lib/brand-intelligence.server.ts` — call it with
// the HTML your scraper already fetches. (For colors, optionally pass the text
// of the site's main CSS bundle; without it, colors fall back to a neutral set.)

export interface BrandIntelligence {
  businessName: string;
  category: string;
  description: string;
  cta: string;
  sourceFacts: string[];
  assetInventory: {
    logos: string[];
    heroImages: string[];
    productImages: string[];
    peopleImages: string[];
    colors: string[];
  };
}

// Each category scores by how many keyword hits it gets across the page; the
// highest score wins (first-match is fragile — e.g. "newsroom" should not make
// a mining company read as "hotel"). Keywords use word boundaries.
const CATEGORY_KEYWORDS: Array<[string, RegExp]> = [
  ["mining", /\b(mining|miner|metals?|copper|zinc|steel|coal|smelter|ore|resources?\b)/gi],
  ["hotel", /\b(hotel|resort|\bspa\b|overnatting|rooms?|suites?|stay|guests?)\b/gi],
  ["restaurant", /\b(restaurant|menu|dining|cuisine|reservation|chef|cafe)\b/gi],
  ["realestate", /\b(real estate|property|eiendom|listing|megler|for sale)\b/gi],
  ["finance", /\b(finance|bank|invest(or|ing)?|insurance|regnskap|accounting|capital)\b/gi],
  ["saas", /\b(software|platform|api|dashboard|cloud|devtool|saas|integrat)\b/gi],
  ["interior", /\b(interior|furniture|interiør|møbler)\b/gi],
  ["fashion", /\b(fashion|clothing|apparel|streetwear|atelier)\b/gi],
  ["agency", /\b(agency|byrå|branding|creative studio)\b/gi],
  ["health", /\b(clinic|medical|dental|klinikk|tannlege)\b/gi],
];

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(name + '\\s*=\\s*"([^"]*)"', "i"));
  return m ? m[1] : null;
}
function metaContent(html: string, key: string): string | null {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? attr(tag, "content") : null;
}
function abs(url: string, base: string): string | null {
  try { return new URL(url, base).href; } catch { return null; }
}
function strip(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function decode(s: string): string {
  return s.replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’").replace(/&[a-z]+;/gi, " ").trim();
}

const SKIP_IMG = /icon|sprite|favicon|logo|pixel|spacer|blank|loading|placeholder|1x1|avatar|flag|badge|arrow|chevron/i;
const PEOPLE = /people|team|staff|portrait|employee|our-people|leader|ansatt/i;
const PRODUCT = /product|copper|zinc|steel|metal|coal|item|menu|dish|car-|vehicle/i;

export function extractBrandIntelligence(
  html: string,
  baseUrl: string,
  cssText = "",
): BrandIntelligence {
  // --- name / description ---
  const siteName = metaContent(html, "og:site_name");
  const titleRaw = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "";
  const businessName = decode(siteName || titleRaw.split(/[|–-]/)[0] || "").trim() || "Brand";
  const description = decode(metaContent(html, "description") || metaContent(html, "og:description") || "");

  // --- category ---
  const haystack = `${businessName} ${description} ${strip(html).slice(0, 6000)}`;
  let category = "default";
  let bestScore = 0;
  for (const [cat, re] of CATEGORY_KEYWORDS) {
    const hits = (haystack.match(re) || []).length;
    if (hits > bestScore) { bestScore = hits; category = cat; }
  }

  // --- logos ---
  const logos = new Set<string>();
  const og = metaContent(html, "og:image");
  if (og) { const a = abs(og, baseUrl); if (a) logos.add(a); }
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const src = attr(m[0], "src") || attr(m[0], "data-src");
    if (src && /logo/i.test(src)) { const a = abs(src, baseUrl); if (a) logos.add(a); }
  }

  // --- photos (classified) ---
  const hero: string[] = [], product: string[] = [], people: string[] = [];
  const seen = new Set<string>();
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    let src = attr(m[0], "src") || attr(m[0], "data-src") || attr(m[0], "data-lazy-src");
    if (!src || src.startsWith("data:")) continue;
    if (SKIP_IMG.test(src)) continue;
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(src)) continue; // photos only (skip svg/gif)
    const a = abs(src, baseUrl);
    if (!a || seen.has(a)) continue;
    seen.add(a);
    if (PEOPLE.test(a)) people.push(a);
    else if (PRODUCT.test(a)) product.push(a);
    else hero.push(a);
  }

  // --- colors (rank hex from CSS, drop near-white/black & greys) ---
  const colors = rankColors(cssText + " " + html);

  // --- CTA ---
  const cta = findCta(html);

  // --- facts ---
  const facts: string[] = [];
  if (description) facts.push(description);
  for (const m of html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)) {
    const t = decode(strip(m[1]));
    if (t.length >= 6 && t.length <= 90 && !facts.includes(t)) facts.push(t);
    if (facts.length >= 14) break;
  }

  return {
    businessName,
    category,
    description,
    cta,
    sourceFacts: facts,
    assetInventory: {
      logos: [...logos].slice(0, 4),
      heroImages: hero.slice(0, 10),
      productImages: product.slice(0, 8),
      peopleImages: people.slice(0, 6),
      colors,
    },
  };
}

function findCta(html: string): string {
  const cands: string[] = [];
  for (const m of html.matchAll(/<a[^>]*class="[^"]*(?:btn|button|cta)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const t = strip(m[1]); if (t && t.length <= 30) cands.push(t);
  }
  for (const m of html.matchAll(/<(?:button|a)[^>]*>([^<]{3,28})<\/(?:button|a)>/gi)) {
    const t = strip(m[1]);
    if (/contact|get started|book|sign up|kontakt|kom i gang|bestill|learn more|get a quote|demo|invest/i.test(t)) cands.push(t);
  }
  const pick = cands.find((c) => /contact|book|get started|kontakt|kom i gang|bestill|demo|quote|invest/i.test(c)) || cands[0];
  return pick ? decode(pick).replace(/[\s/›»>]+$/, "").trim() : "";
}

function rankColors(text: string): string[] {
  const counts: Record<string, number> = {};
  for (const m of text.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const hex = "#" + m[1].toLowerCase();
    counts[hex] = (counts[hex] || 0) + 1;
  }
  const scored = Object.entries(counts)
    .filter(([hex]) => {
      const { l, s } = hsl(hex);
      if (l > 0.9 || l < 0.07) return false;       // near white/black
      if (s < 0.15 && (l > 0.7 || l < 0.25)) return false; // washed greys
      return true;
    })
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex);
  // de-dupe very similar colors
  const out: string[] = [];
  for (const c of scored) {
    if (!out.some((o) => closeColor(o, c))) out.push(c);
    if (out.length >= 3) break;
  }
  return out;
}

function hsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
  return { h: 0, s, l };
}
function closeColor(a: string, b: string): boolean {
  const d = (i: number) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16));
  return d(1) + d(3) + d(5) < 60;
}
