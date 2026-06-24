"""Step 6: build visual_direction.json (grade, type scale, grain, look)."""
from __future__ import annotations


def build_visual_direction(scene_plan: dict, brand: dict, style: str, fmt: str) -> dict:
    palette = brand["colors"]
    return {
        "look": "premium editorial — restrained, real photography, no neon",
        "grade": {
            "base": "subtle contrast lift, warm shadows",
            "overlay": f"{palette['ink']} gradient 0->55% from bottom for text legibility",
            "duotone": False,
            "grain": {"enabled": True, "opacity": 0.05},
            "vignette": {"enabled": True, "strength": 0.25},
        },
        "type": {
            "heading_family": brand["fonts"]["heading"],
            "body_family": brand["fonts"]["body"],
            "scale": {"kicker": "1.6vw", "headline": "6.2vw", "sub": "2.4vw"},
            "tracking": {"kicker": "0.28em", "headline": "-0.01em"},
            "weight": {"kicker": 600, "headline": 600, "sub": 400},
            "case": {"kicker": "uppercase", "headline": "none"},
        },
        "color_roles": palette,
        "motion_feel": "weighty, eased (power3/expo), continuous — never linear slide",
        "transitions": "shared-element + masked wipes aligned to camera direction",
        "logo_treatment": "mono-knockout in paper color, max 18% canvas width",
        "image_treatment": "full-bleed, object-fit cover, ken-burns, focal-safe center",
        "forbidden": ["neon glow", "drop-shadow stacks", "rainbow gradients",
                       "spinning 3d cards", "emoji", "default bootstrap blue"],
        "per_scene": [
            {"index": s["index"], "role": s["role"],
             "text_anchor": "bottom-left" if s["role"] != "cta" else "center",
             "image": s["image"], "treatment": s["treatment"]}
            for s in scene_plan["scenes"]
        ],
    }
