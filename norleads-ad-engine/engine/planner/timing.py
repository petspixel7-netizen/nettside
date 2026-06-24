"""Step: duration -> scene timing recipe (reads data/durations.json)."""
from __future__ import annotations

from ..config import load_data


def timing_recipe(duration: int) -> dict:
    recipes = load_data("durations.json")["recipes"]
    key = str(duration)
    if key in recipes:
        return recipes[key]
    # Nearest known duration as fallback.
    known = sorted(int(k) for k in recipes)
    nearest = min(known, key=lambda k: abs(k - duration))
    recipe = dict(recipes[str(nearest)])
    recipe["_scaled_from"] = nearest
    recipe["_requested"] = duration
    # Linear rescale of scene seconds to hit requested duration.
    factor = duration / nearest
    for sc in recipe["scenes"]:
        sc["seconds"] = round(sc["seconds"] * factor, 2)
    return recipe
