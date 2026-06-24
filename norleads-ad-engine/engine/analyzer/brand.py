"""Step 3a: derive brand_profile.json (colors, fonts, tone)."""
from __future__ import annotations

import re
from collections import Counter

HEX_RE = re.compile(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")
RGB_RE = re.compile(r"rgba?\(([^)]+)\)")
FONT_RE = re.compile(r"font-family\s*:\s*([^;}{]+)", re.I)

# Colors we never treat as brand colors (pure black/white/grey noise).
_NEUTRAL = {"#fff", "#ffffff", "#000", "#000000"}


def _norm_hex(h: str) -> str:
    h = h.lower()
    if len(h) == 4:  # #abc -> #aabbcc
        h = "#" + "".join(c * 2 for c in h[1:])
    return h


def _rgb_to_hex(triplet: str) -> str | None:
    parts = [p.strip() for p in triplet.split(",")]
    try:
        r, g, b = (int(float(parts[i])) for i in range(3))
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:
        return None


def _luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _saturation(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return max(r, g, b) - min(r, g, b)


def _colors_from_html(html: str) -> list[str]:
    found = Counter()
    for m in HEX_RE.findall(html):
        c = _norm_hex(m)
        if c not in _NEUTRAL:
            found[c] += 1
    for m in RGB_RE.findall(html):
        c = _rgb_to_hex(m)
        if c and c not in _NEUTRAL:
            found[c] += 1
    return [c for c, _ in found.most_common(20)]


def _fonts_from_html(html: str) -> list[str]:
    fonts = Counter()
    for m in FONT_RE.findall(html):
        fam = m.split(",")[0].strip().strip("'\"")
        if fam and fam.lower() not in ("inherit", "initial"):
            fonts[fam] += 1
    return [f for f, _ in fonts.most_common(5)]


def build_brand_profile(extracted: dict, html: str, style: str) -> dict:
    colors = _colors_from_html(html)
    # Prefer saturated, mid-luminance colors as the accent/primary.
    ranked = sorted(colors, key=lambda c: (_saturation(c), 0.5 - abs(_luminance(c) - 0.45)),
                    reverse=True)
    primary = ranked[0] if ranked else "#1a1a1a"
    accent = next((c for c in ranked[1:] if abs(_luminance(c) - _luminance(primary)) > 0.1),
                  ranked[1] if len(ranked) > 1 else "#c9a36a")
    # Pick ink/paper for premium contrast (dark ink on light, or inverse).
    darks = [c for c in colors if _luminance(c) < 0.25]
    ink = darks[0] if darks else "#141414"
    paper = "#f6f3ee"  # warm off-white default; premium, not pure #fff

    computed = extracted.get("computed") or {}
    fonts = _fonts_from_html(html)
    if computed.get("h1", {}).get("font"):
        fonts.insert(0, computed["h1"]["font"].split(",")[0].strip().strip("'\""))

    return {
        "domain": extracted.get("domain"),
        "name": (extracted.get("title") or "").split("|")[0].split("–")[0].strip(),
        "colors": {
            "primary": primary,
            "accent": accent,
            "ink": ink,
            "paper": paper,
            "palette": colors[:8],
        },
        "fonts": {
            "heading": fonts[0] if fonts else "Playfair Display",
            "body": fonts[1] if len(fonts) > 1 else "Inter",
            "fallback_heading": "Georgia, 'Times New Roman', serif",
            "fallback_body": "-apple-system, Segoe UI, Roboto, sans-serif",
            "detected": fonts,
        },
        "tone": _infer_tone(extracted, style),
        "tagline": extracted.get("description", "")[:140],
        "confidence": {
            "colors": "high" if len(colors) >= 3 else "low",
            "fonts": "high" if fonts else "low",
        },
    }


def _infer_tone(extracted: dict, style: str) -> str:
    text = " ".join(extracted.get("headings", [])).lower()
    if style in ("restaurant", "beauty"):
        return "warm, sensory, inviting"
    if style in ("saas",):
        return "clear, confident, modern"
    if style in ("klinikk",):
        return "calm, trustworthy, precise"
    if any(w in text for w in ("premium", "eksklusiv", "luksus")):
        return "premium, understated, confident"
    return "professional, local, trustworthy"
