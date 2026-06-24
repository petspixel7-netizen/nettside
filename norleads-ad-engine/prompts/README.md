# Prompt templates

These are the prompts the engine sends when LLM enhancement is enabled
(`engine/llm.py`). Each pairs with a skill file (used as the system prompt) and
a JSON payload (the deterministic artifact). The LLM must return the **same JSON
shape**. Prompts are part of the workflow — not a replacement for it.

`{{...}}` = injected at runtime.

---

## 1. brand-research summary
**system:** `skills/brand-research.md`
**user:**
```
Here is extracted website data for {{domain}}:
{{extracted_json}}
Produce brand_profile.json. Use ONLY facts present. If colors/fonts are unclear,
set confidence low and use the premium fallback palette. Return JSON only.
```

## 2. brief generation
**system:** `skills/offer-analysis.md` + `skills/copywriter.md`
**user:**
```
Business: {{name}} | Industry: {{style}} | Channel: {{format}} {{duration}}s
Facts: {{key_facts_json}}  Industry playbook: {{industry_json}}
Write brief.json: audience, hook, problem, offer, proof[], cta. Norwegian,
concrete, no invented claims. Return JSON only.
```

## 3. scene plan generation
**system:** `skills/scene-planner.md` + `skills/channel-rules.md`
**user:**
```
brief={{brief_json}} timing={{timing_json}} assets={{assets_json}}
metaphor="{{metaphor}}" text_limit={{limit}}
Produce scene_plan.json. Contiguous timing summing to {{duration}}s. One metaphor,
shared-element transitions. Clamp copy to limit. Return JSON only.
```

## 4. motion direction
**system:** `skills/motion-director.md` + `skills/gsap-animation-rules.md`
**user:**
```
scene_plan={{scene_plan_json}} industry_motion="{{motion_style}}"
For each scene set motion{camera,type_in,image}. Continuous camera, no slideshow,
no neon. Return scene_plan.json with motion filled. JSON only.
```

## 5. visual direction
**system:** `skills/visual-style-director.md`
**user:**
```
scene_plan={{scene_plan_json}} brand={{brand_json}}
Produce visual_direction.json: grade, type, color_roles, treatments, forbidden[].
Premium editorial, real photography, restrained. JSON only.
```

## 6. HTML generation (only if not using the deterministic template)
**system:** `skills/html-film-builder.md` + `skills/gsap-animation-rules.md`
**user:**
```
scene_plan={{scene_plan_json}} visual={{visual_json}} canvas={{canvas}}
Generate ONE self-contained index.html: fullscreen, no UI, no scroll, cursor:none,
fixed #stage scaled to fit, one GSAP master timeline, window.timeline exposed,
?still=1&seek support. Return HTML only.
```
> Default path uses `templates/base.html.j2` (deterministic). Use this prompt only
> for bespoke one-off creative or when a template can't express the metaphor.

## 7. QA critique
**system:** `skills/qa-checker.md`
**user:**
```
qa_report={{qa_json}} scene_plan={{scene_plan_json}} (+ optional frame images)
List every failure and the smallest fix for each. Rank by severity. Flag any
generic/slideshow/neon look even if automated checks passed. Return JSON:
{issues:[{check,severity,fix}], premium_verdict}.
```

## 8. revision pass
**system:** the skill that owns the failing artifact
**user:**
```
Artifact={{artifact_json}} Issues={{issues_json}}
Apply the minimal fixes. Do not change anything not flagged. Keep facts real.
Return the corrected artifact JSON only.
```
