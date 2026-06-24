# Skill: gsap-animation-rules

**File:** `skills/gsap-animation-rules.md`
**Purpose:** Concrete GSAP patterns that produce premium, continuous motion and
a verifiable timeline. Implemented in `templates/assets/timeline.js`.

## Master timeline
- ONE `gsap.timeline({defaults:{ease:"power3.out"}, paused:true})`.
- Build everything, then `play(0)`. Keep it deterministic (no random per play).
- Scenes are placed by absolute time using each scene's `start`, with a ~0.5s
  overlap so transitions share motion (continuous, not slideshow).

## Per-scene pattern
```js
tl.fromTo(scene, {opacity:0}, {opacity:1, duration:0.6}, at);        // fade in
tl.to(scene, {opacity:0, duration:0.6}, sc.end - 0.1);              // fade out (except last)
tl.fromTo(img, {scale:from, xPercent:±2}, {scale:from+0.10, xPercent:0,
          duration:dur+0.8, ease:"none"}, at);                      // continuous ken-burns
tl.fromTo(kicker, {y:24,opacity:0}, {y:0,opacity:1,duration:0.7}, at+0.25);
tl.fromTo(lineInner, {yPercent:110}, {yPercent:0,duration:0.9,ease:"expo.out"}, at+0.35); // clip reveal
tl.fromTo(sub, {y:18,opacity:0}, {y:0,opacity:1,duration:0.7}, at+0.6);
tl.fromTo(logo, {opacity:0,y:-10}, {opacity:1,y:0,duration:0.8}, at+0.2);
```

## Easing rules
- Type reveals: `expo.out` / `power4.out` (snappy then settle).
- Camera/image: `power3.out` for moves, `none` (linear) only for the long
  ken-burns so it reads as a steady camera, not an accelerating zoom.
- NEVER `back`/`elastic`/`bounce` on primary content (cheap look).

## Continuity rules
- Ken-burns `from` alternates per scene and the target is always `from+0.10`, so
  scale never resets to 1.0 between scenes → feels like one moving camera.
- Overlap fades (0.5–0.6s) so two scenes are briefly co-visible (shared element).

## Determinism & debug
- Expose `window.timeline` and `window.verifyDuration()` → `{planned, timeline}`.
- `?still=1&seek=<t>`: build, `pause()`, `seek(t)`, add `.still` class.
- Use `device_scale_factor:2` when screenshotting for crisp frames.

## Performance
- Animate only `transform` and `opacity` (GPU). Avoid animating width/top/filter.
- Add `will-change: transform` to images and `#stage`.
- Preload images; cap concurrent heavy filters.

## Common failures to prevent
- Multiple timelines fighting each other (use one master).
- `linear` ease on type (lifeless) / elastic on type (cheap).
- Ken-burns resetting each scene (slideshow tell).
- Forgetting the final hold → CTA flashes by.
