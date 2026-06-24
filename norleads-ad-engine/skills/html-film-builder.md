# Skill: html-film-builder

**File:** `skills/html-film-builder.md`
**Purpose:** Assemble the final self-contained, fullscreen, F11-ready HTML film
from scene_plan + visual_direction + assets.
**Used in:** Pipeline step 8 (`engine/renderer/render.py` + `templates/`).

## Input
`scene_plan.json`, `visual_direction.json`, `brand_profile.json`, channel canvas,
copied local assets.

## Output
`outputs/<slug>/index.html` + `assets/` (portable folder). One HTML file that
inlines `film.css` and `timeline.js`, loads GSAP from CDN and brand/fallback fonts.

## Hard requirements (F11 / screen-record ready)
- `html,body{overflow:hidden}` — zero scrollbars, ever.
- `cursor:none` — no pointer in the recording.
- No buttons, no controls, no chrome. Autoplays on load.
- Fixed-aspect `#stage` (canvas px) scaled to fit viewport via JS transform →
  pixel-stable layout, no layout shift, works on any screen.
- Fullscreen background letterbox is black.

## Structure
```
#viewport (grid, centers)
  #stage (--cw × --ch, scaled)
    .scene[] (img.scene__img, scrim, grain, vignette, .logo, .copy{kicker,headline,sub})
<script> GSAP + window.SCENE_PLAN + window.VISUAL + timeline.js
```

## Rules
- Embed `SCENE_PLAN`/`VISUAL` as JSON so the film is data-driven & debuggable.
- Preload all images before `tl.play()` to avoid pop-in.
- Brand fonts via `<link>` with web-safe fallbacks in CSS `--head/--body-font`.
- Build ONE GSAP master timeline (see gsap-animation-rules.md). Expose
  `window.timeline` and `window.verifyDuration()`.
- Support `?still=1&seek=<t>` to freeze a frame (used by frame previews + QA).
- `?preview` flag may show lightweight scene boundaries; master mode shows none.

## Quality rules
- Total timeline duration == scene_plan.duration (±0.4s) — verify in JS.
- No element exceeds `#stage` bounds (no overflow → no scrollbars).
- Headlines fit on intended lines at the type scale (no clipping).
- Works offline except GSAP/font CDNs (acceptable; could be vendored).

## Common failures to prevent
- Using `vh/vw` on `#stage` instead of fixed px + scale (causes layout shift).
- Forgetting `overflow:hidden` on a scene → scrollbar appears.
- Images not preloaded → first play stutters / blank hero.
- Timeline length drifting from planned duration.
