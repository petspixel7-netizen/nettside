"""Step 1: fetch HTML (+ screenshot when Playwright available).

Strategy:
  1. Try Playwright (renders JS, captures full-page screenshot, computed styles).
  2. Fall back to httpx (static HTML) if Playwright is missing or fails.

Returns a dict and writes raw.html / screenshot.png into project_dir.
"""
from __future__ import annotations

from pathlib import Path

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def _fetch_playwright(url: str, project_dir: Path) -> dict | None:
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        return None
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            ctx = browser.new_context(user_agent=UA, viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            page.goto(url, wait_until="networkidle", timeout=30000)
            html = page.content()
            (project_dir / "raw.html").write_text(html, encoding="utf-8")
            page.screenshot(path=str(project_dir / "screenshot.png"), full_page=True)
            # Computed colors/fonts of key elements help brand analysis.
            computed = page.evaluate(
                """() => {
                  const pick = (el) => el ? getComputedStyle(el) : null;
                  const grab = (s) => { const c = pick(s); return c ? {
                    color: c.color, bg: c.backgroundColor, font: c.fontFamily,
                  } : null; };
                  return {
                    body: grab(document.body),
                    h1: grab(document.querySelector('h1')),
                    btn: grab(document.querySelector('button, .btn, a.button, [class*=cta]')),
                    title: document.title,
                  };
                }"""
            )
            browser.close()
            return {"html": html, "computed": computed, "engine": "playwright",
                    "screenshot": str(project_dir / "screenshot.png")}
    except Exception as e:  # pragma: no cover
        return {"error": str(e), "engine": "playwright-failed"}


def _fetch_httpx(url: str, project_dir: Path) -> dict:
    import httpx
    with httpx.Client(follow_redirects=True, timeout=30,
                      headers={"User-Agent": UA}) as client:
        r = client.get(url)
        r.raise_for_status()
        html = r.text
    (project_dir / "raw.html").write_text(html, encoding="utf-8")
    return {"html": html, "computed": None, "engine": "httpx", "screenshot": None}


def fetch_site(url: str, project_dir: Path) -> dict:
    project_dir.mkdir(parents=True, exist_ok=True)
    res = _fetch_playwright(url, project_dir)
    if res and "html" in res:
        return res
    # Playwright missing or failed -> static fallback (still useful).
    try:
        return _fetch_httpx(url, project_dir)
    except Exception as e:
        raise RuntimeError(f"fetch failed for {url}: {e}") from e
