# Skill: asset-extraction

**File:** `skills/asset-extraction.md`
**Purpose:** Download and **score** real visual assets so the film uses the best
genuine photography/logo, never stock or invented imagery.
**Used in:** Pipeline step 3b (`engine/analyzer/assets.py`).

## Input
- `extracted.json`: `logo_url`, `logo_candidates`, `favicon`, `og_image`,
  `images[]` (url, alt, in_hero, background), `services[]`.

## Output — `assets_manifest.json`
Ranked `all[]` with `{role, score, quality, relevance, crop_safe, stats}`, plus
quick-access `logo`, `hero`, `heroes[]`, `people[]`, and `warnings[]`.

## Scoring model (0..1)
`score = 0.5*quality + 0.5*relevance`

**quality** (from Pillow stats):
- resolution: `min(megapixels/2, 1) * 0.5`
- aspect sanity: `+0.3` if `0.4 ≤ ratio ≤ 2.5`
- min width ≥ 800: `+0.2`

**relevance** (by role):
- logo → 0.95 (alt/class/src contains "logo", or in header)
- hero → 0.85 (in_hero OR ratio ≥1.6 & ≥0.8MP)
- product/service → 0.8 if alt matches a service term, else 0.5
- people/team → 0.7 (alt: team/ansatt/staff/portrait/oss)
- texture/noise → 0.2 (under 0.15MP)

**crop_safe** = `0.5 ≤ ratio ≤ 2.0` (safe to full-bleed in 9:16 and 16:9).

## Rules
- **Dedupe by content hash** (sha1 of bytes), not URL — kills CDN duplicates.
- Skip SVG sprites and tracking pixels; skip <0.05MP.
- Keep `source_url` + `local_path` for provenance/QA.
- Always select: best logo, best hero, up to 6 heroes for multi-scene films.
- Emit warnings: `no_logo_found`, `no_strong_hero_image`, `few_assets`.

## Common failures to prevent
- Using the favicon as a hero.
- Using a 60px nav logo full-bleed (blurry) — logo role is never used as scene bg.
- Reusing the same photo in every scene when ≥2 good ones exist (round-robin).
- Picking a wide banner sliver (ratio >2.5) as a 9:16 hero → crop_safe filter.

## Fallbacks
- No logo → render a typographic wordmark from `brand_profile.name` in heading font.
- No strong hero → use `og_image`, else a graded solid-color scene with kinetic type.
