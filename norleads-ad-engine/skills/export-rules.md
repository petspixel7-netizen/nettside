# Skill: export-rules

**File:** `skills/export-rules.md`
**Purpose:** Define the final deliverable folder so every project is portable,
reproducible, and ready to screen-record.
**Used in:** Pipeline step 10 (`engine/pipeline.py` export + `render.py` copy).

## Output folder contract — `outputs/<slug>/`
```
index.html            # the film (open + F11 + record)
brief.md              # human-readable brief
project.json          # run config + extracted summary (reproducibility)
brand_profile.json
assets_manifest.json
brief.json
scene_plan.json
visual_direction.json
render_config.json
qa_report.json
assets/               # ALL referenced images/logo copied here (relative paths)
frames/               # still PNG per scene (preview)
```

`<slug>` = `<domain>-<format>-<duration>s` (e.g. `bellatrattoria-reels-40s`).

## Rules
- The folder must be **self-contained**: only external deps are GSAP + font CDNs.
  All images are copied into `assets/` and referenced relatively.
- `index.html` must run by double-click (file://) — no server required.
- Re-running the same input is idempotent: same slug overwrites cleanly.
- Keep intermediate scrape junk in `projects/<slug>/`, NOT in `outputs/`.

## Recording guidance (put in README of each output, optional)
1. Open `index.html`, press F11.
2. Record at the channel canvas resolution; the stage scales to fit.
3. Film length = `scene_plan.duration`. Stop recording at the final hold.

## Optional MP4 (roadmap)
Headless capture via Playwright + `ffmpeg` screen frames, or Remotion bridge.
Not required for v1 — screen recording is the default delivery.

## Quality rules
- No absolute paths in index.html.
- qa_report.json present and `passed=true` before marking a project done.

## Common failures to prevent
- Images referenced from the live URL (breaks offline / when site changes).
- Leaving raw.html / screenshot.png in the deliverable.
- Slug collisions across formats (include format+duration in slug).
