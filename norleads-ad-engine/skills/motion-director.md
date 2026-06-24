# Skill: motion-director

**File:** `skills/motion-director.md`
**Purpose:** Define the motion language so the film reads as ONE expensive,
continuous piece — never a card slideshow, never AI-slop.
**Used in:** scene-planner (motion per scene) + html-film-builder/timeline.js.

## The core idea
Every ad is **one continuous camera move through a single visual metaphor**
(from `industries.json.metaphor`). Scenes are *moments along that move*, joined by
shared elements — not slides that replace each other.

## Rules for continuous motion
1. **Never reset to static.** Every image is always moving (ken-burns scale/drift
   that continues across the cut, not restarting at 1.0 each scene).
2. **Shared-element transitions.** Carry a continuing element across the cut:
   the image keeps scaling, the text mask hands off, the color graded-through.
   Crossfade with motion overlap (~0.5s), never a hard left/right slide.
3. **Camera grammar:** push-in (hook), lateral drift (context), rack-focus
   (offer), settle (proof), pull-to-logo (cta). Pick per industry `motion_style`.
4. **Depth/layers.** Background image, mid scrim/gradient, foreground type move at
   different rates (parallax). Min 2 depth layers per scene.
5. **Kinetic typography.** Headlines reveal line-by-line via clip masks moving up
   (`expo.out`). Kicker fade-rises first; sub follows. No word-by-word bounce.
6. **Logo reveal.** Fade + slight rise or a mask-draw on hook; settle to corner.
   On cta, pull camera so logo lands center. Never spin.

## How to AVOID a card slideshow
- No scene is a centered box on a flat background with a title.
- No equal-weight "feature cards" sequence.
- Transitions must share continuity (scale/position/color), not cut to black.
- At least one element must persist visually across each scene boundary.

## How to AVOID neon / AI-slop
- No glow stacks, no `box-shadow` rainbows, no laser lines, no particles-as-decor.
- No purple→cyan gradient default. Use brand palette + warm neutrals.
- Real photography graded subtly. Grain ≤6% opacity. Vignette ≤25%.
- Motion eased with `power3`/`expo`/`power4` — never `linear` on type, never
  default ease on big moves. Nothing snaps or bounces cartoonishly.

## How to feel like an expensive agency ad
- Restraint: few elements, large type, generous negative space, slow confident moves.
- One accent color used sparingly (kicker / underline / CTA).
- Type does the work; effects support, never lead.
- Timing breathes: holds before the cut, a beat on the CTA.

## Output (motion block per scene)
`{camera, type_in, image, style}` — consumed by timeline.js.

## Common failures to prevent
- Linear ken-burns that restarts each scene (looks like a slideshow).
- Everything animating at once (no focal hierarchy).
- Bouncy/elastic eases (cheap look).
- Decorative particles/neon to "make it pop".
