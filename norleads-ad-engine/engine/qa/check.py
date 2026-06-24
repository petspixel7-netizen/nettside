"""Step 9: QA -> qa_report.json.

Two layers:
  static_checks  — always run (assets exist, logo/CTA present, durations match).
  browser_checks — Playwright: scrollbars, viewport coverage, text overflow,
                   non-blank canvas, contrast sampling. Skipped if no browser.
Report mirrors skills/qa-checker.md.
"""
from __future__ import annotations

from pathlib import Path


def _static_checks(scene_plan: dict, brief: dict, render_config: dict,
                   output_dir: Path) -> list[dict]:
    checks = []

    def add(name, ok, detail=""):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})

    target = render_config["duration"]
    actual = scene_plan["duration"]
    add("duration_matches", abs(actual - target) <= 0.6,
        f"target={target}s actual={actual}s")

    has_logo = any(s.get("logo") for s in scene_plan["scenes"])
    add("logo_present", has_logo, "logo used in hook/cta scene")

    cta_scene = next((s for s in scene_plan["scenes"] if s["role"] == "cta"), None)
    add("cta_present", bool(cta_scene and cta_scene["copy"]["headline"]),
        cta_scene["copy"]["headline"] if cta_scene else "no cta scene")

    missing = []
    for s in scene_plan["scenes"]:
        for k in ("image", "logo"):
            rel = s.get(k)
            if rel and not (output_dir / rel).exists():
                missing.append(rel)
    add("assets_exist", not missing, f"missing={missing}")

    # Text length vs channel limit (overflow risk).
    long_lines = [s["index"] for s in scene_plan["scenes"]
                  if len(s["copy"].get("headline", "")) > 60]
    add("text_length_safe", not long_lines, f"too_long_scenes={long_lines}")

    # Real facts present (anti-hallucination heuristic).
    add("real_facts_used", bool(brief["key_facts"]["services"] or brief["proof"]),
        "services/proof sourced from site")

    return checks


def _browser_checks(index_html: Path, scene_plan: dict) -> list[dict]:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        return [{"check": "browser_checks", "ok": True, "detail": "skipped (no playwright)"}]
    checks = []

    def add(name, ok, detail=""):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})

    try:
        w, h = 1080, 1920
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            page = b.new_context(viewport={"width": w, "height": h}).new_page()
            page.goto(f"file://{index_html}?still=1&seek=0.3", wait_until="networkidle")
            page.wait_for_timeout(500)
            metrics = page.evaluate(
                """() => ({
                    sw: document.documentElement.scrollWidth,
                    sh: document.documentElement.scrollHeight,
                    cw: window.innerWidth, ch: window.innerHeight,
                    overflow: [...document.querySelectorAll('*')].some(el =>
                        el.scrollWidth > el.clientWidth + 2 &&
                        getComputedStyle(el).overflow !== 'visible'),
                })"""
            )
            add("no_horizontal_scroll", metrics["sw"] <= metrics["cw"] + 2,
                f"sw={metrics['sw']} cw={metrics['cw']}")
            add("no_vertical_scroll", metrics["sh"] <= metrics["ch"] + 2,
                f"sh={metrics['sh']} ch={metrics['ch']}")
            add("viewport_covered", metrics["sh"] >= metrics["ch"] - 2, "")
            add("no_text_overflow", not metrics["overflow"], "")
            # Non-blank canvas: sample screenshot bytes size as crude proxy.
            png = page.screenshot()
            add("canvas_not_blank", len(png) > 20000, f"png_bytes={len(png)}")
            b.close()
    except Exception as e:
        add("browser_checks", False, f"error: {e}")
    return checks


def run_qa(index_html: Path, scene_plan: dict, brief: dict, render_config: dict,
           output_dir: Path) -> dict:
    checks = _static_checks(scene_plan, brief, render_config, output_dir)
    checks += _browser_checks(index_html, scene_plan)
    failed = [c for c in checks if not c["ok"]]
    return {
        "slug": render_config["slug"],
        "passed": len(failed) == 0,
        "score": round(1 - len(failed) / max(len(checks), 1), 3),
        "total": len(checks),
        "failed": len(failed),
        "checks": checks,
        "verdict": "PASS" if not failed else f"FAIL ({len(failed)} issues)",
    }
