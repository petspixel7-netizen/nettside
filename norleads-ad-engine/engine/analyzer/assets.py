"""Step 3b: download + score assets -> assets_manifest.json.

Scoring rules mirror skills/asset-extraction.md (section F of the brief).
Each asset gets a 0..1 score and a role (logo|hero|product|people|texture).
"""
from __future__ import annotations

import hashlib
from pathlib import Path

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def _download(url: str, dest_dir: Path) -> Path | None:
    import httpx
    try:
        with httpx.Client(follow_redirects=True, timeout=20,
                          headers={"User-Agent": UA}) as c:
            r = c.get(url)
            r.raise_for_status()
        ext = (url.split("?")[0].rsplit(".", 1)[-1] or "img")[:4]
        name = hashlib.sha1(url.encode()).hexdigest()[:12] + "." + ext
        path = dest_dir / name
        path.write_bytes(r.content)
        return path
    except Exception:
        return None


def _image_stats(path: Path) -> dict | None:
    try:
        from PIL import Image
        with Image.open(path) as im:
            w, h = im.size
            mode = im.mode
        return {"width": w, "height": h, "ratio": round(w / h, 3) if h else 0,
                "mp": round(w * h / 1_000_000, 2), "mode": mode}
    except Exception:
        return None


def _quality_score(stats: dict) -> float:
    if not stats:
        return 0.0
    s = 0.0
    s += min(stats["mp"] / 2.0, 1.0) * 0.5          # resolution
    if 0.4 <= stats["ratio"] <= 2.5:                 # not a sliver/banner
        s += 0.3
    if stats["width"] >= 800:
        s += 0.2
    return round(min(s, 1.0), 3)


def _role_and_relevance(img: dict, stats: dict | None, services: list[str]) -> tuple[str, float]:
    alt = (img.get("alt") or "").lower()
    if img.get("is_logo"):
        return "logo", 0.95
    if img.get("in_hero") or (stats and stats["ratio"] >= 1.6 and stats["mp"] >= 0.8):
        return "hero", 0.85
    if any(svc.lower() in alt for svc in services):
        return "product", 0.8
    if any(w in alt for w in ("team", "ansatt", "oss", "people", "staff", "portrait")):
        return "people", 0.7
    if stats and stats["mp"] < 0.15:
        return "texture", 0.2
    return "product", 0.5


def build_assets_manifest(extracted: dict, project_dir: Path) -> dict:
    assets_dir = project_dir / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    services = extracted.get("services", [])

    items: list[dict] = []
    seen_hashes: set[str] = set()

    # Logo first.
    logo_url = extracted.get("logo_url")
    queue = []
    if logo_url:
        queue.append({"url": logo_url, "is_logo": True, "alt": "logo"})
    for img in extracted.get("images", []):
        queue.append(img)

    for img in queue:
        url = img.get("url")
        if not url:
            continue
        path = _download(url, assets_dir)
        if not path:
            continue
        # dedupe by content hash
        digest = hashlib.sha1(path.read_bytes()).hexdigest()
        if digest in seen_hashes:
            path.unlink(missing_ok=True)
            continue
        seen_hashes.add(digest)

        stats = _image_stats(path)
        role, relevance = _role_and_relevance(img, stats, services)
        quality = _quality_score(stats)
        crop_safe = bool(stats and 0.5 <= stats["ratio"] <= 2.0)
        score = round(0.5 * quality + 0.5 * relevance, 3)

        items.append({
            "source_url": url,
            "local_path": str(path.relative_to(project_dir)),
            "role": role,
            "alt": img.get("alt", ""),
            "stats": stats,
            "quality": quality,
            "relevance": relevance,
            "crop_safe": crop_safe,
            "score": score,
        })

    items.sort(key=lambda a: a["score"], reverse=True)

    def best(role: str) -> dict | None:
        cand = [a for a in items if a["role"] == role]
        return cand[0] if cand else None

    heroes = [a for a in items if a["role"] in ("hero", "product") and a["score"] >= 0.4][:6]

    return {
        "domain": extracted.get("domain"),
        "count": len(items),
        "logo": best("logo"),
        "hero": best("hero") or (heroes[0] if heroes else None),
        "heroes": heroes,
        "people": [a for a in items if a["role"] == "people"][:3],
        "all": items,
        "warnings": _warnings(items),
    }


def _warnings(items: list[dict]) -> list[str]:
    w = []
    if not any(a["role"] == "logo" for a in items):
        w.append("no_logo_found")
    if not any(a["role"] in ("hero", "product") and a["score"] >= 0.5 for a in items):
        w.append("no_strong_hero_image")
    if len(items) < 3:
        w.append("few_assets")
    return w
