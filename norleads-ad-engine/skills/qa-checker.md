# Skill: qa-checker

**File:** `skills/qa-checker.md`
**Purpose:** Automatically verify the film is correct, premium, and channel-safe
before it ships. Implemented in `engine/qa/check.py`.
**Used in:** Pipeline step 9 → `qa_report.json`.

## Two layers
1. **Static checks** (always): JSON + filesystem, no browser.
2. **Browser checks** (Playwright): real render. Skipped gracefully if no browser.

## Checklist (each → {check, ok, detail})

### Static
- `duration_matches`: |timeline planned − requested| ≤ 0.6s.
- `logo_present`: logo used in hook/cta scene.
- `cta_present`: cta scene exists with non-empty headline.
- `assets_exist`: every referenced image/logo file present in output.
- `text_length_safe`: no headline > 60 chars (overflow risk).
- `real_facts_used`: services/proof sourced from the site (anti-hallucination).

### Browser (Playwright)
- `no_horizontal_scroll` / `no_vertical_scroll`: scrollWidth/Height ≤ viewport.
- `viewport_covered`: stage fills the viewport.
- `no_text_overflow`: no element clips its content.
- `canvas_not_blank`: screenshot bytes > threshold (not a black/empty frame).
- (extendable) `contrast_ok`: sample text vs background luminance ≥ ratio.
- (extendable) `cta_visible_at_end`: seek to 95% → CTA text in DOM & visible.
- (extendable) `safe_margins`: text bbox within channel safe area.

## Report format (`qa_report.json`)
`{slug, passed, score, total, failed, verdict, checks[]}`. `passed=false` makes
the CLI exit non-zero so it can gate automation.

## Suggested additional automated QA (roadmap v4)
- Per-scene screenshots → flag near-identical consecutive frames (static/slideshow tell).
- Histogram check for neon (oversaturated magenta/cyan dominance) → "AI-slop" warn.
- OCR the CTA frame to confirm CTA text actually rendered.
- Diff planned vs rendered scene count.

## Quality rules
- A failing asset or overflow is a hard fail, not a warning.
- QA never edits the film; it reports. A revision pass (see prompts) fixes issues.

## Common failures to prevent
- Shipping with a missing/broken image (grey box on screen).
- Clipped headline.
- Wrong canvas size for the channel.
- Blank first frame (images not preloaded).
