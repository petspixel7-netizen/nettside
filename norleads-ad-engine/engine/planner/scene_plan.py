"""Step 5: build scene_plan.json from brief + timing recipe + industry motion."""
from __future__ import annotations

from ..config import load_data


def build_scene_plan(brief: dict, timing: dict, brand: dict, assets: dict,
                     fmt: str) -> dict:
    channel = load_data("channels.json")["channels"].get(fmt, {})
    ind = load_data("industries.json").get(brief["industry"], {})
    motion_style = ind.get("motion_style", "continuous-push")

    hero = assets.get("hero")
    heroes = assets.get("heroes", []) or ([hero] if hero else [])
    logo = assets.get("logo")

    scenes = []
    cursor = 0.0
    recipe_scenes = timing["scenes"]
    text_limit = channel.get("text_limit_chars", 42)

    for i, rs in enumerate(recipe_scenes):
        role = rs["role"]  # hook|context|offer|proof|cta
        img = _pick_image(role, i, heroes, hero)
        copy = _copy_for(role, brief, text_limit)
        scenes.append({
            "index": i,
            "role": role,
            "start": round(cursor, 2),
            "seconds": rs["seconds"],
            "end": round(cursor + rs["seconds"], 2),
            "copy": copy,
            "image": img["local_path"] if img else None,
            "logo": logo["local_path"] if (logo and role in ("hook", "cta")) else None,
            "motion": _motion_for(role, motion_style),
            "treatment": rs.get("treatment", "duotone-ish editorial grade"),
        })
        cursor += rs["seconds"]

    return {
        "business_name": brief["business_name"],
        "format": fmt,
        "duration": round(cursor, 2),
        "fps_target": 60,
        "metaphor": ind.get("metaphor", "one continuous camera push through the brand"),
        "transition_style": "match-cut / shared-element, never hard slide",
        "scene_count": len(scenes),
        "scenes": scenes,
        "palette": brand["colors"],
        "fonts": brand["fonts"],
    }


def _pick_image(role: str, i: int, heroes: list, hero) -> dict | None:
    if not heroes:
        return hero
    return heroes[i % len(heroes)]


def _copy_for(role: str, brief: dict, limit: int) -> dict:
    def clamp(s: str) -> str:
        return s if len(s) <= limit else s[: limit - 1].rstrip() + "…"

    if role == "hook":
        return {"kicker": brief["industry"].upper(), "headline": clamp(brief["hook"]), "sub": ""}
    if role == "context":
        return {"kicker": "", "headline": clamp(brief["problem"]), "sub": ""}
    if role == "offer":
        return {"kicker": "DETTE FÅR DU", "headline": clamp(brief["offer"]),
                "sub": ", ".join(brief["key_facts"]["services"][:3])}
    if role == "proof":
        return {"kicker": "", "headline": clamp(" · ".join(brief["proof"])), "sub": ""}
    if role == "cta":
        return {"kicker": brief["business_name"], "headline": clamp(brief["cta"]["text"]),
                "sub": brief.get("location") or brief["key_facts"].get("phone") or ""}
    return {"kicker": "", "headline": "", "sub": ""}


def _motion_for(role: str, style: str) -> dict:
    base = {
        "hook": {"camera": "slow push-in", "type_in": "mask-reveal up", "image": "ken-burns 1.0->1.08"},
        "context": {"camera": "lateral drift", "type_in": "line-by-line clip", "image": "parallax bg"},
        "offer": {"camera": "rack-focus to product", "type_in": "stagger up", "image": "scale 1.1->1.0"},
        "proof": {"camera": "settle", "type_in": "count-up / fade", "image": "subtle drift"},
        "cta": {"camera": "pull to logo", "type_in": "logo draw + clamp", "image": "vignette focus"},
    }
    m = base.get(role, base["context"])
    m["style"] = style
    return m
