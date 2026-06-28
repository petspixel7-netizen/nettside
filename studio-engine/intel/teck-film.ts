// End-to-end proof on a REAL site (teck.com):
//   raw HTML  →  extractBrandIntelligence  →  grounded storyboard  →  composeReel
// Images are inlined as data-URIs (exactly what image-inline.ts does server-side)
// so the screenshot is self-contained and shows teck's real logo + photos.

import { readFileSync, writeFileSync } from "node:fs";
import { extractBrandIntelligence } from "./brand-intelligence";
import { composeReel, type SceneRow } from "../reel/index";
import type { Brand } from "../reel/directions/types";

const DIR = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/teck-resources.html";

function dataUri(path: string, mime: string): string {
  return `data:${mime};base64,` + readFileSync(path).toString("base64");
}

const html = readFileSync(`${DIR}/teck.html`, "utf8");
const css = readFileSync(`${DIR}/teck-base.css`, "utf8");
const bi = extractBrandIntelligence(html, "https://www.teck.com/", css);

// inline the real downloaded assets
const logo = dataUri(`${DIR}/teck-logo.png`, "image/png");
const hero1 = dataUri(`${DIR}/teck-hero1.png`, "image/png");
const hero2 = dataUri(`${DIR}/teck-hero2.jpg`, "image/jpeg");
const hero3 = dataUri(`${DIR}/teck-hero3.png`, "image/png");

const brand: Brand = {
  siteName: "Teck",
  title: bi.businessName,
  tagline: "Metals for the energy transition",
  category: bi.category,                 // extracted → "mining"
  colors: bi.assetInventory.colors,      // extracted brand colors
  logo,
  images: [hero1, hero2, hero3],
};

// storyboard grounded in REAL extracted facts (no filler)
const scenes: SceneRow[] = [
  { title: "Teck Resources", body: bi.description.split(".")[0], animation_style: "logo", duration_ms: 3200 },
  { title: "Metals essential for the energy transition", body: "A Canadian resource company providing copper, zinc and steel — responsibly.", animation_style: "hook", duration_ms: 3800, image_url: hero1 },
  { title: "Copper, Zinc, Steelmaking coal", body: "", animation_style: "zones", duration_ms: 3200 },
  { title: "Teck and Anglo American to combine", body: "Two companies joining through merger.", animation_style: "manifesto", duration_ms: 3400, image_url: hero3 },
  { title: "Sustainable resource development", body: "Purpose, leadership and governance you can hold to account.", animation_style: "trust", duration_ms: 3200, image_url: hero2 },
  { title: bi.cta || "Go to Investors", body: "teck.com", animation_style: "cta", duration_ms: 3000 },
];

const film = composeReel(brand, scenes, { format: "16_9", mode: "film", docTitle: "Teck Resources" });
writeFileSync(OUT, film);

console.log("Extracted →", { name: bi.businessName, category: bi.category, colors: bi.assetInventory.colors, cta: bi.cta });
console.log("Wrote", OUT);
