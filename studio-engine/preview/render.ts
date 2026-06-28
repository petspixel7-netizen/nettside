// Render every fixture to a self-contained HTML film + run the quality gate.
// Output goes to studio-engine/out/.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { composeReel, composeReelMeta } from "../reel/index";
import { checkStoryboard, checkFilmHtml } from "../reel/quality-gates";
import { FIXTURES } from "./fixtures";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out");
mkdirSync(outDir, { recursive: true });

const index: Array<{ name: string; file: string; dir: string }> = [];

for (const fx of FIXTURES) {
  const meta = composeReelMeta(fx.brand, {});
  const html = composeReel(fx.brand, fx.scenes, { format: fx.format, mode: "film" });
  const file = `${fx.name}.html`;
  writeFileSync(join(outDir, file), html);

  const hasAssets = (fx.brand.images?.length ?? 0) > 0 || !!fx.brand.logo;
  const q = checkStoryboard(fx.brand, fx.scenes);
  const film = checkFilmHtml(html, hasAssets);

  index.push({ name: fx.name, file, dir: meta.directionId });
  console.log(`\n● ${fx.name}  →  direction: ${meta.directionId}  (${fx.format})`);
  console.log(`  ${meta.rationale}`);
  console.log(`  quality: variety=${q.varietyScore} assetUse=${q.assetUseScore} specificity=${q.brandSpecificityScore} ok=${q.ok}`);
  if (q.errors.length) console.log("  ERRORS: " + q.errors.join(" | "));
  if (q.warnings.length) console.log("  warn: " + q.warnings.join(" | "));
  console.log("  film-gate: " + (film.ok ? "OK (F11-ready)" : "FAIL " + film.errors.join(" | ")));
}

// tiny gallery index
const links = index.map((i) => `<li><a href="${i.file}">${i.name}</a> — <b>${i.dir}</b></li>`).join("");
writeFileSync(join(outDir, "index.html"),
  `<!doctype html><meta charset=utf-8><title>Studio engine — gallery</title><body style="font-family:system-ui;padding:40px"><h1>Studio engine — render gallery</h1><ul>${links}</ul></body>`);
console.log(`\nWrote ${index.length} films + gallery to studio-engine/out/`);
