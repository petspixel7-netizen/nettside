"""Configuration, paths, and the RenderConfig dataclass."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
TEMPLATES_DIR = ROOT / "templates"
SCHEMAS_DIR = ROOT / "engine" / "schemas"
PROJECTS_DIR = ROOT / "projects"
OUTPUTS_DIR = ROOT / "outputs"
SKILLS_DIR = ROOT / "skills"
PROMPTS_DIR = ROOT / "prompts"

KNOWN_FORMATS = {
    "reels", "tiktok", "shorts", "story", "feed",
    "website-hero", "signage", "square",
}
KNOWN_STYLES = {
    "premium-local", "restaurant", "handverker", "klinikk",
    "saas", "eiendom", "trening", "nettbutikk", "bil", "beauty",
}

DEFAULTS = {"format": "reels", "duration": 30, "style": "premium-local"}


def slugify(text: str) -> str:
    text = re.sub(r"^https?://", "", text or "")
    text = re.sub(r"/.*$", "", text)
    text = re.sub(r"^www\.", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return text or "project"


def load_data(name: str) -> dict:
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


@dataclass
class RenderConfig:
    url: str
    format: str = DEFAULTS["format"]
    duration: int = DEFAULTS["duration"]
    style: str = DEFAULTS["style"]
    preview_only: bool = False
    use_llm: bool = True
    skip_qa: bool = False
    out_override: Path | None = None
    extras: dict = field(default_factory=dict)

    @property
    def slug(self) -> str:
        return f"{slugify(self.url)}-{self.format}-{self.duration}s"

    @property
    def project_dir(self) -> Path:
        return PROJECTS_DIR / self.slug

    @property
    def output_dir(self) -> Path:
        return self.out_override or (OUTPUTS_DIR / self.slug)

    def to_dict(self) -> dict:
        return {
            "url": self.url, "format": self.format, "duration": self.duration,
            "style": self.style, "preview_only": self.preview_only,
            "use_llm": self.use_llm, "slug": self.slug,
        }


@dataclass
class PipelineResult:
    ok: bool
    index_html: Path | None
    qa_summary: str
