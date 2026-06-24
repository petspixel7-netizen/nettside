"""Thin, pluggable LLM client.

The engine runs fully offline with deterministic copy. When an LLM backend is
configured (ANTHROPIC_API_KEY + anthropic installed), enhance() upgrades copy/
brief/scene-plan using the matching skills/*.md prompt. enhance() ALWAYS returns
valid JSON of the same shape; on any failure it returns the deterministic input
unchanged so the pipeline never breaks.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from .config import SKILLS_DIR


def available() -> bool:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return False
    try:
        import anthropic  # noqa: F401
        return True
    except Exception:
        return False


def _load_skill(name: str) -> str:
    p = SKILLS_DIR / name
    return p.read_text(encoding="utf-8") if p.exists() else ""


def enhance(skill_file: str, payload: dict, *, model: str = "claude-opus-4-8") -> dict:
    """Run an LLM pass guided by a skill file. Returns same-shape dict."""
    if not available():
        return payload
    try:
        import anthropic
        client = anthropic.Anthropic()
        system = _load_skill(skill_file)
        msg = client.messages.create(
            model=model, max_tokens=2000,
            system=system + "\n\nReturn ONLY valid JSON of the same shape as the input.",
            messages=[{"role": "user", "content": json.dumps(payload, ensure_ascii=False)}],
        )
        text = msg.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1].lstrip("json").strip()
        return json.loads(text)
    except Exception:
        return payload
