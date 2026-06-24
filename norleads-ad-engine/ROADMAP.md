# Roadmap — v0 → v6

Each level lists: files to create, "done" definition, and testcases. Build in
order; every level ships something runnable.

## v0 — prototype (one file)
**Goal:** prove the render target. Hand-write one `index.html` from a fixed
`scene_plan` (no scraping).
- Files: `templates/assets/film.css`, `templates/assets/timeline.js`,
  `templates/base.html.j2`, a hardcoded `examples/*/scene_plan.json`.
- Done: open index.html → fullscreen, no scrollbars, autoplay, continuous GSAP
  motion, CTA at end, `window.verifyDuration()` matches.
- Tests: manual F11; `window.timeline.duration()` ≈ planned; no console errors.

## v1 — local engine (this repo)
**Goal:** `python phantom.py --url ... --format ... --duration ... --style ...`
runs the full 10-step pipeline and writes `outputs/<slug>/`.
- Files: `phantom.py`, `engine/{config,pipeline,llm}.py`, `engine/scraper/*`,
  `engine/analyzer/*`, `engine/planner/*`, `engine/renderer/*`, `engine/qa/*`,
  `engine/schemas/*`, `data/*`, all `skills/*`.
- Done: a real Norwegian SMB URL produces a valid folder with all 9 JSON files +
  index.html; QA static checks run; pipeline never crashes (graceful fallbacks).
- Tests:
  - `pytest` unit tests for `slugify`, `timing_recipe` (incl. rescale),
    color ranking, asset scoring, brief assembly.
  - integration: run against `examples/bella-trattoria` fixtures (offline) →
    matches committed JSON shapes; schema validation passes.

## v2 — asset extractor (real)
**Goal:** robust real-site scraping + scoring.
- Files: harden `scraper/fetch.py` (Playwright path), `analyzer/assets.py`
  (Pillow stats, dedupe, crop-safety), favicon/OG fallbacks.
- Done: logo + ≥3 scored, deduped, downloaded assets for 5 diverse real sites.
- Tests: snapshot `assets_manifest.json` for fixture HTML; logo confidence ≥0.8
  when a logo exists; dedupe removes byte-identical images.

## v3 — preview frames
**Goal:** still PNG per scene before master.
- Files: `renderer/frames.py`, `--preview-only` flag (already wired).
- Done: `frames/scene-00-hook.png …` rendered at 2× DPI via `?still=1&seek`.
- Tests: frame count == scene count; non-blank (bytes > threshold).

## v4 — QA automation
**Goal:** browser QA + revision loop.
- Files: extend `qa/check.py` (contrast, safe-margins, cta-visible-at-end,
  consecutive-frame-similarity, neon histogram); add `engine/revise.py` that
  feeds qa issues back through the revision prompt.
- Done: `qa_report.json` with browser checks; `--fix` re-runs failing step once.
- Tests: deliberately overflow a headline → `text_length_safe` fails; missing
  asset → `assets_exist` fails; clean run → `passed=true`.

## v5 — industry packs
**Goal:** all 10 playbooks tuned + per-industry motion presets.
- Files: expand `data/industries.json`, add `data/motion_presets.json`,
  optional per-industry CSS accents.
- Done: same URL with different `--style` yields visibly different grade/motion/copy.
- Tests: golden-file copy/scene_plan per industry for one fixture.

## v6 — GUI / web dashboard
**Goal:** local web UI to queue jobs, preview frames, approve, export.
- Files: `webapp/` (FastAPI + a tiny frontend), job queue, gallery of outputs.
- Done: paste URL, pick format/duration/style, watch frames, open film.
- Tests: e2e Playwright drives the dashboard end-to-end.

## Definition of "done" overall (v1 acceptance)
1. CLI runs both long and short flag forms.
2. Output folder matches `skills/export-rules.md` contract.
3. All artifacts validate against their schemas.
4. QA static checks pass on the example.
5. The film opens, autoplays fullscreen, no scrollbars, CTA at end.
