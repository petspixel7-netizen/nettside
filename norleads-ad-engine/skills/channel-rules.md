# Skill: channel-rules

**File:** `skills/channel-rules.md`
**Purpose:** Enforce correct canvas, safe margins, text limits, pacing and CTA
timing per channel. The machine-readable source of truth is `data/channels.json`;
this file explains and constrains it.
**Used in:** scene-planner, renderer, QA.

## Canvas + safe areas (px / fractions of canvas)

| Channel        | Canvas      | Aspect | Safe top | Safe bottom | Text limit | Pacing | CTA at |
|----------------|-------------|--------|----------|-------------|-----------|--------|--------|
| reels          | 1080×1920   | 9:16   | 14%      | 20%         | 42        | 3.0s   | 82%    |
| tiktok         | 1080×1920   | 9:16   | 12%      | 24%         | 40        | 2.6s   | 80%    |
| shorts         | 1080×1920   | 9:16   | 10%      | 22%         | 42        | 2.8s   | 82%    |
| story          | 1080×1920   | 9:16   | 16%      | 16%         | 38        | 3.2s   | 85%    |
| feed           | 1080×1350   | 4:5    | 8%       | 10%         | 44        | 3.4s   | 82%    |
| square         | 1080×1080   | 1:1    | 8%       | 10%         | 40        | 3.2s   | 82%    |
| website-hero   | 1920×1080   | 16:9   | 10%      | 12%         | 56        | 4.0s   | 80%    |
| signage        | 1920×1080   | 16:9   | 8%       | 8%          | 50        | 4.5s   | 85%    |

## Why the bottom safe areas differ
TikTok/Reels overlay UI (caption, buttons) on the lower-right. Keep CTA text out
of the bottom 20–24% on those channels. Signage has no platform UI → minimal margins.

## Pacing rule
`scene_count ≈ round(duration / pacing)`. Faster channels (TikTok) = more, shorter
scenes. Slower (signage/web hero) = fewer, longer, more cinematic scenes.

## CTA timing rule
CTA scene must START at `cta_at × duration` (±5%) and remain on screen to the end.
Logo + CTA + location/phone must all be readable in the final 3 seconds.

## Duration structure (defaults pulled from durations.json)
hook → context → offer → proof → (offer) → cta. Short formats drop context/proof.

## Quality rules
- Never place text inside the platform UI safe zone for that channel.
- Headline must fit `text_limit_chars` on ONE line at the defined type scale.
- Output canvas must exactly equal the channel canvas (QA checks pixel size).

## Common failures to prevent
- Building 9:16 content at 16:9 then letterboxing.
- CTA appearing for <2s or behind the TikTok button zone.
- Text limit ignored → overflow/clip.
