"""Step 8: render index.html from base.html.j2 with embedded JSON.

The HTML is self-contained: GSAP from CDN, film.css + timeline.js inlined,
SCENE_PLAN + VISUAL embedded as JSON. Assets are copied next to index.html so
the folder is portable.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from ..config import TEMPLATES_DIR, load_data


def _canvas(fmt: str) -> dict:
    ch = load_data("channels.json")["channels"]
    return ch.get(fmt, ch["reels"])


def render_html(scene_plan: dict, visual: dict, brand: dict, render_config: dict,
                project_dir: Path, output_dir: Path, preview: bool = False) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    out_assets = output_dir / "assets"
    out_assets.mkdir(exist_ok=True)

    # Copy referenced assets into output folder, rewrite paths to assets/<name>.
    used = set()
    for s in scene_plan["scenes"]:
        for k in ("image", "logo"):
            if s.get(k):
                used.add(s[k])
    rewrite = {}
    for rel in used:
        src = project_dir / rel
        if src.exists():
            dst = out_assets / src.name
            if src.resolve() != dst.resolve():
                shutil.copy2(src, dst)
            rewrite[rel] = f"assets/{src.name}"
    for s in scene_plan["scenes"]:
        for k in ("image", "logo"):
            if s.get(k) in rewrite:
                s[k] = rewrite[s[k]]

    canvas = _canvas(scene_plan["format"])
    css = (TEMPLATES_DIR / "assets" / "film.css").read_text(encoding="utf-8")
    js = (TEMPLATES_DIR / "assets" / "timeline.js").read_text(encoding="utf-8")

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html"]),
    )
    tpl = env.get_template("base.html.j2")
    html = tpl.render(
        title=scene_plan["business_name"],
        canvas=canvas,
        css=css,
        js=js,
        scenes=scene_plan["scenes"],
        scene_plan_json=json.dumps(scene_plan, ensure_ascii=False),
        visual_json=json.dumps(visual, ensure_ascii=False),
        fonts=brand["fonts"],
        preview="true" if preview else "false",
    )
    out = output_dir / "index.html"
    out.write_text(html, encoding="utf-8")
    return out
