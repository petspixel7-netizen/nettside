"""Step 4: build brief.json (+ brief.md) from extracted facts + brand + industry."""
from __future__ import annotations

from ..config import load_data


def _industry(style: str) -> dict:
    book = load_data("industries.json")
    return book.get(style, book.get("local-service", {}))


def build_brief(extracted: dict, brand: dict, assets: dict, style: str,
                fmt: str, duration: int) -> dict:
    ind = _industry(style)
    name = brand.get("name") or extracted.get("domain", "")
    services = extracted.get("services", [])[:6]
    ctas = extracted.get("ctas", [])
    cta_text = ctas[0]["text"] if ctas else ind.get("default_cta", "Ta kontakt i dag")
    cta_href = ctas[0].get("href") if ctas else extracted.get("url")
    location = _first_location(extracted)
    proof = _proof(extracted)

    return {
        "business_name": name,
        "industry": style,
        "audience": ind.get("audience", "lokale kunder som søker en pålitelig leverandør"),
        "hook": _hook(ind, name, services),
        "problem": ind.get("problem", "Det er vanskelig å vite hvem man kan stole på."),
        "offer": _offer(services, extracted, ind),
        "proof": proof,
        "cta": {"text": cta_text, "href": cta_href},
        "location": location,
        "tone": brand.get("tone"),
        "channel": {"format": fmt, "duration": duration},
        "key_facts": {
            "services": services,
            "prices": extracted.get("prices", [])[:3],
            "phone": (extracted.get("phones") or [None])[0],
            "socials": extracted.get("socials", {}),
        },
        "must_use_assets": _must_use(assets),
        "avoid": ind.get("avoid", ["generic stock-look", "neon glow", "overfylt tekst"]),
    }


def _hook(ind: dict, name: str, services: list[str]) -> str:
    hooks = ind.get("hooks") or []
    if hooks:
        return hooks[0].replace("{name}", name).replace(
            "{service}", services[0] if services else "tjenesten")
    return f"{name} — kvalitet du kjenner igjen."


def _offer(services: list[str], extracted: dict, ind: dict) -> str:
    if services:
        return f"{services[0]}" + (f" og {len(services)-1} til" if len(services) > 1 else "")
    return ind.get("default_offer", extracted.get("description", "")[:80])


def _proof(extracted: dict) -> list[str]:
    out = []
    jl = extracted.get("jsonld", [])
    for node in jl:
        agg = node.get("aggregateRating") if isinstance(node, dict) else None
        if agg:
            out.append(f"{agg.get('ratingValue', '')}★ ({agg.get('reviewCount', '')} omtaler)")
    if extracted.get("prices"):
        out.append("Tydelige priser")
    if extracted.get("socials"):
        out.append("Aktiv lokalt")
    return out[:3] or ["Lokal og etablert"]


def _first_location(extracted: dict) -> str | None:
    for node in extracted.get("jsonld", []):
        if isinstance(node, dict) and node.get("address"):
            addr = node["address"]
            if isinstance(addr, dict):
                return addr.get("addressLocality") or addr.get("streetAddress")
    return None


def _must_use(assets: dict) -> list[str]:
    must = []
    if assets.get("logo"):
        must.append(assets["logo"]["local_path"])
    if assets.get("hero"):
        must.append(assets["hero"]["local_path"])
    return must


def brief_to_md(brief: dict) -> str:
    kf = brief["key_facts"]
    return f"""# Brief — {brief['business_name']}

**Bransje:** {brief['industry']}  |  **Kanal:** {brief['channel']['format']} \
{brief['channel']['duration']}s  |  **Tone:** {brief['tone']}

## Målgruppe
{brief['audience']}

## Hook
> {brief['hook']}

## Problem
{brief['problem']}

## Offer
{brief['offer']}

## Proof / trust
{chr(10).join('- ' + p for p in brief['proof'])}

## CTA
**{brief['cta']['text']}** → {brief['cta']['href']}

## Lokasjon
{brief.get('location') or '—'}

## Nøkkelfakta
- Tjenester: {', '.join(kf['services']) or '—'}
- Priser: {', '.join(kf['prices']) or '—'}
- Telefon: {kf['phone'] or '—'}

## Unngå
{chr(10).join('- ' + a for a in brief['avoid'])}
"""
