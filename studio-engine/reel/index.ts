// Deterministic reel composer. No AI calls — pure string assembly.
// Picks ONE isolated art-direction module (via the router), then lets that
// module render every scene. The composer owns: layout sizing, the GSAP
// timeline, image→scene assignment, and the auto-fit pass. It does NOT own
// scene HTML, fonts, colors, or animation grammar — those belong to directions.

import { GSAP_INLINE } from "./vendor/gsap";
import { FIT_TEXT_RUNTIME } from "./fit-text";
import { directionById } from "./directions";
import { routeDirection } from "./direction-router";
import type { Archetype, Brand, ImageTreatment, SceneCtx } from "./directions/types";
import { ARCHETYPES } from "./directions/types";
import { escapeAttr } from "./helpers";

export type Format = "16_9" | "9_16" | "1_1";
export type RenderMode = "film" | "loop-preview";

export interface SceneRow {
  title: string;
  body: string;
  animation_style: string; // archetype id
  duration_ms: number;
  image_url?: string | null;
}

export interface ComposeOptions {
  format?: Format;
  mode?: RenderMode;     // "film" = autoplay, no controls (F11-ready)
  seed?: number;
  forceDirectionId?: string;
  loop?: boolean;        // film mode: loop forever (default false → play once)
  docTitle?: string;
}

function asArchetype(s: string): Archetype {
  return (ARCHETYPES as readonly string[]).includes(s) ? (s as Archetype) : "hook";
}

function filmSizeCss(format: Format): string {
  if (format === "9_16")
    return "width:min(56.25vh,100vw);height:min(100vh,177.78vw);aspect-ratio:9/16;";
  if (format === "1_1")
    return "width:min(100vw,100vh);height:min(100vw,100vh);aspect-ratio:1/1;";
  return "width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;";
}

// Decide which image (if any) and which treatment a scene should use.
// Rules: scene 1 → logo or hero; last (CTA) → logo lockup; middle → rotate
// through brand imagery. A scene's own image_url always wins.
function assignAsset(
  arch: Archetype,
  ctx: SceneCtx,
  ownImage: string | null | undefined,
  prefer: ImageTreatment | undefined,
): { imageUrl: string | null; treatment: ImageTreatment } {
  const brand = ctx.brand;
  const isFirst = ctx.idx === 1;
  const isLast = ctx.idx === ctx.total;
  const pics = brand.images ?? [];

  let treatment: ImageTreatment = prefer ?? "none";
  let imageUrl: string | null = ownImage ?? null;

  if (!imageUrl) {
    if ((isFirst || arch === "logo") && brand.logo) {
      imageUrl = brand.logo;
      treatment = "logo-lockup";
    } else if ((isLast || arch === "cta") && brand.logo) {
      imageUrl = brand.logo;
      treatment = treatment === "none" ? "logo-lockup" : treatment;
    } else if (pics.length) {
      // rotate through available images for middle scenes
      imageUrl = pics[(ctx.idx - 1) % pics.length] ?? null;
    }
  }

  // a logo treatment must use the logo if we have one
  if (treatment === "logo-lockup" && !imageUrl && brand.logo) imageUrl = brand.logo;
  // no image to show → collapse the treatment so we never render an empty frame
  if (!imageUrl) treatment = "none";
  return { imageUrl, treatment };
}

export function composeReel(
  brand: Brand,
  scenes: SceneRow[],
  opts: ComposeOptions = {},
): string {
  const format = opts.format ?? "16_9";
  const mode: RenderMode = opts.mode ?? "film";
  const route = routeDirection(brand, { seed: opts.seed, forceDirectionId: opts.forceDirectionId });
  const dir = directionById(route.directionId)!;
  const total = scenes.length;
  const isFilm = mode === "film";

  let t = 0;
  const sceneHtml: string[] = [];
  const sceneJs: string[] = [];

  scenes.forEach((s, i) => {
    const dur = Math.max(1.5, s.duration_ms / 1000);
    const arch = asArchetype(s.animation_style);
    const ctx: SceneCtx = { idx: i + 1, t0: t, dur, total, brand, seed: route.seed };
    const prefer = dir.treatmentFor ? dir.treatmentFor(arch, ctx) : undefined;
    const { imageUrl, treatment } = assignAsset(arch, ctx, s.image_url, prefer);
    const cfg = { title: s.title, body: s.body, imageUrl, treatment };
    sceneHtml.push(dir.renderScene(arch, cfg, ctx));
    sceneJs.push(dir.animateScene(arch, cfg, ctx));
    if (i < scenes.length - 1) {
      sceneJs.push(dir.cutTransition(t + dur - 0.2, i));
    }
    t += dur;
  });
  const totalDuration = t;

  const cutEls = `<div class="${dir.id}-cut"></div>`;
  const title = escapeAttr(opts.docTitle || brand.siteName || "Reel");
  const repeat = isFilm && !opts.loop ? 0 : -1;

  const bootFilm = `
(function(){
  function boot(){
    if (window.__fitAll) window.__fitAll();
    var tl = gsap.timeline({repeat:${repeat}, repeatDelay:0.6});
    ${sceneJs.join("\n")}
    tl.play(0);
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();`;

  return `<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${dir.fontsHref}" rel="stylesheet"/>
<script>${GSAP_INLINE}</script>
<style>
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#000;overflow:hidden;width:100%;height:100%}
#film{position:relative;margin:auto;${filmSizeCss(format)}overflow:hidden;container-type:size}
${dir.baseCss(brand)}
</style>
</head>
<body data-render-mode="${mode}">
<main id="film" data-dir="${dir.id}">
  ${dir.renderChrome ? dir.renderChrome(brand) : ""}
  ${sceneHtml.join("\n")}
  ${cutEls}
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>${bootFilm}</script>
<!-- direction:${dir.id} seed:${route.seed} dur:${totalDuration.toFixed(2)}s mode:${mode} -->
</body>
</html>`;
}

export function composeReelMeta(brand: Brand, opts: ComposeOptions = {}) {
  const route = routeDirection(brand, { seed: opts.seed, forceDirectionId: opts.forceDirectionId });
  return route;
}
