# Skill: brand-research

**File:** `skills/brand-research.md`
**Purpose:** Turn a raw website into a verified brand profile (identity, colors,
fonts, tone, taglines) using ONLY facts present on the site.
**Used in:** Pipeline step 3a (`engine/analyzer/brand.py`); optionally LLM-enhanced.

## Input
- `extracted.json` (from scraper): title, meta, jsonld, headings, computed styles.
- Raw HTML (for color/font mining).
- `--style` hint.

## Output — `brand_profile.json`
Name, `colors{primary,accent,ink,paper,palette}`, `fonts{heading,body,fallbacks}`,
`tone`, `tagline`, `confidence{}`. See `engine/schemas/brand_profile.schema.json`.

## Method (deterministic, then optional LLM polish)
1. **Name:** `<title>` before the first `|`/`–`, cross-checked with OG site_name
   and JSON-LD `Organization.name`.
2. **Colors:** mine hex + rgb() from inline styles, `<style>`, linked CSS and
   computed styles of `body/h1/button`. Drop pure black/white. Rank by
   `saturation × mid-luminance` → primary; pick a contrasting one → accent.
   Choose a near-black `ink` and a warm off-white `paper` (never pure #fff/#000).
3. **Fonts:** parse `font-family` declarations + computed `h1`/`body` font.
   First family = heading, second = body. Always attach web-safe fallbacks.
4. **Tone:** infer from industry + headings + presence of words like
   "premium/eksklusiv". Output 3 adjectives.
5. **Tagline:** OG description or hero subline, ≤140 chars.

## Quality rules
- Brand colors must come from the site. If <3 colors found, set
  `confidence.colors="low"` and fall back to an industry-safe premium palette
  (see fallbacks) — never invent neon.
- `paper` ≠ `#ffffff`, `ink` ≠ `#000000` (premium screens use warm off-tones).
- Heading font must always have a serif/sans fallback so the film renders even
  if the brand font fails to load.
- Tone must be ≤3 adjectives, no marketing fluff.

## Common failures to prevent
- Picking the cookie-banner / Bootstrap blue as "primary".
- Treating icon-font `font-family` (FontAwesome) as the brand font → ignore
  families containing "icon", "fa", "material".
- Inventing a tagline not on the site.
- Pure #000/#fff palette that looks like default AI-slop.

## Fallback palette (when confidence low)
`primary #1c1c1c · accent #c9a36a (warm brass) · ink #141414 · paper #f6f3ee`.
