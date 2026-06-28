// EDITORIAL — magazine spread on warm paper. Playfair serif headlines, folio
// marks, hairline rules, framed poster images with captions. Image-led but
// type-forward — feels like a printed feature, not a slideshow.

import type { ArtDirection, Archetype, SceneCfg, SceneCtx, Brand, ImageTreatment } from "./types";
import { escapeHtml, extractNumber, splitItems } from "../helpers";

const ID = "editorial";

type Layout = "title" | "list" | "num" | "cta";
function layoutOf(a: Archetype): Layout {
  if (a === "big-num" || a === "signal") return "num";
  if (a === "grid" || a === "zones" || a === "trust" || a === "pipeline") return "list";
  if (a === "cta") return "cta";
  return "title";
}
function imgCss(url: string): string {
  return `background-image:url('${url.replace(/'/g, "%27")}')`;
}

export const editorial: ArtDirection = {
  id: ID,
  label: "Editorial",
  fits: ["fashion", "hotel", "restaurant", "interior", "beauty", "lifestyle", "agency", "architecture"],
  fontsHref:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Inter:wght@400;500;600&display=swap",
  treatmentFor(arch) {
    if (arch === "logo") return "logo-lockup";
    if (arch === "cta") return "none";
    if (arch === "hook" || arch === "manifesto" || arch === "kinetic") return "poster";
    return "split-right";
  },
  baseCss(brand) {
    const accent = brand.colors?.[0] || "#9a3b2e";
    return `
#film[data-dir="${ID}"]{background:#f4f0e8;color:#171310;font-family:'Inter',sans-serif}
#film[data-dir="${ID}"] .${ID}-folio{position:absolute;top:3cqw;left:5cqw;right:5cqw;display:flex;justify-content:space-between;font-size:1.05cqw;letter-spacing:.28em;text-transform:uppercase;font-weight:600;z-index:6;border-bottom:1px solid #171310;padding-bottom:.8cqw}
#film[data-dir="${ID}"] .${ID}-foot{position:absolute;bottom:3cqw;left:5cqw;right:5cqw;display:flex;justify-content:space-between;font-size:.95cqw;letter-spacing:.28em;text-transform:uppercase;color:#5a534a;z-index:6;border-top:1px solid #171310;padding-top:.7cqw}
#film[data-dir="${ID}"] .${ID}-scene{position:absolute;inset:0;visibility:hidden;background:#f4f0e8;color:#171310;display:grid;grid-template-columns:1fr;align-items:center;padding:8cqw 5cqw}
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-right"]{grid-template-columns:1fr 40%;gap:5cqw}
#film[data-dir="${ID}"] .${ID}-scene[data-img="poster"]{grid-template-columns:44% 1fr;gap:5cqw}
#film[data-dir="${ID}"] .${ID}-scene[data-img="poster"] .${ID}-box{order:2}
#film[data-dir="${ID}"] .${ID}-box{min-width:0;display:flex;flex-direction:column;gap:1.4cqw;justify-content:center}
#film[data-dir="${ID}"] .${ID}-kicker{font-size:1.1cqw;letter-spacing:.34em;text-transform:uppercase;color:${accent};font-weight:600}
#film[data-dir="${ID}"] .${ID}-h1{font-family:'Playfair Display',serif;font-weight:900;line-height:.98;letter-spacing:-.01em;margin:0;text-wrap:balance}
#film[data-dir="${ID}"] .${ID}-h1 em{font-style:italic;font-weight:500;color:${accent}}
#film[data-dir="${ID}"] .${ID}-sub{font-size:1.7cqw;line-height:1.5;color:#3a342d;max-width:34em;text-wrap:pretty;margin:.4cqw 0 0;column-gap:3cqw}
#film[data-dir="${ID}"] .${ID}-rule{height:1px;background:#171310;width:100%;margin:.4cqw 0}
#film[data-dir="${ID}"] .${ID}-img{background-size:cover;background-position:center;height:100%;min-height:50cqh}
#film[data-dir="${ID}"] .${ID}-scene[data-img="poster"] .${ID}-img{box-shadow:0 1.4cqw 4cqw rgba(23,19,16,.22)}
#film[data-dir="${ID}"] .${ID}-cap{font-size:.95cqw;letter-spacing:.16em;text-transform:uppercase;color:#5a534a;margin-top:.7cqw}
#film[data-dir="${ID}"] .${ID}-bigwrap{display:flex;align-items:flex-end;gap:2cqw;border-top:2px solid #171310;padding-top:1.4cqw}
#film[data-dir="${ID}"] .${ID}-big{font-family:'Playfair Display',serif;font-weight:900;line-height:.8;letter-spacing:-.03em;margin:0;color:${accent}}
#film[data-dir="${ID}"] .${ID}-biglabel{font-family:'Playfair Display',serif;font-weight:500;font-style:italic;font-size:2.4cqw;line-height:1.1;padding-bottom:1cqw;max-width:18em}
#film[data-dir="${ID}"] .${ID}-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
#film[data-dir="${ID}"] .${ID}-list li{display:grid;grid-template-columns:auto 1fr;gap:1.4cqw;align-items:baseline;border-top:1px solid #171310;padding:.9cqw 0;font-family:'Playfair Display',serif;font-weight:500;line-height:1.06}
#film[data-dir="${ID}"] .${ID}-list li .ix{font-family:'Inter',sans-serif;font-weight:600;font-size:1.1cqw;color:${accent};letter-spacing:.12em}
#film[data-dir="${ID}"] .${ID}-btn{display:inline-block;align-self:flex-start;border:2px solid #171310;color:#171310;background:transparent;padding:1.1cqw 3cqw;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-top:.6cqw}
#film[data-dir="${ID}"] .${ID}-logo{max-width:32cqw;max-height:14cqw;object-fit:contain;margin:0 auto 2cqw}
#film[data-dir="${ID}"] .${ID}-scene.lockup{place-items:center;text-align:center}
#film[data-dir="${ID}"] .${ID}-cut{position:absolute;inset:0;background:${accent};transform:scaleX(0);transform-origin:left center;z-index:9;visibility:hidden}
    `;
  },
  renderChrome(brand) {
    const name = escapeHtml(brand.siteName || brand.title || "");
    return `<div class="${ID}-folio"><span>${name}</span><span>Feature № 26</span></div><div class="${ID}-foot"><span>Editorial</span><span>${name}</span></div>`;
  },
  renderScene(arch, cfg, ctx) {
    const layout = layoutOf(arch);
    const treat: ImageTreatment = cfg.treatment ?? "none";
    const url = cfg.imageUrl || "";
    const title = escapeHtml(cfg.title || "");
    const body = escapeHtml(cfg.body || "");

    if (treat === "logo-lockup" || arch === "logo") {
      const logo = url ? `<img class="${ID}-logo" src="${url.replace(/"/g, "%22")}" alt=""/>` : "";
      return `<section class="${ID}-scene lockup" data-s="${ctx.idx}" data-img="none"><div class="${ID}-box" style="align-items:center;text-align:center" data-fit-box>${logo}<div class="${ID}-kicker">${escapeHtml(ctx.brand.tagline || "")}</div><h1 class="${ID}-h1" data-fit data-fit-max="9cqw" data-fit-min="3cqw" style="text-align:center">${title}</h1></div></section>`;
    }

    let dataImg = "none";
    let imgEl = "";
    if (url && (treat === "split-right" || treat === "poster")) {
      dataImg = treat;
      imgEl = `<div><div class="${ID}-img" style="${imgCss(url)}"></div><div class="${ID}-cap">${escapeHtml(ctx.brand.siteName || "")}</div></div>`;
    }

    let box = "";
    if (layout === "num") {
      const { num, rest } = extractNumber(cfg.title || "");
      box = `<div class="${ID}-box" data-fit-box><div class="${ID}-kicker">${escapeHtml(rest || "Tall")}</div><div class="${ID}-bigwrap"><div class="${ID}-big" data-fit data-fit-nowrap data-fit-max="26cqw" data-fit-min="6cqw">${escapeHtml(num)}</div>${body ? `<div class="${ID}-biglabel">${body}</div>` : ""}</div></div>`;
    } else if (layout === "list") {
      const items = splitItems(body || cfg.title, 5);
      const list = items.length ? items : [cfg.title];
      const lis = list.map((it, i) => `<li><span class="ix">${String(i + 1).padStart(2, "0")}</span><span data-fit data-fit-max="3cqw" data-fit-min="1.5cqw">${escapeHtml(it)}</span></li>`).join("");
      box = `<div class="${ID}-box" data-fit-box><div class="${ID}-kicker">${escapeHtml(cfg.title || "")}</div><ul class="${ID}-list">${lis}</ul></div>`;
    } else if (layout === "cta") {
      box = `<div class="${ID}-box" data-fit-box style="align-items:center;text-align:center"><div class="${ID}-kicker">Neste steg</div><h1 class="${ID}-h1" data-fit data-fit-max="11cqw" data-fit-min="3cqw" style="text-align:center">${title}</h1><div class="${ID}-btn" data-fit data-fit-nowrap data-fit-max="1.8cqw" data-fit-min="1cqw">${body || "Les mer"}</div></div>`;
    } else {
      box = `<div class="${ID}-box" data-fit-box><div class="${ID}-kicker">${ctx.idx === 1 ? escapeHtml(ctx.brand.siteName || "") : "№ " + String(ctx.idx).padStart(2, "0")}</div><h1 class="${ID}-h1" data-fit data-fit-max="${dataImg === "none" ? 13 : 9}cqw" data-fit-min="3cqw">${title}</h1>${body ? `<div class="${ID}-rule"></div><p class="${ID}-sub" data-fit data-fit-max="2.2cqw" data-fit-min="1.1cqw">${body}</p>` : ""}</div>`;
    }

    const order = treat === "poster" ? `${box}${imgEl}` : `${box}${imgEl}`;
    return `<section class="${ID}-scene" data-s="${ctx.idx}" data-img="${dataImg}">${order}</section>`;
  },
  animateScene(_a, _c, ctx) {
    const sel = `#film[data-dir="${ID}"] .${ID}-scene[data-s="${ctx.idx}"]`;
    const end = ctx.t0 + ctx.dur;
    return `
tl.set('${sel}',{visibility:'visible'},${ctx.t0});
tl.fromTo('${sel} .${ID}-img',{opacity:0,scale:1.05,clipPath:'inset(0 0 100% 0)'},{opacity:1,scale:1,clipPath:'inset(0 0 0% 0)',duration:.8,ease:'power3.out'},${ctx.t0 + 0.05});
tl.fromTo('${sel} .${ID}-kicker',{opacity:0,x:-16},{opacity:1,x:0,duration:.5,ease:'power2.out'},${ctx.t0 + 0.15});
tl.fromTo('${sel} .${ID}-h1, ${sel} .${ID}-bigwrap',{opacity:0,y:26},{opacity:1,y:0,duration:.7,ease:'power3.out'},${ctx.t0 + 0.28});
tl.fromTo('${sel} .${ID}-rule',{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:.5,ease:'power2.out'},${ctx.t0 + 0.45});
tl.fromTo('${sel} .${ID}-sub, ${sel} .${ID}-list li, ${sel} .${ID}-btn, ${sel} .${ID}-cap',{opacity:0,y:14},{opacity:1,y:0,duration:.55,stagger:.08,ease:'power2.out'},${ctx.t0 + 0.5});
tl.set('${sel}',{visibility:'hidden'},${end});`;
  },
  cutTransition(at) {
    const sel = `#film[data-dir="${ID}"] .${ID}-cut`;
    return `
tl.set('${sel}',{visibility:'visible',transformOrigin:'left center',scaleX:0},${at});
tl.to('${sel}',{scaleX:1,duration:.18,ease:'power3.inOut'},${at});
tl.set('${sel}',{transformOrigin:'right center'},${at + 0.2});
tl.to('${sel}',{scaleX:0,duration:.18,ease:'power3.inOut'},${at + 0.2});
tl.set('${sel}',{visibility:'hidden'},${at + 0.4});`;
  },
};
