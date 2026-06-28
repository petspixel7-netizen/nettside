// SWISS — white ground, black ink, strict typographic grid, Inter/Helvetica.
// Massimo Vignelli energy. Minimal motion: clean fade + hard guillotine cut.
// Image treatments: split-left/right, poster, masked circle, logo lockup.

import type { ArtDirection, Archetype, SceneCfg, SceneCtx, Brand, ImageTreatment } from "./types";
import { escapeHtml, extractNumber, splitItems } from "../helpers";

const ID = "swiss";

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

export const swiss: ArtDirection = {
  id: ID,
  label: "Swiss",
  fits: ["saas", "it", "finance", "b2b", "consulting", "agency", "default"],
  fontsHref:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap",
  treatmentFor(arch) {
    if (arch === "logo") return "logo-lockup";
    if (arch === "cta") return "masked-shape";
    if (arch === "hook" || arch === "manifesto") return "split-right";
    if (arch === "kinetic" || arch === "chaos") return "split-left";
    return "none";
  },
  baseCss(brand) {
    const accent = brand.colors?.[0] || "#E5263A";
    return `
#film[data-dir="${ID}"]{background:#fff;color:#000;font-family:'Inter',Helvetica,Arial,sans-serif;font-weight:500}
#film[data-dir="${ID}"] .${ID}-chrome{position:absolute;top:3.4cqw;left:4cqw;right:4cqw;display:flex;justify-content:space-between;font-size:1.05cqw;letter-spacing:.18em;text-transform:uppercase;font-weight:700;z-index:6}
#film[data-dir="${ID}"] .${ID}-rule{position:absolute;left:4cqw;right:4cqw;bottom:3.4cqw;border-top:1px solid #000;font-size:1.05cqw;letter-spacing:.2em;text-transform:uppercase;padding-top:1cqw;display:flex;justify-content:space-between;font-weight:700;z-index:6}
#film[data-dir="${ID}"] .${ID}-scene{position:absolute;inset:0;visibility:hidden;background:#fff;color:#000;display:grid}
#film[data-dir="${ID}"] .${ID}-num{position:absolute;top:3.4cqw;right:4cqw;font-size:1.3cqw;font-weight:900;letter-spacing:.05em;z-index:6}
#film[data-dir="${ID}"] .${ID}-box{position:relative;z-index:2;padding:9cqw 7cqw;display:flex;flex-direction:column;justify-content:center;gap:1.6cqw;min-width:0;overflow:hidden}
#film[data-dir="${ID}"] .${ID}-eyebrow{font-size:1.15cqw;font-weight:700;letter-spacing:.32em;text-transform:uppercase}
#film[data-dir="${ID}"] .${ID}-h1{font-weight:900;line-height:.94;letter-spacing:-.035em;margin:0;text-wrap:balance}
#film[data-dir="${ID}"] .${ID}-accent{color:${accent}}
#film[data-dir="${ID}"] .${ID}-sub{font-weight:400;line-height:1.32;color:#111;text-wrap:pretty;margin:0}
#film[data-dir="${ID}"] .${ID}-bigwrap{display:flex;flex-direction:column;align-items:flex-start;gap:.4cqw}
#film[data-dir="${ID}"] .${ID}-biglabel{font-size:1.5cqw;font-weight:700;letter-spacing:.28em;text-transform:uppercase}
#film[data-dir="${ID}"] .${ID}-big{font-weight:900;line-height:.82;letter-spacing:-.05em;margin:0;color:${accent}}
#film[data-dir="${ID}"] .${ID}-list{display:flex;flex-direction:column;gap:1cqw;list-style:none;padding:0;margin:0;width:100%}
#film[data-dir="${ID}"] .${ID}-list li{display:grid;grid-template-columns:3.2cqw 1fr;gap:1cqw;align-items:baseline;border-top:1px solid #000;padding-top:.7cqw;font-weight:700;letter-spacing:-.02em;line-height:1.04}
#film[data-dir="${ID}"] .${ID}-list li .ix{font-size:1.05cqw;font-weight:700}
#film[data-dir="${ID}"] .${ID}-btn{display:inline-block;align-self:flex-start;background:#000;color:#fff;padding:1.3cqw 3.4cqw;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-top:.8cqw}
/* image treatments */
#film[data-dir="${ID}"] .${ID}-img{background-size:cover;background-position:center;background-repeat:no-repeat}
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-right"]{grid-template-columns:1fr 42%}
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-left"]{grid-template-columns:42% 1fr}
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-left"] .${ID}-box{order:2}
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-left"] .${ID}-img,
#film[data-dir="${ID}"] .${ID}-scene[data-img="split-right"] .${ID}-img{position:relative;z-index:1;height:100%}
#film[data-dir="${ID}"] .${ID}-scene[data-img="full-bleed"]{color:#fff;background:#000}
#film[data-dir="${ID}"] .${ID}-scene[data-img="full-bleed"] .${ID}-img{position:absolute;inset:0;z-index:0}
#film[data-dir="${ID}"] .${ID}-scene[data-img="full-bleed"] .${ID}-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.72))}
#film[data-dir="${ID}"] .${ID}-scene[data-img="full-bleed"] .${ID}-h1,#film[data-dir="${ID}"] .${ID}-scene[data-img="full-bleed"] .${ID}-sub{color:#fff}
#film[data-dir="${ID}"] .${ID}-mask{width:18cqw;height:18cqw;border-radius:50%;flex:none;align-self:flex-start;margin-bottom:1cqw}
#film[data-dir="${ID}"] .${ID}-lockup{place-items:center;text-align:center}
#film[data-dir="${ID}"] .${ID}-logo{max-width:34cqw;max-height:16cqw;object-fit:contain;margin-bottom:2cqw}
#film[data-dir="${ID}"] .${ID}-cut{position:absolute;inset:0;background:#000;transform:scaleY(0);transform-origin:top center;z-index:9;visibility:hidden}
    `;
  },
  renderChrome(brand) {
    const name = escapeHtml(brand.siteName || brand.title || "");
    return `<div class="${ID}-chrome"><span>${name}</span><span>NO · 26</span></div><div class="${ID}-rule"><span>Motion · Print</span><span>${name}</span></div>`;
  },
  renderScene(arch, cfg, ctx) {
    const layout = layoutOf(arch);
    const treat: ImageTreatment = cfg.treatment ?? "none";
    const url = cfg.imageUrl || "";
    const num = String(ctx.idx).padStart(2, "0") + " / " + String(ctx.total).padStart(2, "0");
    const title = escapeHtml(cfg.title || "");
    const body = escapeHtml(cfg.body || "");

    // image layer (its own column for splits, absolute for full-bleed)
    let imgEl = "";
    let dataImg = "none";
    if (url && treat !== "none" && treat !== "logo-lockup" && treat !== "masked-shape" && treat !== "texture") {
      dataImg = treat === "poster" ? "split-right" : treat;
      imgEl = `<div class="${ID}-img" style="${imgCss(url)}"></div>`;
    } else if (url && treat === "full-bleed") {
      dataImg = "full-bleed";
      imgEl = `<div class="${ID}-img" style="${imgCss(url)}"></div>`;
    }

    let inner = "";
    if (treat === "logo-lockup") {
      const logo = url ? `<img class="${ID}-logo" src="${url.replace(/"/g, "%22")}" alt=""/>` : "";
      inner = `<div class="${ID}-box ${ID}-lockup" data-fit-box>${logo}<h1 class="${ID}-h1" data-fit data-fit-max="9cqw" data-fit-min="3cqw" style="text-align:center">${title}</h1>${body ? `<p class="${ID}-sub" data-fit data-fit-max="2.2cqw" data-fit-min="1.1cqw">${body}</p>` : ""}</div>`;
    } else if (layout === "num") {
      const { num: big, rest } = extractNumber(cfg.title || "");
      const label = body || rest || "Resultat";
      inner = `<div class="${ID}-box" data-fit-box><div class="${ID}-bigwrap"><div class="${ID}-biglabel">${escapeHtml(label)}</div><div class="${ID}-big" data-fit data-fit-nowrap data-fit-max="34cqw" data-fit-min="6cqw">${escapeHtml(big)}</div></div></div>`;
    } else if (layout === "list") {
      const items = splitItems(body || cfg.title, 5);
      const list = items.length ? items : [cfg.title];
      const lis = list.map((it, i) => `<li><span class="ix">${String(i + 1).padStart(2, "0")}</span><div data-fit data-fit-max="3.4cqw" data-fit-min="1.4cqw">${escapeHtml(it)}</div></li>`).join("");
      inner = `<div class="${ID}-box" data-fit-box><div class="${ID}-eyebrow">${escapeHtml(cfg.title || "")}</div><ul class="${ID}-list">${lis}</ul></div>`;
    } else if (layout === "cta") {
      const mask = treat === "masked-shape" && url ? `<div class="${ID}-img ${ID}-mask" style="${imgCss(url)}"></div>` : "";
      inner = `<div class="${ID}-box" data-fit-box>${mask}<div class="${ID}-eyebrow">Neste steg</div><h1 class="${ID}-h1" data-fit data-fit-max="12cqw" data-fit-min="3cqw">${title}</h1><div class="${ID}-btn" data-fit data-fit-max="2cqw" data-fit-min="1.1cqw" data-fit-nowrap>${body || "Kom i gang"}</div></div>`;
    } else {
      const mask = treat === "masked-shape" && url ? `<div class="${ID}-img ${ID}-mask" style="${imgCss(url)}"></div>` : "";
      inner = `<div class="${ID}-box" data-fit-box>${mask}<div class="${ID}-eyebrow">Kapittel ${String(ctx.idx).padStart(2, "0")}</div><h1 class="${ID}-h1" data-fit data-fit-max="13cqw" data-fit-min="3cqw">${title}</h1>${body ? `<p class="${ID}-sub" data-fit data-fit-max="2.4cqw" data-fit-min="1.1cqw">${body}</p>` : ""}</div>`;
    }

    const imgFirst = treat === "split-left";
    const body2 = imgFirst ? `${imgEl}${inner}` : `${inner}${imgEl}`;
    // chrome already carries brand + chapter; the corner num collided with it.
    void num;
    return `<section class="${ID}-scene" data-s="${ctx.idx}" data-img="${dataImg}">${body2}</section>`;
  },
  animateScene(_a, _c, ctx) {
    const sel = `#film[data-dir="${ID}"] .${ID}-scene[data-s="${ctx.idx}"]`;
    const end = ctx.t0 + ctx.dur;
    return `
tl.set('${sel}',{visibility:'visible'},${ctx.t0});
tl.fromTo('${sel} .${ID}-img',{opacity:0,scale:1.06},{opacity:1,scale:1,duration:.7,ease:'power2.out'},${ctx.t0});
tl.fromTo('${sel} .${ID}-box > *, ${sel} .${ID}-list li',{y:20,opacity:0},{y:0,opacity:1,duration:.5,stagger:.07,ease:'power2.out'},${ctx.t0 + 0.1});
tl.set('${sel}',{visibility:'hidden'},${end});`;
  },
  cutTransition(at) {
    const sel = `#film[data-dir="${ID}"] .${ID}-cut`;
    return `
tl.set('${sel}',{visibility:'visible',transformOrigin:'top center',scaleY:0},${at});
tl.to('${sel}',{scaleY:1,duration:.16,ease:'power3.in'},${at});
tl.set('${sel}',{transformOrigin:'bottom center'},${at + 0.18});
tl.to('${sel}',{scaleY:0,duration:.16,ease:'power3.out'},${at + 0.18});
tl.set('${sel}',{visibility:'hidden'},${at + 0.36});`;
  },
};
