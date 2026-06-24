"""Dependency-light unit tests (run: python -m pytest -q).

Covers the deterministic core that needs no network/Pillow/Playwright. See
CODEX_INSTRUCTIONS.md for the full intended test matrix.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from engine.config import slugify, RenderConfig
from engine.planner.timing import timing_recipe


def test_slugify_strips_scheme_and_path():
    assert slugify("https://www.bellatrattoria.no/meny") == "bellatrattoria-no"
    assert slugify("http://bedrift.no") == "bedrift-no"


def test_render_config_slug():
    cfg = RenderConfig(url="https://bedrift.no", format="reels", duration=40)
    assert cfg.slug == "bedrift-no-reels-40s"


def test_timing_known_duration_sums():
    r = timing_recipe(40)
    total = sum(s["seconds"] for s in r["scenes"])
    assert abs(total - 40) < 0.01
    assert r["scenes"][0]["role"] == "hook"
    assert r["scenes"][-1]["role"] == "cta"


def test_timing_unknown_duration_rescales_to_target():
    r = timing_recipe(25)  # not a known recipe
    total = sum(s["seconds"] for s in r["scenes"])
    assert abs(total - 25) < 0.5
    assert r["_requested"] == 25


def test_color_ranking_ignores_pure_bw():
    from engine.analyzer.brand import _colors_from_html
    html = "<style>a{color:#000}b{color:#fff}c{color:#6b1f2a}</style>"
    colors = _colors_from_html(html)
    assert "#6b1f2a" in colors
    assert "#000000" not in colors and "#ffffff" not in colors


def test_scene_plan_contiguous_and_sums():
    import json
    sp = json.loads((Path(__file__).resolve().parent.parent /
                     "examples/bella-trattoria/scene_plan.json").read_text())
    scenes = sp["scenes"]
    for a, b in zip(scenes, scenes[1:]):
        assert abs(a["end"] - b["start"]) < 0.01
    assert abs(scenes[-1]["end"] - sp["duration"]) < 0.01
    assert sp["scene_count"] == len(scenes)
    assert scenes[-1]["role"] == "cta"
