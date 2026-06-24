# Skill: offer-analysis

**File:** `skills/offer-analysis.md`
**Purpose:** Distil what the business actually sells and why someone should buy
now — the offer, the proof, and the single strongest CTA.
**Used in:** Pipeline step 4, feeding `brief.json` (`engine/planner/brief.py`).

## Input
- `extracted.json`: services[], prices[], ctas[], jsonld (ratings, address,
  openingHours), socials.
- `industries.json[style]` for defaults when the site is thin.

## Output (merged into brief.json)
- `offer`: the headline thing they get (≤80 chars).
- `proof[]`: up to 3 trust signals, ranked.
- `cta{text,href}`: the single best call to action.
- `key_facts{services,prices,phone,socials}`.

## Method
1. **Offer:** the most prominent service/product (first H2/service), phrased as a
   benefit. If prices exist, the offer may anchor to "fra {price}".
2. **Proof ranking** (strongest first):
   `aggregateRating ★` > years-in-business > certifications/guarantee >
   transparent pricing > active socials > "lokal/etablert".
   Use only signals found on the site.
3. **CTA selection:** pick the action verb closest to conversion present on site
   (bestill bord > book time > be om tilbud > ta kontakt). Keep its real href.
4. **Hours/location:** pull from JSON-LD `LocalBusiness` if present.

## Quality rules
- Exactly ONE primary CTA in the film. No "ring ELLER book ELLER besøk".
- Every proof point must be traceable to the site (no invented review counts).
- Offer is a benefit, not a feature list.
- If no price on site, do not invent one ("fra 199,-").

## Common failures to prevent
- Listing 8 services as the offer (paralysis). Lead with one, hint at breadth.
- Using a generic CTA when a specific one exists ("les mer" when "bestill bord" exists).
- Fabricating ratings/awards.
