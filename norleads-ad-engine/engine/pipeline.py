"""Orchestrates the 10-step pipeline. Each step writes one validated artifact."""
from __future__ import annotations

import json
from pathlib import Path

from .config import RenderConfig, PipelineResult, SCHEMAS_DIR
from .scraper import fetch_site, extract_site
from .analyzer import build_brand_profile, build_assets_manifest
from .planner import build_brief, timing_recipe, build_scene_plan, build_visual_direction
from .planner.brief import brief_to_md
from .renderer import render_html, render_frames
from .qa import run_qa
from . import llm


def _write_json(path: Path, data: dict) -> dict:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return data


def _validate(name: str, data: dict) -> None:
    """Validate against schema if jsonschema + schema file are present (soft)."""
    schema = SCHEMAS_DIR / f"{name}.schema.json"
    if not schema.exists():
        return
    try:
        import jsonschema
        jsonschema.validate(data, json.loads(schema.read_text()))
    except ImportError:
        return
    except Exception as e:
        raise RuntimeError(f"schema validation failed for {name}: {e}") from e


def run(cfg: RenderConfig) -> PipelineResult:
    pdir = cfg.project_dir
    odir = cfg.output_dir
    pdir.mkdir(parents=True, exist_ok=True)
    odir.mkdir(parents=True, exist_ok=True)

    print(f"[1/10] fetch        {cfg.url}")
    fetched = fetch_site(cfg.url, pdir)
    html = fetched.get("html", "")

    print("[2/10] extract")
    extracted = extract_site(fetched, cfg.url)
    extracted["url"] = cfg.url
    _write_json(pdir / "extracted.json", extracted)

    print("[3/10] brand + assets")
    brand = build_brand_profile(extracted, html, cfg.style)
    _validate("brand_profile", brand)
    _write_json(odir / "brand_profile.json", brand)
    assets = build_assets_manifest(extracted, pdir)
    _validate("assets_manifest", assets)
    _write_json(odir / "assets_manifest.json", assets)

    print("[4/10] brief")
    brief = build_brief(extracted, brand, assets, cfg.style, cfg.format, cfg.duration)
    if cfg.use_llm:
        brief = llm.enhance("copywriter.md", brief)
    _validate("brief", brief)
    _write_json(odir / "brief.json", brief)
    (odir / "brief.md").write_text(brief_to_md(brief), encoding="utf-8")

    print("[5/10] scene plan")
    timing = timing_recipe(cfg.duration)
    scene_plan = build_scene_plan(brief, timing, brand, assets, cfg.format)
    if cfg.use_llm:
        scene_plan = llm.enhance("scene-planner.md", scene_plan)
    _validate("scene_plan", scene_plan)
    _write_json(odir / "scene_plan.json", scene_plan)

    print("[6/10] visual direction")
    visual = build_visual_direction(scene_plan, brand, cfg.style, cfg.format)
    _validate("visual_direction", visual)
    _write_json(odir / "visual_direction.json", visual)

    render_config = {**cfg.to_dict(), "duration": cfg.duration}
    _write_json(odir / "render_config.json", render_config)
    _write_json(odir / "project.json", {
        "config": cfg.to_dict(), "extracted_summary": {
            "title": extracted.get("title"), "domain": extracted.get("domain"),
            "asset_count": assets.get("count"), "warnings": assets.get("warnings"),
        }})

    print("[7/10] frame previews")
    # Build a preview HTML first so frames reflect real layout.
    index_preview = render_html(json.loads(json.dumps(scene_plan)), visual, brand,
                                render_config, pdir, odir, preview=True)
    frames = render_frames(index_preview, scene_plan, odir)
    if frames:
        print(f"        {len(frames)} frame(s): {frames}")

    if cfg.preview_only:
        return PipelineResult(ok=True, index_html=index_preview,
                              qa_summary="preview-only (QA skipped)")

    print("[8/10] HTML master")
    index_html = render_html(scene_plan, visual, brand, render_config, pdir, odir,
                             preview=False)

    if cfg.skip_qa:
        return PipelineResult(ok=True, index_html=index_html, qa_summary="QA skipped")

    print("[9/10] QA")
    qa = run_qa(index_html, scene_plan, brief, render_config, odir)
    _validate("qa_report", qa)
    _write_json(odir / "qa_report.json", qa)

    print(f"[10/10] export      {odir}")
    return PipelineResult(ok=qa["passed"], index_html=index_html,
                          qa_summary=qa["verdict"])
