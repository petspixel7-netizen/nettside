#!/usr/bin/env python3
"""Render the committed example offline (no scraping, no LLM).

Generates solid-color placeholder assets (pure-python PNG, no Pillow needed) if
they are missing, then renders index.html from the example JSON via the engine
template. Proves the render target works end-to-end.

    python scripts/render_example.py
"""
from __future__ import annotations

import json
import struct
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from engine.renderer.render import render_html  # noqa: E402

EX = ROOT / "examples" / "bella-trattoria"
ASSETS = EX / "assets"

# scene/asset -> RGB placeholder color (warm restaurant palette)
PLACEHOLDERS = {
    "logo.png": (246, 241, 231),
    "pasta-hero.jpg": (60, 42, 30),
    "interior.jpg": (40, 28, 22),
    "pizza.jpg": (107, 31, 42),
    "dessert.jpg": (138, 90, 59),
    "chef.jpg": (26, 20, 17),
}


def _png(path: Path, rgb: tuple[int, int, int], w: int = 1080, h: int = 1350) -> None:
    """Write a minimal solid-color PNG without Pillow."""
    row = b"\x00" + bytes(rgb) * w
    raw = row * h

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
           + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))
    path.write_bytes(png)


def ensure_placeholders() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    for name, rgb in PLACEHOLDERS.items():
        p = ASSETS / name
        if not p.exists():
            _png(p, rgb)  # PNG bytes; browsers sniff content for <img> regardless of ext
            print(f"  placeholder: {p.relative_to(ROOT)}")


def main() -> int:
    ensure_placeholders()
    scene_plan = json.loads((EX / "scene_plan.json").read_text())
    visual = json.loads((EX / "visual_direction.json").read_text())
    brand = json.loads((EX / "brand_profile.json").read_text())
    cfg = json.loads((EX / "render_config.json").read_text())
    out = render_html(scene_plan, visual, brand, cfg, project_dir=EX,
                      output_dir=EX, preview=False)
    print(f"\n✔ Rendered {out.relative_to(ROOT)}")
    print("  Open it and press F11. Duration:", scene_plan["duration"], "s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
