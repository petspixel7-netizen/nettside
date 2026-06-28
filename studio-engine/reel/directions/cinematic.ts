// CINEMATIC — full-bleed photography, slow Ken Burns push-ins, serif film
// titles, letterbox bars, soft cross-fades. The premium hotel/restaurant/spa
// look. Image-led: text is a quiet caption over the picture, never the subject.

import type { ArtDirection, Archetype, SceneCfg, SceneCtx, Brand } from "./types";
import { escapeHtml, extractNumber, splitItems, hash01 } from "../helpers";

const ID = "cinematic";

type Layout = "title" | "list" | "num" | "cta";
function layoutOf(a: Archetype): Layout {
  if (a === "big-num" || a === "signal") return "num";
  if (a === "grid" || a === "zones" || a === "trust" || a === "pipeline") return "list";
  if (a === "cta") return "cta";
  return "title";
}

export const cinematic: ArtDirection = {
  id: ID,
  label: "Cinematic",
  fits: ["hotel", "restaurant", "spa", "architecture", "travel", "realestate", "fashion", "wellness"],
  fontsHref:
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,500&family=Inter:wght@400;500;600&display=swap",
  treatmentFor() { return "full-bleed"; },
  baseCss(brand) {
    const accent = brand.colors?.[0] || "#c9a96a";
    return `
#film[data-dir="${ID}"]{background:#000;color:#fff;font-family:'Inter',sans-serif}
#film[data-dir="${ID}"] .${ID}-bar{position:absolute;left:0;right:0;height:7.5%;background:#000;z-index:7;pointer-events:none}
#film[data-dir="${ID}"] .${ID}-bar.top{top:0}
#film[data-dir="${ID}"] .${ID}-bar.bot{bottom:0}
#film[data-dir="${ID}"] .${ID}-chrome{position:absolute;left:4cqw;right:4cqw;top:2.4cqw;display:flex;justify-content:space-between;font-size:1cqw;letter-spacing:.34em;text-transform:uppercase;color:rgba(255,255,255,.85);z-index:8}
#film[data-dir="${ID}"] .${ID}-foot{position:absolute;left:4cqw;right:4cqw;bottom:2.4cqw;display:flex;justify-content:space-between;font-size:.95cqw;letter-spacing:.34em;text-transform:uppercase;color:rgba(255,255,255,.7);z-index:8}
#film[data-dir="${ID}"] .${ID}-scene{position:absolute;inset:0;visibility:hidden;overflow:hidden;background:#0a0a0a}
#film[data-dir="${ID}"] .${ID}-img{position:absolute;inset:-4%;background-size:cover;background-position:center;will-change:transform}
#film[data-dir="${ID}"] .${ID}-grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.05) 35%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.8) 100%);z-index:2}
#film[data-dir="${ID}"] .${ID}-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%);z-index:2}
#film[data-dir="${ID}"] .${ID}-box{position:absolute;left:7cqw;right:7cqw;bottom:13%;z-index:4;display:flex;flex-direction:column;gap:1.4cqw;align-items:flex-start;max-width:74%}
#film[data-dir="${ID}"] .${ID}-box.center{left:10cqw;right:10cqw;top:15%;bottom:15%;align-items:center;justify-content:center;text-align:center;max-width:none}
#film[data-dir="${ID}"] .${ID}-kicker{font-size:1.1cqw;letter-spacing:.42em;text-transform:uppercase;color:${accent};font-weight:600}
#film[data-dir="${ID}"] .${ID}-h1{font-family:'Cormorant Garamond',serif;font-weight:600;line-height:.98;letter-spacing:.005em;margin:0;text-wrap:balance;text-shadow:0 .2cqw 2cqw rgba(0,0,0,.5)}
#film[data-dir="${ID}"] .${ID}-h1 em{font-style:italic;color:${accent}}
#film[data-dir="${ID}"] .${ID}-sub{font-size:1.7cqw;font-weight:400;line-height:1.45;color:rgba(255,255,255,.9);max-width:42em;text-wrap:pretty;margin:0}
#film[data-dir="${ID}"] .${ID}-big{font-family:'Cormorant Garamond',serif;font-weight:600;line-height:.82;color:#fff;margin:0;text-shadow:0 .3cqw 3cqw rgba(0,0,0,.6)}
#film[data-dir="${ID}"] .${ID}-biglabel{font-size:1.3cqw;letter-spacing:.4em;text-transform:uppercase;color:${accent}}
#film[data-dir="${ID}"] .${ID}-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.9cqw;width:100%;max-width:48cqw}
#film[data-dir="${ID}"] .${ID}-list li{display:flex;align-items:baseline;gap:1.2cqw;border-bottom:1px solid rgba(255,255,255,.28);padding-bottom:.7cqw;font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.05}
#film[data-dir="${ID}"] .${ID}-list li .ix{font-family:'Inter',sans-serif;font-size:1cqw;letter-spacing:.2em;color:${accent};flex:none}
#film[data-dir="${ID}"] .${ID}-link{font-size:1.5cqw;letter-spacing:.28em;text-transform:uppercase;color:#fff;border-bottom:1px solid ${accent};padding-bottom:.5cqw}
#film[data-dir="${ID}"] .${ID}-cut{position:absolute;inset:0;background:#000;opacity:0;z-index:9;pointer-events:none}
    `;
  },
  renderChrome(brand) {
    const name = escapeHtml(brand.siteName || brand.title || "");
    return `<div class="${ID}-bar top"></div><div class="${ID}-bar bot"></div><div class="${ID}-chrome"><span>${name}</span><span>Film</span></div><div class="${ID}-foot"><span>26 · No</span><span>${name}</span></div>`;
  },
  renderScene(arch, cfg, ctx) {
    const layout = layoutOf(arch);
    const url = cfg.imageUrl || "";
    const accent = ctx.brand.colors?.[0] || "#c9a96a";
    const title = escapeHtml(cfg.title || "");
    const body = escapeHtml(cfg.body || "");
    const bg = url
      ? `<div class="${ID}-img" data-kb style="background-image:url('${url.replace(/'/g, "%27")}')"></div>`
      : `<div class="${ID}-img" data-kb style="background:radial-gradient(120% 120% at 30% 20%, ${accent}33, #0a0a0a 60%)"></div>`;

    let box = "";
    if (layout === "num") {
      const { num, rest } = extractNumber(cfg.title || "");
      const label = body || rest || "";
      box = `<div class="${ID}-box center" data-fit-box><div class="${ID}-biglabel">${escapeHtml(label)}</div><div class="${ID}-big" data-fit data-fit-nowrap data-fit-max="30cqw" data-fit-min="6cqw">${escapeHtml(num)}</div></div>`;
    } else if (layout === "list") {
      const items = splitItems(body || cfg.title, 5);
      const list = items.length ? items : [cfg.title];
      const lis = list.map((it, i) => `<li><span class="ix">0${i + 1}</span><span data-fit data-fit-max="3.4cqw" data-fit-min="1.6cqw">${escapeHtml(it)}</span></li>`).join("");
      box = `<div class="${ID}-box" data-fit-box><div class="${ID}-kicker">${escapeHtml(cfg.title || "")}</div><ul class="${ID}-list">${lis}</ul></div>`;
    } else if (layout === "cta") {
      box = `<div class="${ID}-box center" data-fit-box><div class="${ID}-kicker">Velkommen</div><h1 class="${ID}-h1" data-fit data-fit-max="11cqw" data-fit-min="3cqw">${title}</h1><div class="${ID}-link" data-fit data-fit-nowrap data-fit-max="1.8cqw" data-fit-min="1cqw">${body || "Book nå"}</div></div>`;
    } else {
      box = `<div class="${ID}-box" data-fit-box><div class="${ID}-kicker">${ctx.idx === 1 ? escapeHtml(ctx.brand.siteName || "") : "Kapittel " + String(ctx.idx).padStart(2, "0")}</div><h1 class="${ID}-h1" data-fit data-fit-max="10cqw" data-fit-min="3cqw">${title}</h1>${body ? `<p class="${ID}-sub" data-fit data-fit-max="2.1cqw" data-fit-min="1.1cqw">${body}</p>` : ""}</div>`;
    }
    return `<section class="${ID}-scene" data-s="${ctx.idx}">${bg}<div class="${ID}-grade"></div><div class="${ID}-vig"></div>${box}</section>`;
  },
  animateScene(_a, _c, ctx) {
    const sel = `#film[data-dir="${ID}"] .${ID}-scene[data-s="${ctx.idx}"]`;
    const end = ctx.t0 + ctx.dur;
    // Ken Burns: deterministic but varied push direction per scene.
    const r = hash01(ctx.seed + ctx.idx * 7);
    const sx = r < 0.5 ? -3 : 3;
    const sy = hash01(ctx.seed + ctx.idx * 13) < 0.5 ? -2 : 2;
    const zoomIn = hash01(ctx.seed + ctx.idx) < 0.6;
    const from = zoomIn ? 1.0 : 1.14;
    const to = zoomIn ? 1.14 : 1.0;
    return `
tl.set('${sel}',{visibility:'visible'},${ctx.t0});
tl.fromTo('${sel} [data-kb]',{scale:${from},xPercent:0,yPercent:0},{scale:${to},xPercent:${sx},yPercent:${sy},duration:${(ctx.dur + 0.6).toFixed(2)},ease:'none'},${ctx.t0});
tl.fromTo('${sel} .${ID}-kicker, ${sel} .${ID}-biglabel',{opacity:0,y:14},{opacity:1,y:0,duration:.6,ease:'power2.out'},${ctx.t0 + 0.25});
tl.fromTo('${sel} .${ID}-h1, ${sel} .${ID}-big',{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out'},${ctx.t0 + 0.35});
tl.fromTo('${sel} .${ID}-sub, ${sel} .${ID}-link, ${sel} .${ID}-list li',{opacity:0,y:16},{opacity:1,y:0,duration:.7,stagger:.1,ease:'power2.out'},${ctx.t0 + 0.55});
tl.to('${sel} .${ID}-box',{opacity:0,duration:.4,ease:'power1.in'},${end - 0.1});
tl.set('${sel}',{visibility:'hidden'},${end + 0.3});`;
  },
  cutTransition(at) {
    const sel = `#film[data-dir="${ID}"] .${ID}-cut`;
    return `
tl.to('${sel}',{opacity:1,duration:.3,ease:'power2.in'},${at});
tl.to('${sel}',{opacity:0,duration:.4,ease:'power2.out'},${at + 0.32});`;
  },
};
