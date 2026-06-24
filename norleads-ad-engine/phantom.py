#!/usr/bin/env python3
"""phantom — NorLeads Ad Engine CLI.

Usage:
    python phantom.py --url https://bedrift.no --format reels --duration 40 --style premium-local
    python phantom.py https://bedrift.no --reels --40s
    python phantom.py --url https://bedrift.no --format reels --duration 40 --preview-only
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from engine.config import RenderConfig, DEFAULTS, KNOWN_FORMATS, KNOWN_STYLES
from engine.pipeline import run


def _parse_shortflags(argv: list[str]) -> dict:
    """Support shorthand: `phantom.py URL --reels --40s --premium-local`."""
    out = {"format": None, "duration": None, "style": None, "url": None}
    for tok in argv:
        if tok.startswith("http://") or tok.startswith("https://"):
            out["url"] = tok
        elif tok.lstrip("-") in KNOWN_FORMATS:
            out["format"] = tok.lstrip("-")
        elif tok.lstrip("-").rstrip("s").isdigit() and tok.endswith("s"):
            out["duration"] = int(tok.lstrip("-").rstrip("s"))
        elif tok.lstrip("-") in KNOWN_STYLES:
            out["style"] = tok.lstrip("-")
    return out


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="phantom", description="NorLeads Ad Engine")
    p.add_argument("url_pos", nargs="?", help="Website URL (positional shorthand)")
    p.add_argument("--url", help="Website URL")
    p.add_argument("--format", choices=sorted(KNOWN_FORMATS), default=None)
    p.add_argument("--duration", type=int, default=None, help="Seconds: 6,10,15,20,30,40,60")
    p.add_argument("--style", default=None, help="premium-local, restaurant, ...")
    p.add_argument("--out", default=None, help="Output dir override")
    p.add_argument("--preview-only", action="store_true", help="Stop after frame previews")
    p.add_argument("--no-llm", action="store_true", help="Force deterministic copy (no LLM)")
    p.add_argument("--skip-qa", action="store_true")
    return p


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    short = _parse_shortflags(argv)
    args = build_parser().parse_args(argv)

    url = args.url or args.url_pos or short["url"]
    if not url:
        print("error: no URL provided", file=sys.stderr)
        return 2

    cfg = RenderConfig(
        url=url,
        format=args.format or short["format"] or DEFAULTS["format"],
        duration=args.duration or short["duration"] or DEFAULTS["duration"],
        style=args.style or short["style"] or DEFAULTS["style"],
        preview_only=args.preview_only,
        use_llm=not args.no_llm,
        skip_qa=args.skip_qa,
        out_override=Path(args.out) if args.out else None,
    )
    result = run(cfg)
    print(f"\n✔ Done. Open: {result.index_html}")
    print(f"  QA: {result.qa_summary}")
    return 0 if result.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
