"""Step 2: extract structured facts from fetched HTML.

Pulls: title, meta/OG, JSON-LD (schema.org), logo/favicon, images, headings,
CTA candidates, services, prices, phone/email, address/hours, socials.
Output is a plain dict written to extracted.json (raw, unscored).
"""
from __future__ import annotations

import json
import re
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

PHONE_RE = re.compile(r"(?:\+?\d[\d\s]{6,}\d)")
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PRICE_RE = re.compile(r"(?:kr|NOK| kr)\s?\d[\d\s.,]*|\d[\d\s.,]*\s?(?:kr|,-|NOK)")
SOCIAL_HOSTS = ("facebook.com", "instagram.com", "tiktok.com", "youtube.com",
                "linkedin.com", "x.com", "twitter.com")
CTA_WORDS = ("bestill", "book", "kontakt", "ring", "kjøp", "bestill bord",
             "get", "start", "prøv", "meld", "registrer", "se mer", "les mer")


def _abs(base: str, href: str | None) -> str | None:
    if not href:
        return None
    return urljoin(base, href)


def _jsonld(soup: BeautifulSoup) -> list[dict]:
    out = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "{}")
            out.extend(data if isinstance(data, list) else [data])
        except Exception:
            continue
    return out


def _meta(soup: BeautifulSoup) -> dict:
    m = {}
    for tag in soup.find_all("meta"):
        key = tag.get("property") or tag.get("name")
        if key and tag.get("content"):
            m[key.lower()] = tag["content"]
    return m


def _logo(soup: BeautifulSoup, base: str, meta: dict) -> dict:
    candidates = []
    for img in soup.find_all("img"):
        alt = (img.get("alt") or "").lower()
        src = img.get("src") or img.get("data-src") or ""
        cls = " ".join(img.get("class") or []).lower()
        score = 0
        if "logo" in alt or "logo" in cls or "logo" in src.lower():
            score += 5
        if img.find_parent("header") or img.find_parent(class_=re.compile("header|nav|brand", re.I)):
            score += 3
        if score:
            candidates.append((score, _abs(base, src)))
    candidates.sort(reverse=True, key=lambda x: x[0])
    favicon = None
    for link in soup.find_all("link", rel=True):
        rels = " ".join(link.get("rel")).lower()
        if "icon" in rels or "apple-touch" in rels:
            favicon = _abs(base, link.get("href"))
            break
    return {
        "logo_url": candidates[0][1] if candidates else None,
        "logo_candidates": [c[1] for c in candidates[:5]],
        "favicon": favicon,
        "og_image": meta.get("og:image"),
    }


def _images(soup: BeautifulSoup, base: str) -> list[dict]:
    seen, out = set(), []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        url = _abs(base, src)
        if not url or url in seen or url.endswith(".svg"):
            continue
        seen.add(url)
        out.append({
            "url": url,
            "alt": img.get("alt") or "",
            "width": img.get("width"), "height": img.get("height"),
            "in_hero": bool(img.find_parent(class_=re.compile("hero|banner|jumbotron|cover", re.I))),
        })
    # background-image in inline styles
    for el in soup.find_all(style=re.compile("background", re.I)):
        m = re.search(r"url\(['\"]?(.*?)['\"]?\)", el.get("style", ""))
        if m:
            url = _abs(base, m.group(1))
            if url and url not in seen:
                seen.add(url)
                out.append({"url": url, "alt": "", "background": True,
                            "in_hero": "hero" in (el.get("class") or [""])[0].lower()})
    return out


def _services(soup: BeautifulSoup) -> list[str]:
    items = []
    for sel in ["h2", "h3", "li"]:
        for el in soup.find_all(sel):
            t = el.get_text(" ", strip=True)
            if 3 <= len(t) <= 60 and not PHONE_RE.search(t):
                items.append(t)
    # dedupe preserving order
    seen, out = set(), []
    for t in items:
        k = t.lower()
        if k not in seen:
            seen.add(k)
            out.append(t)
    return out[:40]


def _ctas(soup: BeautifulSoup, base: str) -> list[dict]:
    out = []
    for el in soup.find_all(["a", "button"]):
        t = el.get_text(" ", strip=True).lower()
        if any(w in t for w in CTA_WORDS) and len(t) < 40:
            out.append({"text": el.get_text(" ", strip=True),
                        "href": _abs(base, el.get("href"))})
    return out[:10]


def _socials(soup: BeautifulSoup, base: str) -> dict:
    found = {}
    for a in soup.find_all("a", href=True):
        href = a["href"]
        for host in SOCIAL_HOSTS:
            if host in href:
                found[host.split(".")[0]] = href
    return found


def extract_site(fetched: dict, url: str) -> dict:
    html = fetched.get("html", "")
    soup = BeautifulSoup(html, "lxml")
    base = url
    meta = _meta(soup)
    text = soup.get_text(" ", strip=True)

    headings = [h.get_text(" ", strip=True)
                for h in soup.find_all(["h1", "h2"]) if h.get_text(strip=True)][:12]

    return {
        "url": url,
        "domain": urlparse(url).netloc,
        "title": (soup.title.string.strip() if soup.title and soup.title.string else meta.get("og:title", "")),
        "description": meta.get("og:description") or meta.get("description", ""),
        "meta": meta,
        "jsonld": _jsonld(soup),
        "headings": headings,
        **_logo(soup, base, meta),
        "images": _images(soup, base),
        "services": _services(soup),
        "ctas": _ctas(soup, base),
        "phones": list(dict.fromkeys(PHONE_RE.findall(text)))[:5],
        "emails": list(dict.fromkeys(EMAIL_RE.findall(text)))[:5],
        "prices": list(dict.fromkeys(PRICE_RE.findall(text)))[:10],
        "socials": _socials(soup, base),
        "computed": fetched.get("computed"),
        "engine": fetched.get("engine"),
    }
