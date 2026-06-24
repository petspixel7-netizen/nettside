# Architecture — NorLeads Ad Engine v1

## Design rules

- **Python = orchestration + deterministic logic** (scrape, parse, score, time,
  assemble template, run QA). No creativity that can be encoded as rules lives in
  prompts.
- **`.md` skills = quality rules + the prompts an LLM step uses.** Each skill is
  self-contained: purpose, when used, input, output, quality rules, common
  failures. They are the contract for both human and LLM contributors.
- **HTML/JS/CSS templates = the render target.** Jinja2-rendered, self-contained
  output. GSAP from CDN. One timeline. No UI.
- **JSON = the spine.** Every step reads JSON and writes JSON. Steps are pure
  functions of their inputs, so any step can be re-run alone.

## Exact folder structure

```
norleads-ad-engine/
  README.md                 # quickstart
  ARCHITECTURE.md           # this file
  ROADMAP.md                # v0..v6 build order + testcases
  CODEX_INSTRUCTIONS.md     # exact brief for Codex
  requirements.txt
  phantom.py                # CLI entrypoint (argparse) -> engine.pipeline.run()

  engine/
    __init__.py
    config.py               # paths, defaults, slugify, dataclasses
    pipeline.py             # orchestrates the 10 steps, writes artifacts
    llm.py                  # thin LLM client wrapper (pluggable; offline stub)
    scraper/
      __init__.py
      fetch.py              # get HTML + screenshots (playwright|httpx fallback)
      extract.py            # parse DOM/OG/JSON-LD -> extracted dict
    analyzer/
      __init__.py
      brand.py              # colors, fonts, tone -> brand_profile.json
      assets.py             # download + score assets -> assets_manifest.json
    planner/
      __init__.py
      brief.py              # extracted+brand -> brief.json (+ brief.md)
      timing.py             # duration -> scene timing recipe
      scene_plan.py         # brief+timing+rules -> scene_plan.json
      visual.py             # scene_plan+style -> visual_direction.json
    renderer/
      __init__.py
      render.py             # scene_plan+visual+brand -> index.html (Jinja2)
      frames.py             # render still PNG per scene (playwright)
    qa/
      __init__.py
      check.py              # static + playwright checks -> qa_report.json
    schemas/
      *.schema.json         # JSON Schema for every artifact (validation)

  skills/                   # the .md rule/prompt files (see skills/README order)
  templates/
    base.html.j2            # master shell: <head>, canvas, scene loop, timeline
    reels-15s.html          # thin presets that set channel+duration defaults
    reels-30s.html
    reels-40s.html
    website-hero-40s.html
    assets/
      film.css              # layout, no-scroll, responsive scaling, safe areas
      timeline.js           # builds GSAP timeline from embedded SCENE_PLAN
  data/
    channels.json           # canvas/margins/text limits/pacing per channel
    durations.json          # timing recipes per duration
    industries.json         # industry playbooks (hooks/trust/CTA/motion/tone)
  prompts/                  # render-ready prompt templates (used by engine.llm)
  projects/                 # working dirs per run (intermediate)
  outputs/                  # final deliverable folders
  examples/
    bella-trattoria/        # full worked example (all JSON + index.html)
```

## What is Python vs .md vs HTML/JS/CSS

| Concern                              | Lives in                          |
|--------------------------------------|-----------------------------------|
| Fetch page, screenshots             | `engine/scraper/fetch.py`         |
| Parse DOM/OG/JSON-LD                 | `engine/scraper/extract.py`       |
| Color/font/tone extraction          | `engine/analyzer/brand.py`        |
| Asset download + **scoring**        | `engine/analyzer/assets.py`       |
| Duration → scene timing math        | `engine/planner/timing.py`        |
| Channel/canvas/safe-area math       | `data/channels.json` + renderer   |
| Industry playbooks                  | `data/industries.json` + skill    |
| Copywriting rules                   | `skills/copywriter.md`            |
| Motion/anti-slop rules              | `skills/motion-director.md` etc.  |
| Actual animation                    | `templates/assets/timeline.js`    |
| Layout / no-scroll / scaling        | `templates/assets/film.css`       |
| QA checks                           | `engine/qa/check.py` + skill      |

## LLM boundary

The engine runs end-to-end **without** an LLM (deterministic copy from extracted
facts + industry templates). When `engine/llm.py` has a configured backend, the
brief / scene-plan / copy steps are upgraded by the matching `skills/*.md` prompt.
This keeps the engine usable offline and makes the LLM an enhancer, not a
dependency. The `.md` skills are the prompts; `prompts/` holds the filled
templates the runtime sends.

## Data flow contract

Each step function signature is `step(project_dir: Path, cfg: RenderConfig) -> Path`
and writes exactly one validated JSON (or the HTML). `pipeline.run()` chains them
and validates each artifact against `engine/schemas/*.schema.json` before
continuing. A failed validation aborts with a readable error and a partial folder
you can inspect.
