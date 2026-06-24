# Skill: visual-style-director

**File:** `skills/visual-style-director.md`
**Purpose:** Lock the look — grade, type scale, color roles, grain/vignette,
logo and image treatment — so output is premium and consistent.
**Used in:** Pipeline step 6 (`engine/planner/visual.py`) → `visual_direction.json`.

## Input
`scene_plan.json`, `brand_profile.json`, `--style`, channel.

## Output — `visual_direction.json`
`look, grade{}, type{}, color_roles, motion_feel, transitions, logo_treatment,
image_treatment, forbidden[], per_scene[]`.

## Look principles
- **Premium editorial**: restrained palette, real photography, big confident type,
  generous space. Think fashion/hospitality brand film, not a banner ad.
- **Grade:** subtle contrast lift, warm shadows; ink→transparent bottom gradient
  for legibility (not a flat dark box). Grain ≤6%. Vignette ≤25%.
- **Color roles:** `ink` (near-black bg/text base), `paper` (warm off-white text),
  `primary` (brand), `accent` (one sparing highlight — kicker/underline/CTA).

## Type system
- Heading: brand heading font (serif → editorial; geometric sans → modern), large
  (`~6vw`), tight tracking, weight 600.
- Kicker: uppercase, `0.28em` tracking, accent color, small.
- Sub: body font, regular, ~`2.4vw`, 92% opacity.
- Max 2 type sizes visible at once. One headline idea per scene.

## Image treatment
- Full-bleed `object-fit: cover`, focal-safe center, ken-burns.
- Consistent grade across all images so mixed-source photos feel like one shoot.
- Never stretch; never use logo as a background; never low-res upscaled hero.

## Logo treatment
- Mono-knockout in `paper` (or original if it reads on the scrim). Max 18% width.
- Corner on hook, center on cta. Drop-shadow subtle, single.

## Forbidden (hard list)
neon glow · stacked drop-shadows · rainbow/purple-cyan gradients · spinning 3D
cards · emoji · default Bootstrap blue · particle confetti · lens flares ·
fake "AI" sci-fi UI.

## Quality rules
- Contrast: text over image must clear WCAG AA-ish via the scrim (QA samples).
- Same grade params across scenes (cohesion).
- Accent appears on ≤2 elements per scene.

## Common failures to prevent
- Pure #fff text on bright image (illegible) → always scrim.
- Five fonts / five colors (amateur).
- Over-stylized grade that destroys the real photography.
