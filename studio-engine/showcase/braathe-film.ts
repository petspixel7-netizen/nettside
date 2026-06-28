// BRAATHE (iteam Braathe) — "Global IT lokalt" — 30s premium brand film.
// PHOTO-LED, built entirely from braathe.no's own identity: their real photos,
// their signature pill/arch clip-path shapes, their real Norway location map,
// real copy and real numbers (400 ansatte · 40 lokasjoner · Svalbard→Kristiansand
// · 24/7/365), real logo (first + last), real colours. Font: Hanken Grotesk —
// closest free twin of their licensed Aeonik Pro.

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/braathe.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

// real logo: split mark (gold) from wordmark (light)
const rawLogo = readFileSync(`${SCRATCH}/braathe-logo.svg`, "utf8");
const li = rawLogo.replace(/^[\s\S]*?<g fill="#f3f3f3">/, "").replace(/<\/g><\/svg>\s*$/, "");
const fpe = li.indexOf("/>") + 2;
const markPath = li.slice(0, fpe).replace("<path ", '<path class="bm" ');
const wordPaths = li.slice(fpe);
const LOGO = (id: string, w: string) =>
  `<svg id="${id}" class="blogo" viewBox="0 0 164 24" style="width:${w}"><g><g class="mk">${markPath}</g><g class="wd">${wordPaths}</g></g></svg>`;

const uri = (f: string, m = "image/jpeg") => `data:${m};base64,` + readFileSync(`${SCRATCH}/${f}`).toString("base64");
const IMG = {
  hands: uri("bz-hands.jpg"),
  arch: uri("braathe-arch.jpg"),
  tech: uri("bz-tech.jpg"),
  terrasse: uri("bz-terrasse.jpg"),
  kart: uri("bz-kart.jpg"),
  skog: uri("bz-skog.jpg"),
};

const words = (s: string) =>
  s.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

// real Braathe clip-path shapes (objectBoundingBox) copied from their site
const CLIPS = `
<svg width="0" height="0" style="position:absolute"><defs>
<clipPath id="cp-pill-r" clipPathUnits="objectBoundingBox"><path d="M0.85453125,0.14765625 C0.97640625,0.26953125 0.97640625,0.46765625 0.85453125,0.58953125 L0.58953125,0.85453125 C0.46765625,0.97640625 0.26953125,0.97640625 0.14765625,0.85453125 C0.02578125,0.73265625 0.02578125,0.53453125 0.14765625,0.41265625 L0.41265625,0.14765625 C0.53453125,0.02578125 0.73203125,0.02578125 0.85453125,0.14765625 Z"/></clipPath>
<clipPath id="cp-pill-l" clipPathUnits="objectBoundingBox"><path d="M0.14765625,0.58953125 C0.02578125,0.46765625 0.02578125,0.26953125 0.14765625,0.14765625 C0.26953125,0.02578125 0.46765625,0.02578125 0.58953125,0.14765625 L0.85453125,0.41265625 C0.97640625,0.53453125 0.97640625,0.73265625 0.85453125,0.85453125 C0.73265625,0.97640625 0.53453125,0.97640625 0.41265625,0.85453125 L0.14765625,0.58953125 Z"/></clipPath>
<clipPath id="cp-arch-tl" clipPathUnits="objectBoundingBox"><path d="M0.17164075,0.17171875 C0.31726575,0.02609375 0.55351575,0.02609375 0.69914075,0.17171875 L0.92726575,0.39984375 C0.94664075,0.41921875 0.94664075,0.45109375 0.92726575,0.47046875 L0.47101575,0.92671875 C0.45164075,0.94609375 0.41976575,0.94609375 0.40039075,0.92671875 L0.17226575,0.69859375 C0.0260157505,0.55296875 0.0260157505,0.31734375 0.17164075,0.17171875 Z"/></clipPath>
<clipPath id="cp-arch-br" clipPathUnits="objectBoundingBox"><path d="M0.83203125,0.83203125 C0.68640625,0.97765625 0.45015625,0.97765625 0.30453125,0.83203125 L0.07703125,0.60390625 C0.05765625,0.58453125 0.05765625,0.55265625 0.07703125,0.53328125 L0.53328125,0.07703125 C0.55265625,0.05765625 0.58453125,0.05765625 0.60390625,0.07703125 L0.83203125,0.30515625 C0.97765625,0.45078125 0.97765625,0.68640625 0.83203125,0.83203125 Z"/></clipPath>
<clipPath id="cp-circle" clipPathUnits="objectBoundingBox"><path d="M0.125,0.5 C0.125,0.293125 0.293125,0.125 0.5,0.125 C0.706875,0.125 0.875,0.293125 0.875,0.5 C0.875,0.706875 0.706875,0.875 0.5,0.875 C0.293125,0.875 0.125,0.706875 0.125,0.5 Z"/></clipPath>
</defs></svg>`;

const photo = (img: string, clip: string, cls = "") =>
  `<div class="photo ${cls}" style="clip-path:url(#${clip})"><div class="ph-img" data-kb style="background-image:url('${img}')"></div></div>`;

const TIMELINE = `
var tl = gsap.timeline();
gsap.to('#grain',{backgroundPosition:'150px 110px',duration:1.4,ease:'none',repeat:-1});
gsap.to('[data-kb]',{scale:1.1,duration:14,ease:'sine.inOut',yoyo:true,repeat:-1});

// S1 LOGO (0-3.4)
tl.from('#blogo1 .mk',{xPercent:-40,opacity:0,duration:0.8,ease:'power3.out'},0.3);
tl.from('#blogo1',{clipPath:'inset(0 100% 0 0)',duration:1.0,ease:'power3.inOut'},0.4);
tl.from('#logo-sub',{opacity:0,y:12,duration:0.7,ease:'power2.out'},1.2);
tl.from('#hud',{opacity:0,duration:1.0},0.8);
tl.to('#scene-logo',{opacity:0,y:-22,duration:0.7,ease:'power2.in'},3.0);

// S2 HOOK (3.4-9) — their real hero: copy left, clipped photo right
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.5},3.5);
tl.from('#hook-tag',{opacity:0,y:12,duration:0.5,ease:'power2.out'},3.7);
tl.from('#hook-h1 .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.05,ease:'expo.out'},3.9);
tl.from('#hook-sub',{opacity:0,y:16,duration:0.7,ease:'power2.out'},4.7);
tl.from('#hook-photo',{clipPath:'inset(0 0 100% 0)',scale:0.96,opacity:0,duration:1.0,ease:'power3.out'},4.2);
tl.to('#scene-hook',{opacity:0,y:-22,duration:0.6,ease:'power2.in'},8.4);

// S3 SERVICES (9-17.5) — real photos in their clip shapes
tl.fromTo('#scene-svc',{opacity:0},{opacity:1,duration:0.6},9.0);
tl.from('#svc-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},9.2);
tl.from('.card',{y:60,opacity:0,duration:0.8,stagger:0.22,ease:'power3.out'},9.6);
tl.from('.card .cap',{opacity:0,y:14,duration:0.5,stagger:0.22,ease:'power2.out'},10.1);
tl.to('#scene-svc',{opacity:0,y:-20,duration:0.7,ease:'power2.in'},16.9);

// S4 PROOF — the real Norway map (17.5-24)
tl.fromTo('#scene-map',{opacity:0},{opacity:1,duration:0.6},17.5);
tl.from('#map-panel',{scale:0.9,opacity:0,duration:0.9,ease:'power3.out'},17.7);
tl.from('#map-img',{opacity:0,duration:1.2,ease:'power1.out'},17.9);
tl.from('#map-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.05,ease:'expo.out'},18.2);
var stats=[['n1',400],['n2',40]];
stats.forEach(function(p){var o={v:0};tl.to(o,{v:p[1],duration:1.4,ease:'power2.out',onUpdate:function(){var e=document.getElementById(p[0]);if(e)e.textContent=Math.round(o.v)+'+';}},18.6);});
tl.from('#map-stats .stat',{opacity:0,y:18,duration:0.6,stagger:0.14,ease:'power2.out'},18.7);
tl.from('#map-foot',{opacity:0,y:12,duration:0.6,ease:'power2.out'},19.6);
tl.to('#scene-map',{opacity:0,duration:0.7,ease:'power2.in'},23.4);

// S5 CTA + LOGO (24-30)
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.7},23.8);
tl.from('#blogo2',{clipPath:'inset(0 100% 0 0)',duration:0.9,ease:'power3.inOut'},24.1);
tl.from('#end-claim .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.06,ease:'expo.out'},24.4);
tl.from('#end-cta',{opacity:0,y:14,duration:0.7,ease:'power2.out'},25.4);
tl.from('#end-phone',{opacity:0,y:10,duration:0.6,ease:'power2.out'},25.8);
tl.to('#end-cta .dot',{opacity:0.2,duration:0.5,yoyo:true,repeat:-1,ease:'sine.inOut'},26.2);
tl.to({},{duration:2.2},25.9);

if (window.__fitAll) window.__fitAll();
`;

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Braathe — Global IT lokalt</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--petrol:#004851;--petrol2:#013840;--gold:#eed484;--sage:#b0bdb0;--paper:#f3f3f3;--ink:#0e1a1e;--ink2:#141414;--dim:rgba(14,26,30,.6);--mono:'JetBrains Mono',monospace;--disp:'Hanken Grotesk',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;overflow:hidden;container-type:size}
#world{position:absolute;inset:0;z-index:2}
#grain{position:absolute;inset:-100px;z-index:8;pointer-events:none;opacity:.04;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
#hud{position:absolute;inset:0;z-index:7;pointer-events:none;font-family:var(--mono);font-size:.95cqw;letter-spacing:.26em;text-transform:uppercase}
#hud .tl{position:absolute;top:3cqw;left:4cqw}#hud .tr{position:absolute;top:3cqw;right:4cqw}
#hud .bl{position:absolute;bottom:3cqw;left:4cqw}#hud .br{position:absolute;bottom:3cqw;right:4cqw}
.scene{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7cqw}
#scene-hook,#scene-svc,#scene-map,#scene-end{opacity:0}
.w{display:inline-block;overflow:hidden;vertical-align:top}.w>span{display:inline-block}
.tag{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.display{font-family:var(--disp);font-weight:800;line-height:1.0;letter-spacing:-.02em;margin:0;text-wrap:balance}
.photo{position:relative;overflow:hidden}
.ph-img{position:absolute;inset:-6%;background-size:cover;background-position:center;will-change:transform}
/* backgrounds per scene */
#scene-logo{background:var(--petrol)}
#scene-hook{background:var(--paper);color:var(--ink)}
#scene-svc{background:var(--petrol);color:var(--paper)}
#scene-map{background:var(--paper);color:var(--ink)}
#scene-end{background:var(--petrol);color:var(--paper)}
/* logo */
.blogo{height:auto}.blogo .mk path{fill:var(--gold)}
#scene-logo .blogo .wd path{fill:var(--paper)}#scene-end .blogo .wd path{fill:var(--paper)}
#logo-sub{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.34em;text-transform:uppercase;color:rgba(243,243,243,.65);margin-top:1.8cqw}
/* hook (real hero layout) */
#hook-row{display:flex;align-items:center;gap:5cqw;width:84cqw;text-align:left}
#hook-left{flex:1.1;min-width:0}
#hook-tag{color:var(--petrol);font-weight:700;font-family:var(--mono);font-size:1cqw;letter-spacing:.3em;text-transform:uppercase}
#hook-h1{font-size:7cqw;margin:1.2cqw 0;color:var(--ink)}
#hook-sub{font-size:1.7cqw;line-height:1.45;color:var(--dim);max-width:26em}
#hook-photo{flex:.9;height:40cqh}
/* services */
#svc-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.3cqw;max-width:20em;font-family:var(--disp);font-weight:700;z-index:4}
#cards{display:flex;gap:2.6cqw;align-items:flex-start;justify-content:center;width:88cqw;margin-top:5cqw}
.card{width:19.5cqw;flex:none}
.card .photo{height:22cqw}
.card .cap{text-align:left;margin-top:1.2cqw}
.card .ct{font-family:var(--disp);font-weight:700;font-size:1.7cqw;line-height:1.1}
.card .cs{font-size:1.1cqw;color:rgba(243,243,243,.7);line-height:1.4;margin-top:.5cqw}
.card .ct .arrow{color:var(--gold)}
/* map proof */
#map-row{display:flex;align-items:center;gap:5cqw;width:86cqw}
#map-panel{flex:1;background:#fff;border-radius:3cqw;padding:2.5cqw;box-shadow:0 1.6cqw 4cqw rgba(0,72,81,.18)}
#map-img{width:100%;height:50cqh;background-size:contain;background-repeat:no-repeat;background-position:center}
#map-right{flex:1;text-align:left}
#map-head{font-size:4.4cqw;color:var(--ink)}#map-head .g{color:var(--petrol)}
#map-stats{display:flex;gap:4cqw;margin:2cqw 0 1.2cqw}
.stat b{font-family:var(--disp);font-weight:800;font-size:3.4cqw;color:var(--petrol);display:block;line-height:1}
.stat span{font-size:1.05cqw;color:var(--dim);letter-spacing:.02em}
#map-foot{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.16em;text-transform:uppercase;color:var(--petrol)}
#map-foot b{color:var(--ink)}
/* end */
#end-claim{font-family:var(--disp);font-weight:800;font-size:7cqw;margin:1cqw 0 .4cqw}
#end-cta{font-family:var(--mono);font-size:1.3cqw;letter-spacing:.3em;text-transform:uppercase;display:flex;align-items:center;gap:1cqw;color:var(--paper)}
#end-cta .dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--gold)}
#end-phone{font-family:var(--mono);font-size:1cqw;letter-spacing:.2em;color:rgba(243,243,243,.6);margin-top:1cqw}
</style></head>
<body>
${CLIPS}
<main id="stage">
  <div id="world">

  <div class="scene" id="scene-logo">
    ${LOGO("blogo1", "32cqw")}
    <div id="logo-sub">Bekymringsfri IT · del av iteam</div>
  </div>

  <div class="scene" id="scene-hook">
    <div id="hook-row">
      <div id="hook-left">
        <div id="hook-tag">Din lokale IT-partner</div>
        <h1 id="hook-h1" class="display">${words("Global IT lokalt")}</h1>
        <div id="hook-sub">Sikre og smarte løsninger — fra sky og sikkerhet til moderne arbeidsplasser.</div>
      </div>
      ${photo(IMG.hands, "cp-pill-r", "").replace('class="photo "', 'class="photo" id="hook-photo"')}
    </div>
  </div>

  <div class="scene" id="scene-svc">
    <div id="svc-head">${words("Din innovative og fremoverlente teknologileverandør")}</div>
    <div id="cards">
      <div class="card">${photo(IMG.hands, "cp-arch-tl")}<div class="cap"><div class="ct">Digital Arbeidsplass</div><div class="cs">Microsoft-lisenser, support og verktøy som gir arbeidsglede.</div></div></div>
      <div class="card">${photo(IMG.arch, "cp-arch-br")}<div class="cap"><div class="ct">Sky &amp; Infrastruktur</div><div class="cs">Dine data — på dedikert server hos oss, eller i nettskyen.</div></div></div>
      <div class="card">${photo(IMG.tech, "cp-circle")}<div class="cap"><div class="ct">Sikkerhet</div><div class="cs">Beskytt dine data. Sikkerhet er viktigere enn noensinne.</div></div></div>
      <div class="card">${photo(IMG.terrasse, "cp-pill-l")}<div class="cap"><div class="ct">Konsulenter &amp; Utviklere</div><div class="cs">Mennesker som hjelper mennesker — magien bak bekymringsfri IT.</div></div></div>
    </div>
  </div>

  <div class="scene" id="scene-map">
    <div id="map-row">
      <div id="map-panel"><div id="map-img" style="background-image:url('${IMG.kart}')"></div></div>
      <div id="map-right">
        <div class="tag" style="color:var(--petrol)">Et hav av muligheter</div>
        <h1 id="map-head" class="display">${words("Global IT —")} <span class="g">${words("levert lokalt.")}</span></h1>
        <div id="map-stats">
          <div class="stat"><b id="n1">0+</b><span>ansatte i iteam</span></div>
          <div class="stat"><b id="n2">0+</b><span>lokasjoner i Norge</span></div>
          <div class="stat"><b>24/7</b><span>support, hele året</span></div>
        </div>
        <div id="map-foot">Fra <b>Svalbard</b> i nord til <b>Kristiansand</b> i sør</div>
      </div>
    </div>
  </div>

  <div class="scene" id="scene-end">
    ${LOGO("blogo2", "22cqw")}
    <h1 id="end-claim" class="display">Bekymringsfri IT.</h1>
    <div id="end-cta"><span class="dot"></span>braathe.no · del av iteam</div>
    <div id="end-phone">69 01 30 00 · post@braathe.no</div>
  </div>

  </div>
  <div id="hud"><div class="tl" style="color:var(--petrol)">Braathe</div><div class="tr" style="color:var(--gold)">● Film</div><div class="bl" style="color:var(--petrol)">Global IT lokalt</div><div class="br" style="color:var(--petrol)">26 — No</div></div>
  <div id="grain"></div>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>(function(){function boot(){ ${TIMELINE} } if(document.readyState==='complete')boot();else window.addEventListener('load',boot);})();</script>
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| bytes:", html.length);
