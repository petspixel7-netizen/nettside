// Art-direction contract. Each direction is an isolated visual package:
// own fonts, own CSS, own scene renderers, own animations, own image treatment.
//
// Hard rule: directions do NOT share CSS classes or animation helpers.
// Every selector a direction emits MUST be scoped under
// `#film[data-dir="${id}"]` (or prefixed `.${id}-…`). Cross-direction
// selectors are a bug.

export type Archetype =
  | "logo" | "hook" | "kinetic" | "manifesto" | "chaos" | "pipeline"
  | "grid" | "rings" | "big-num" | "zones" | "trust" | "cta"
  | "signal" | "mono-draw";

export const ARCHETYPES: ReadonlyArray<Archetype> = [
  "logo", "hook", "kinetic", "manifesto", "chaos", "pipeline",
  "grid", "rings", "big-num", "zones", "trust", "cta", "signal", "mono-draw",
];

// How a scene uses cfg.imageUrl. Every direction must honour these (it may map
// several treatments to the same internal layout, but must never ignore an
// image when one is supplied for a treatment other than "none").
export type ImageTreatment =
  | "full-bleed"
  | "split-left"
  | "split-right"
  | "poster"
  | "masked-shape"
  | "texture"
  | "logo-lockup"
  | "none";

// Minimal brand shape the renderers need. A superset of the old BrandData and
// the new BrandIntelligence.assetInventory — both can feed this.
export interface Brand {
  siteName?: string;
  title?: string;
  tagline?: string;
  category?: string;
  colors?: string[];
  logo?: string | null;
  images?: string[];
}

export interface SceneCfg {
  title: string;
  body: string;
  imageUrl?: string | null;
  treatment?: ImageTreatment;
}

export interface SceneCtx {
  idx: number;     // 1-based scene index
  t0: number;      // start time (s) on master timeline
  dur: number;     // scene duration (s)
  total: number;   // total reel scenes
  brand: Brand;
  seed: number;    // per-reel seed for deterministic-but-varied choices
}

export interface ArtDirection {
  id: string;
  /** Human label for the studio UI. */
  label: string;
  /** Broad families this direction is a good fit for (used by the router). */
  fits: ReadonlyArray<string>;
  /** Google Fonts <link> URL with every family this direction uses. */
  fontsHref: string;
  /** All CSS for the direction, scoped under `#film[data-dir="${id}"]`. */
  baseCss(brand: Brand): string;
  /** Optional logo/progress chrome (hidden automatically in scene-preview). */
  renderChrome?(brand: Brand): string;
  renderScene(arch: Archetype, cfg: SceneCfg, ctx: SceneCtx): string;
  animateScene(arch: Archetype, cfg: SceneCfg, ctx: SceneCtx): string;
  /** GSAP js for the cut between scene `idx` and `idx+1` at time `at`. */
  cutTransition(at: number, idx: number): string;
  /** Preferred image treatment for an archetype/slot. composeReel may override. */
  treatmentFor?(arch: Archetype, ctx: SceneCtx): ImageTreatment;
}
