# Skill: scene-planner

**File:** `skills/scene-planner.md`
**Purpose:** Convert brief + timing recipe + industry metaphor into a precise,
scene-by-scene plan with timing, copy, asset, and motion direction per scene.
**Used in:** Pipeline step 5 (`engine/planner/scene_plan.py`); LLM-enhanceable.

## Input
- `brief.json`, timing recipe (`durations.json[duration]`), `brand_profile.json`,
  `assets_manifest.json`, channel rules.

## Output — `scene_plan.json`
Top: `business_name, format, duration, fps_target, metaphor, transition_style,
scene_count, palette, fonts`. Then `scenes[]`, each:
`{index, role, start, seconds, end, copy{kicker,headline,sub}, image, logo,
motion{}, treatment}`. See schema.

## Rules
1. **Roles & order** come from the timing recipe: hook→context→offer→proof→
   (offer)→cta. Times must be contiguous (`end[i] == start[i+1]`) and sum to the
   requested duration (±0.6s — QA enforces).
2. **One metaphor:** copy the industry `metaphor` into the plan and make each
   scene a *continuation* of it, not a separate card. `transition_style` =
   "match-cut / shared-element, never hard slide".
3. **Asset assignment:** round-robin the ranked `heroes[]` so no image repeats
   back-to-back; logo only on hook + cta.
4. **Copy:** filled per `copywriter.md`, clamped to channel `text_limit_chars`.
5. **Motion per scene:** assign camera + type-in + image move (see motion-director).
6. **CTA placement:** the cta scene starts at ~`cta_at × duration`.

## Quality rules
- No scene shorter than 1.5s (unreadable) or longer than 12s (drags).
- Headline present on hook, offer, cta at minimum.
- Image present on every visual scene; if none, scene uses graded color + type.
- `scene_count` matches `len(scenes)`.

## Common failures to prevent
- Time gaps/overlaps that desync the GSAP timeline.
- Same hero image in all scenes.
- A "card per service" structure (that's a slideshow — forbidden).
- CTA buried mid-film instead of at the end.
