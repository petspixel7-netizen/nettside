# Codex implementation instructions

Read this first. This repo already contains a working v1 skeleton. Your job is to
make it run cleanly end-to-end, add tests, then harden. Keep scope tight; build
the foundation right.

## What already exists (do not rewrite from scratch)
- CLI: `phantom.py`
- Engine: `engine/{config,pipeline,llm}.py`, `scraper/`, `analyzer/`, `planner/`,
  `renderer/`, `qa/`, `schemas/`
- Rules data: `data/{channels,durations,industries}.json`
- Skills: `skills/*.md` (quality contracts — obey them)
- Templates: `templates/base.html.j2`, `templates/assets/{film.css,timeline.js}`
- Example: `examples/bella-trattoria/`

## Build order (exact)
1. **Environment & smoke test.**
   - `pip install -r requirements.txt`; `playwright install chromium` (optional).
   - Verify imports: `python -c "import engine.pipeline"`.
2. **Offline render path.** Make `examples/bella-trattoria/index.html` render from
   the committed `scene_plan.json` + `visual_direction.json` via the template
   (write a tiny `scripts/render_example.py` that calls `renderer.render_html`).
   Confirm it opens fullscreen, autoplays, no scrollbars.
3. **Pipeline run (live).** `python phantom.py https://<real-no-smb> --reels --30s`.
   Fix any crash with a graceful fallback (never hard-fail the pipeline).
4. **Schema validation.** Ensure every artifact validates; fix mismatches in the
   producing function, not the schema (unless the schema is wrong).
5. **Tests** (`tests/`, pytest):
   - `test_config.py`: slugify, RenderConfig slug/paths.
   - `test_timing.py`: known durations exact; unknown duration rescales to target.
   - `test_brand.py`: color ranking ignores #000/#fff; picks saturated primary.
   - `test_assets.py`: scoring, dedupe by hash, role assignment (use small fixtures).
   - `test_brief.py`: brief built from fixture extracted.json; single CTA; no invented facts.
   - `test_scene_plan.py`: contiguous timing, sums to duration, scene_count matches.
   - `test_qa.py`: static checks flag overflow + missing asset; pass on example.
   - `test_render.py`: rendered HTML contains overflow:hidden, cursor:none, GSAP,
     SCENE_PLAN, all scene headlines.
6. **Frame previews.** Wire `--preview-only`; verify frames count == scenes (skip
   if no browser).
7. **QA browser checks.** Confirm no-scroll / non-blank / no-overflow on example.

## How to test (commands)
```
pip install -r requirements.txt && playwright install chromium
python -m pytest -q
python scripts/render_example.py        # offline, deterministic
python phantom.py https://example-smb.no --reels --30s --no-llm
xdg-open outputs/<slug>/index.html      # or open manually + F11
```

## What Codex must NOT do
- Do NOT add AI-video / WanGP / diffusion prompts. Output is HTML/GSAP only.
- Do NOT make the LLM a hard dependency — engine must run with `--no-llm`.
- Do NOT use a card/slideshow layout or neon/glow (violates motion + visual skills).
- Do NOT invent business facts; only use scraped data + industry defaults.
- Do NOT reference live image URLs in index.html — copy assets locally.
- Do NOT add a web server requirement for v1 (index.html runs from file://).
- Do NOT over-engineer: no DB, no queue, no auth until v6.

## Keep scope small, foundation right
- Pure functions per step; JSON in/JSON out; one artifact per step.
- New industry/channel/duration = data edit, not code change (preserve this).
- Graceful degradation everywhere (no Playwright → httpx; no LLM → deterministic;
  no logo → wordmark; no hero → graded color scene).
- Obey the `skills/*.md` files as acceptance criteria; they are the spec.

## Definition of done (v1)
All of: `pytest` green · schemas validate · example renders & autoplays fullscreen
with no scrollbars · CTA at end · `qa_report.passed == true` on the example ·
both CLI flag forms work.
