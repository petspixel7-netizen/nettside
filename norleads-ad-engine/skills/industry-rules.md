# Skill: industry-rules

**File:** `skills/industry-rules.md`
**Purpose:** Per-industry playbooks: hooks, trust signals, asset priorities, CTA,
motion style, copy tone, and what to avoid. Machine source: `data/industries.json`.
**Used in:** brief, scene-planner, motion-director, visual-style-director.

## How to use
The `--style` flag selects a playbook key. Unknown styles → `local-service`.
Each playbook supplies: `audience, hooks[], problem, default_offer, default_cta,
trust[], prioritize_assets[], avoid[], motion_style, metaphor, tone`.

## The 10 v1 playbooks (summary — full data in industries.json)

| Style       | Motion style       | Metaphor (one continuous idea)            | Avoid (top) |
|-------------|--------------------|-------------------------------------------|-------------|
| restaurant  | warm-push-in       | råvare → servert tallerken                | stock-mat, neon |
| handverker  | solid-build        | bygg som reiser seg lag for lag           | stock-verktøy, AI-hus |
| klinikk     | calm-glide         | rolig panorering gjennom lys klinikk      | sterile stock, kald blåtone |
| eiendom     | architectural-glide| kamerareise rom for rom                   | fisheye, overmettet HDR |
| trening     | kinetic-energy     | bevegelse som bygger tempo mot CTA        | urealistiske kropper |
| saas        | clean-ui-flow      | reise gjennom produktets skjermer         | tech-stock, 3d-blobs |
| nettbutikk  | product-spotlight  | produktet i kontinuerlig kamerafokus      | rotete kollasj, neon sale |
| bil         | precision-glide    | kamera rundt og inn i bilen/verkstedet    | stock-sportsbil |
| beauty      | soft-glow-glide    | myk kamerabevegelse gjennom behandlingen  | overfiltrerte AI-ansikter |
| local-service | continuous-push  | kamerabevegelse gjennom merkevaren        | clipart, floskler |

## Quality rules
- Always pull hooks/trust/CTA from the playbook, then localize with real facts.
- `prioritize_assets` orders which scraped images fill which scenes.
- `avoid` feeds both copywriter (no clichés) and visual-style (no forbidden looks).
- The `metaphor` is mandatory input to motion-director — it prevents slideshows.

## Extending (modularity)
Add a new industry by appending a key to `industries.json` with the same shape.
No code change required. Add channel-specific overrides under an optional
`channels` sub-key if a vertical needs different pacing.

## Common failures to prevent
- Generic hooks ignoring the vertical ("Velkommen til oss!").
- Using restaurant warmth grade on a clinic (should be calm/clean).
- Ignoring the industry metaphor → reverting to card slideshow.
