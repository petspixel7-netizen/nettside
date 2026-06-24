"""Step 7: render still PNG previews per scene (Playwright).

Loads index.html with ?seek=<t>&still=1, which freezes the timeline at the
midpoint of each scene, then screenshots. No-op (returns []) if Playwright
is unavailable.
"""
from __future__ import annotations

from pathlib import Path


def render_frames(index_html: Path, scene_plan: dict, output_dir: Path) -> list[str]:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        return []
    frames_dir = output_dir / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)
    canvas_w = scene_plan.get("_canvas_w", 1080)
    canvas_h = scene_plan.get("_canvas_h", 1920)
    out = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_context(
                viewport={"width": canvas_w, "height": canvas_h},
                device_scale_factor=2,
            ).new_page()
            for s in scene_plan["scenes"]:
                mid = s["start"] + s["seconds"] / 2
                page.goto(f"file://{index_html}?still=1&seek={mid}", wait_until="networkidle")
                page.wait_for_timeout(400)
                fp = frames_dir / f"scene-{s['index']:02d}-{s['role']}.png"
                page.screenshot(path=str(fp))
                out.append(str(fp.relative_to(output_dir)))
            browser.close()
    except Exception:
        return out
    return out
