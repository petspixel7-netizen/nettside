// iteam Braathe — "Global IT lokalt" — 30s clean, light, photo-led brand film.
// Uses the REAL current iteam logo (script + green underline), real Braathe
// photos (each used ONCE), their real Norway location map, real copy + numbers,
// real colours. Light/airy paper base with iteam green accent. Service photos
// reveal one by one. Font: Hanken Grotesk (free twin of their Aeonik Pro).

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/braathe.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

// REAL iteam logo (script wordmark + green underline). Strip id, add class.
const iteamLogo = readFileSync(`${SCRATCH}/iteam-logo.svg`, "utf8")
  .replace('id="Layer_1" data-name="Layer 1"', 'class="itlogo"');

const uri = (f: string) => "data:image/jpeg;base64," + readFileSync(`${SCRATCH}/${f}`).toString("base64");
const IMG = {
  global: uri("bz-global.jpg"),   // hook (distinct)
  hands: uri("bz-hands.jpg"),     // Digital Arbeidsplass
  arch: uri("braathe-arch.jpg"),  // Sky & Infrastruktur
  tech: uri("bz-tech.jpg"),       // Sikkerhet
  terrasse: uri("bz-terrasse.jpg"), // Konsulenter
  kart: uri("bz-kart.jpg"),       // map proof
};

const words = (s: string) =>
  s.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

// one real Braathe pill clip for the hero photo
const CLIPS = `<svg width="0" height="0" style="position:absolute"><defs>
<clipPath id="cp-pill-r" clipPathUnits="objectBoundingBox"><path d="M0.85453125,0.14765625 C0.97640625,0.26953125 0.97640625,0.46765625 0.85453125,0.58953125 L0.58953125,0.85453125 C0.46765625,0.97640625 0.26953125,0.97640625 0.14765625,0.85453125 C0.02578125,0.73265625 0.02578125,0.53453125 0.14765625,0.41265625 L0.41265625,0.14765625 C0.53453125,0.02578125 0.73203125,0.02578125 0.85453125,0.14765625 Z"/></clipPath>
</defs></svg>`;

const SERVICES = [
  { img: IMG.hands, t: "Digital Arbeidsplass", s: "Microsoft-lisenser, support og verktøy som gir arbeidsglede." },
  { img: IMG.arch, t: "Sky & Infrastruktur", s: "Dine data — på dedikert server hos oss, eller i nettskyen." },
  { img: IMG.tech, t: "Sikkerhet", s: "Beskytt dine data. Viktigere enn noensinne." },
  { img: IMG.terrasse, t: "Konsulenter", s: "Mennesker som hjelper mennesker — magien bak bekymringsfri IT." },
];
const cards = SERVICES.map(
  (s, i) => `<div class="card" data-ci="${i}"><div class="cph"><div class="ph-img" data-kb style="background-image:url('${s.img}')"></div></div><div class="cap"><div class="ct">${s.t}</div><div class="cs">${s.s}</div></div></div>`,
).join("");

const TIMELINE = `
var tl = gsap.timeline();
gsap.to('[data-kb]',{scale:1.08,duration:16,ease:'sine.inOut',yoyo:true,repeat:-1});

// S1 LOGO (0-3.4) — real iteam logo on paper
tl.from('#logo1',{opacity:0,clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'power3.inOut'},0.3);
tl.from('#logo1 .cls-2',{scaleX:0,transformOrigin:'left center',duration:0.7,ease:'power2.out'},1.0);
tl.from('#logo-sub',{opacity:0,y:12,duration:0.7,ease:'power2.out'},1.3);
tl.from('#hud',{opacity:0,duration:1.0},0.9);

// S2 HOOK — crossfades in ON TOP of the previous scene (no black gap)
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},3.4);
tl.from('#hook-tag',{opacity:0,y:12,duration:0.5,ease:'power2.out'},3.8);
tl.from('#hook-h1 .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.05,ease:'expo.out'},4.0);
tl.from('#hook-sub',{opacity:0,y:16,duration:0.7,ease:'power2.out'},4.8);
tl.from('#hook-photo',{clipPath:'inset(0 0 100% 0)',scale:0.97,opacity:0,duration:1.0,ease:'power3.out'},4.3);

// S3 SERVICES — crossfades in on top
tl.fromTo('#scene-svc',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},8.8);
tl.from('#svc-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},9.2);
tl.from('.card',{y:48,opacity:0,duration:0.7,stagger:0.55,ease:'power3.out'},10.0);

// S4 MAP PROOF — crossfades in on top
tl.fromTo('#scene-map',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},17.8);
tl.from('#map-panel',{scale:0.92,opacity:0,duration:0.9,ease:'power3.out'},18.2);
tl.from('#map-img',{opacity:0,duration:1.2,ease:'power1.out'},18.4);
tl.from('#map-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.05,ease:'expo.out'},18.6);
var stats=[['n1',400],['n2',40]];
stats.forEach(function(p){var o={v:0};tl.to(o,{v:p[1],duration:1.4,ease:'power2.out',onUpdate:function(){var e=document.getElementById(p[0]);if(e)e.textContent=Math.round(o.v)+'+';}},18.9);});
tl.from('#map-stats .stat',{opacity:0,y:18,duration:0.6,stagger:0.14,ease:'power2.out'},19.0);
tl.from('#map-foot',{opacity:0,y:12,duration:0.6,ease:'power2.out'},19.8);

// S5 END — petrol, white iteam logo; crossfades in on top
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.9,ease:'power1.inOut'},23.6);
tl.from('#logo2',{opacity:0,clipPath:'inset(0 100% 0 0)',duration:1.0,ease:'power3.inOut'},24.2);
tl.from('#end-claim .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.06,ease:'expo.out'},24.6);
tl.from('#end-cta',{opacity:0,y:14,duration:0.7,ease:'power2.out'},25.5);
tl.from('#end-phone',{opacity:0,y:10,duration:0.6,ease:'power2.out'},25.9);
tl.to('#end-cta .dot',{opacity:0.25,duration:0.6,yoyo:true,repeat:-1,ease:'sine.inOut'},26.4);
tl.to({},{duration:2.2},26.0);

if (window.__fitAll) window.__fitAll();
`;

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>iteam Braathe — Global IT lokalt</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--petrol:#004851;--green:#00ce7c;--paper:#f3f3f3;--paper2:#ffffff;--ink:#0e1a1e;--dim:rgba(14,26,30,.6);--mono:'JetBrains Mono',monospace;--disp:'Hanken Grotesk',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;overflow:hidden;container-type:size;background:var(--paper)}
#world{position:absolute;inset:0;z-index:2}
#grain{position:absolute;inset:-100px;z-index:8;pointer-events:none;opacity:.03;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
#hud{position:absolute;inset:0;z-index:7;pointer-events:none;font-family:var(--mono);font-size:.92cqw;letter-spacing:.26em;text-transform:uppercase;color:rgba(14,26,30,.5)}
#hud .tl{position:absolute;top:3.2cqw;left:4cqw}#hud .tr{position:absolute;top:3.2cqw;right:4cqw;color:var(--green)}
#hud .bl{position:absolute;bottom:3.2cqw;left:4cqw}#hud .br{position:absolute;bottom:3.2cqw;right:4cqw}
.scene{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7cqw;background:var(--paper)}
#scene-hook,#scene-svc,#scene-map,#scene-end{opacity:0}
#scene-end{background:var(--petrol);color:var(--paper)}
.w{display:inline-block;overflow:hidden;vertical-align:top}.w>span{display:inline-block}
.tag{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.32em;text-transform:uppercase;color:var(--green);font-weight:700}
.display{font-family:var(--disp);font-weight:800;line-height:1.0;letter-spacing:-.02em;margin:0;text-wrap:balance}
.ph-img{position:absolute;inset:-5%;background-size:cover;background-position:center;will-change:transform}
/* real iteam logo */
.itbox{display:block}.itlogo{width:100%;height:auto;display:block}
#scene-end .itlogo .cls-1{fill:#ffffff}
#logo-sub{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.34em;text-transform:uppercase;color:var(--dim);margin-top:2cqw}
/* hook */
#hook-row{display:flex;align-items:center;gap:6cqw;width:84cqw;text-align:left}
#hook-left{flex:1.05;min-width:0}
#hook-tag{color:var(--green);font-weight:700;font-family:var(--mono);font-size:1cqw;letter-spacing:.3em;text-transform:uppercase}
#hook-h1{font-size:7.2cqw;margin:1.2cqw 0;color:var(--ink)}
#hook-sub{font-size:1.65cqw;line-height:1.45;color:var(--dim);max-width:24em}
#hook-photo{flex:.95;height:42cqh;position:relative;overflow:hidden;clip-path:url(#cp-pill-r)}
/* services — uniform rounded cards (captions align under each image) */
#svc-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.3cqw;max-width:20em;font-family:var(--disp);font-weight:700;color:var(--ink);z-index:4}
#cards{display:flex;gap:2.6cqw;align-items:flex-start;justify-content:center;width:88cqw;margin-top:5cqw}
.card{width:19.5cqw;flex:none;text-align:left}
.cph{position:relative;overflow:hidden;height:21cqw;border-radius:1.6cqw;box-shadow:0 1cqw 2.4cqw rgba(0,72,81,.12)}
.card .cap{margin-top:1.2cqw}
.card .ct{font-family:var(--disp);font-weight:700;font-size:1.6cqw;line-height:1.1;color:var(--ink)}
.card .cs{font-size:1.05cqw;color:var(--dim);line-height:1.4;margin-top:.5cqw}
/* map */
#map-row{display:flex;align-items:center;gap:5cqw;width:86cqw}
#map-panel{flex:1;background:var(--paper2);border-radius:3cqw;padding:2.5cqw;box-shadow:0 1.6cqw 4cqw rgba(0,72,81,.16)}
#map-img{width:100%;height:50cqh;background-size:contain;background-repeat:no-repeat;background-position:center}
#map-right{flex:1;text-align:left}
#map-head{font-size:4.4cqw;color:var(--ink)}#map-head .g{color:var(--green)}
#map-stats{display:flex;gap:4cqw;margin:2cqw 0 1.2cqw}
.stat b{font-family:var(--disp);font-weight:800;font-size:3.4cqw;color:var(--petrol);display:block;line-height:1}
.stat span{font-size:1.05cqw;color:var(--dim);letter-spacing:.02em}
#map-foot{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.14em;text-transform:uppercase;color:var(--petrol)}
#map-foot b{color:var(--ink)}
/* end */
#end-claim{font-family:var(--disp);font-weight:800;font-size:7cqw;margin:1.4cqw 0 .4cqw}
#end-cta{font-family:var(--mono);font-size:1.3cqw;letter-spacing:.3em;text-transform:uppercase;display:flex;align-items:center;gap:1cqw;color:var(--paper)}
#end-cta .dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--green)}
#end-phone{font-family:var(--mono);font-size:1cqw;letter-spacing:.2em;color:rgba(243,243,243,.6);margin-top:1cqw}
</style></head>
<body>
${CLIPS}
<main id="stage">
  <div id="world">

  <div class="scene" id="scene-logo">
    <div class="itbox" id="logo1" style="width:30cqw">${iteamLogo}</div>
    <div id="logo-sub">Global IT lokalt · Bekymringsfri IT</div>
  </div>

  <div class="scene" id="scene-hook">
    <div id="hook-row">
      <div id="hook-left">
        <div id="hook-tag">Din lokale IT-partner</div>
        <h1 id="hook-h1" class="display">${words("Global IT lokalt")}</h1>
        <div id="hook-sub">Sikre og smarte løsninger — fra sky og sikkerhet til moderne arbeidsplasser.</div>
      </div>
      <div id="hook-photo"><div class="ph-img" data-kb style="background-image:url('${IMG.global}')"></div></div>
    </div>
  </div>

  <div class="scene" id="scene-svc">
    <div id="svc-head">${words("Din innovative og fremoverlente teknologileverandør")}</div>
    <div id="cards">${cards}</div>
  </div>

  <div class="scene" id="scene-map">
    <div id="map-row">
      <div id="map-panel"><div id="map-img" style="background-image:url('${IMG.kart}')"></div></div>
      <div id="map-right">
        <div class="tag">Et hav av muligheter</div>
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
    <div class="itbox" id="logo2" style="width:24cqw">${iteamLogo}</div>
    <h1 id="end-claim" class="display">Bekymringsfri IT.</h1>
    <div id="end-cta"><span class="dot"></span>braathe.no · del av iteam</div>
    <div id="end-phone">69 01 30 00 · post@braathe.no</div>
  </div>

  </div>
  <div id="hud"><div class="tl">iteam Braathe</div><div class="tr">● Film</div><div class="bl">Global IT lokalt</div><div class="br">26 — No</div></div>
  <div id="grain"></div>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>(function(){function boot(){ ${TIMELINE} } if(document.readyState==='complete')boot();else window.addEventListener('load',boot);})();</script>
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| bytes:", html.length);
