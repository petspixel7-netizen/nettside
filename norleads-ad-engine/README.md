# NorLeads Ad Engine ("phantom")

A **local, modular engine** that turns a business website URL into a finished,
fullscreen, F11-ready HTML ad (Reels / TikTok / Shorts / Story / website-hero /
digital signage) driven by **real brand assets and real facts** scraped from the
site.

> Not a prompt. A pipeline. Prompts and `.md` skills are *components* of the
> workflow, not the product. The product is a folder you can open and screen-record.

## One-line usage

```bash
python phantom.py --url https://bellatrattoria.no --format reels --duration 40 --style premium-local
# short form:
python phantom.py https://bellatrattoria.no --reels --40s
```

Output:

```
outputs/bellatrattoria-reels-40s/
  index.html        # fullscreen, autoplay, no UI, no scrollbars, F11-ready
  brief.md          # human-readable brief
  project.json      # everything the run was built from (reproducible)
  brand_profile.json
  assets_manifest.json
  brief.json
  scene_plan.json
  visual_direction.json
  render_config.json
  qa_report.json
  assets/           # downloaded logo, hero images, fonts
  frames/           # still PNG previews per scene (preview mode)
```

Open `index.html`, press **F11**, screen-record. Done.

## Core principles (enforced by skills + QA)

1. **Real assets, real facts.** Logo, colors, photos, services, prices, hours,
   location, phone — pulled from the live site. No invented claims.
2. **One continuous visual metaphor.** Not a card slideshow. See
   `skills/motion-director.md`.
3. **Premium, not neon/AI-slop.** Restrained palette, real photography, editorial
   type. See `skills/visual-style-director.md`.
4. **Channel-correct.** Canvas size, safe margins, pacing and CTA timing come from
   `data/channels.json` + `data/durations.json`.
5. **Deterministic & reproducible.** Every run writes the full JSON chain so any
   step can be re-run in isolation.

## Pipeline (10 steps)

```
URL+format+duration+style
  → 1 fetch (scraper)        → raw.html, screenshots
  → 2 extract (scraper)      → extracted.json
  → 3 brand+assets (analyzer)→ brand_profile.json, assets_manifest.json
  → 4 brief (planner)        → brief.json + brief.md
  → 5 scene plan (planner)   → scene_plan.json
  → 6 visual direction       → visual_direction.json
  → 7 frame previews (render)→ frames/*.png
  → 8 HTML master (render)   → index.html
  → 9 QA (qa)                → qa_report.json
  → 10 export                → outputs/<slug>/
```

See `ARCHITECTURE.md` for what every file does, `ROADMAP.md` for the build order,
and `CODEX_INSTRUCTIONS.md` for the exact implementation brief.

## Install

```bash
cd norleads-ad-engine
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium   # optional but recommended (JS sites + QA + frames)
```

Everything degrades gracefully: if Playwright is missing, the engine falls back to
`httpx` + `selectolax`; if QA's browser is missing, it runs static checks only.
