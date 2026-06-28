// BORREGAARD — "Fra grantre til verden" — bespoke 30s showcase film.
// One continuous virtual-camera flythrough (no hard cuts): a molecular hex
// lattice assembles, an energy stream flows tree -> molecule -> material ->
// world, glass panels glide past, kinetic type, counters. Dark forest-black
// with luminous Borregaard green/blue. Logo first + last.
//
// Core GSAP only (timeline + AttrPlugin). Self-contained HTML, F11-ready.

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/borregaard.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

// ---------- geometry helpers (computed at build time) ----------
function hexPoints(cx: number, cy: number, r: number): string {
  const p: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    p.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return p.join(" ");
}

// a drifting band of hexes (the "molecular lattice")
const R = 58;
const hexW = R * 1.5;
const hexH = R * Math.sqrt(3);
const hexes: string[] = [];
let hi = 0;
for (let col = 0; col < 14; col++) {
  for (let row = 0; row < 6; row++) {
    const cx = 160 + col * hexW;
    const cy = 230 + row * hexH + (col % 2 ? hexH / 2 : 0);
    if (cx > 1820) continue;
    hexes.push(
      `<polygon class="hex" data-hi="${hi}" points="${hexPoints(cx, cy, R - 4)}" pathLength="1"/>`,
    );
    hi++;
  }
}
const HEX_COUNT = hi;

// four stations along an energy stream
const stations = [
  { x: 300, y: 600, k: "01", t: "Grantre", s: "Fornybart råstoff" },
  { x: 760, y: 470, k: "02", t: "Molekyl", s: "Cellulose · lignin · vanillin" },
  { x: 1220, y: 600, k: "03", t: "Materiale", s: "Avanserte biokjemikalier" },
  { x: 1640, y: 460, k: "04", t: "Verden", s: "Eksport til 100+ land" },
];
// smooth cubic stream through the stations
const streamD = (() => {
  const p = stations.map((s) => [s.x, s.y]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i];
    const [x1, y1] = p[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
})();

const stationNodes = stations
  .map(
    (s, i) =>
      `<circle class="st-node" data-si="${i}" cx="${s.x}" cy="${s.y}" r="10"/>`,
  )
  .join("");

const stationPanels = stations
  .map(
    (s, i) => `
<div class="panel" data-si="${i}" style="left:${(s.x / 1920) * 100}%;top:${(s.y / 1080) * 100}%">
  <div class="panel-k">${s.k}</div>
  <div class="panel-t fit" data-fit data-fit-max="2.6cqw" data-fit-min="1.2cqw" data-fit-nowrap>${s.t}</div>
  <div class="panel-s">${s.s}</div>
</div>`,
  )
  .join("");

// molecular logo mark: hexagon ring of 6 nodes + bonds + core
const markR = 120;
const markVerts = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 180) * (60 * i - 90);
  return [960 + markR * Math.cos(a), 300 + markR * Math.sin(a)];
});
const markBonds = markVerts
  .map((v, i) => {
    const n = markVerts[(i + 1) % 6];
    return `<line class="mk-bond" x1="${v[0].toFixed(1)}" y1="${v[1].toFixed(1)}" x2="${n[0].toFixed(1)}" y2="${n[1].toFixed(1)}" pathLength="1"/>`;
  })
  .join("");
const markSpokes = markVerts
  .map(
    (v) =>
      `<line class="mk-spoke" x1="960" y1="300" x2="${v[0].toFixed(1)}" y2="${v[1].toFixed(1)}" pathLength="1"/>`,
  )
  .join("");
const markNodes = markVerts
  .map(
    (v, i) =>
      `<circle class="mk-node" data-mi="${i}" cx="${v[0].toFixed(1)}" cy="${v[1].toFixed(1)}" r="13"/>`,
  )
  .join("");

// ---------- timeline JS (no template literals / no ${} inside) ----------
const TIMELINE = `
gsap.registerPlugin();
var tl = gsap.timeline();

// ambient: drifting gradient blobs + slow lattice shimmer, whole runtime
gsap.to('#blob1',{xPercent:12,yPercent:-8,scale:1.15,duration:30,ease:'sine.inOut',yoyo:true,repeat:-1});
gsap.to('#blob2',{xPercent:-10,yPercent:10,scale:1.2,duration:26,ease:'sine.inOut',yoyo:true,repeat:-1});
gsap.to('#stream-flow',{strokeDashoffset:-1000,duration:6,ease:'none',repeat:-1});
gsap.to('#grain',{backgroundPosition:'200px 140px',duration:1.4,ease:'none',repeat:-1});

// virtual camera (whole world) — slow continuous glide + targeted pushes
gsap.set('#world',{transformOrigin:'50% 50%'});

// ===== S1  LOGO IN  (0 - 4.2) =====
tl.set('#world',{scale:1.0,x:0,y:0},0);
tl.from('.mk-bond',{strokeDashoffset:1,duration:1.1,stagger:0.06,ease:'power2.out'},0.2);
tl.from('.mk-spoke',{strokeDashoffset:1,duration:0.9,stagger:0.05,ease:'power2.out'},0.5);
tl.from('.mk-node',{scale:0,transformOrigin:'50% 50%',duration:0.5,stagger:0.05,ease:'back.out(2)'},0.7);
tl.to('#mark',{filter:'drop-shadow(0 0 18px rgba(54,210,122,.55))',duration:0.8,ease:'power2.out'},1.0);
tl.from('#wordmark .w span',{yPercent:115,duration:0.8,stagger:0.05,ease:'expo.out'},1.0);
tl.from('#logo-sub',{opacity:0,y:14,duration:0.7,ease:'power2.out'},1.5);
tl.from('#hud',{opacity:0,duration:1.0,ease:'power1.out'},1.2);

// hold, then dissolve logo as camera pushes in
tl.to('#scene-logo',{opacity:0,filter:'blur(6px)',duration:0.9,ease:'power2.in'},3.6);
tl.to('#world',{scale:1.9,duration:1.6,ease:'power2.inOut'},3.4);

// ===== S2  HOOK  (4.2 - 9.0) =====
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.6,ease:'power1.out'},4.3);
tl.from('#hook-line .w span',{yPercent:120,filter:'blur(10px)',opacity:0,duration:0.9,stagger:0.06,ease:'expo.out'},4.5);
tl.from('#hook-accent',{'--uw':'0%',duration:0.9,ease:'power3.inOut'},5.6);
tl.to('#world',{scale:1.0,x:0,y:0,duration:2.0,ease:'power2.inOut'},6.0);
tl.to('#scene-hook',{opacity:0,y:-30,duration:0.7,ease:'power2.in'},8.3);

// ===== S3  PROCESS / FLYTHROUGH  (9.0 - 18.5) =====
tl.set('#lattice',{opacity:1},8.8);
tl.from('.hex',{strokeDashoffset:1,opacity:0,duration:0.5,stagger:{each:0.012,from:'edges'},ease:'none'},8.9);
tl.fromTo('#stream-base',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut'},9.2);
tl.fromTo('#stream-flow',{opacity:0},{opacity:1,duration:0.8},10.4);
tl.from('.st-node',{scale:0,transformOrigin:'50% 50%',duration:0.4,stagger:0.5,ease:'back.out(2)'},10.2);

// glide the camera across the stations, revealing each glass panel in turn
var camX = [520, 120, -360, -680];
var camS = [1.35, 1.3, 1.3, 1.32];
for (var i = 0; i < 4; i++){
  var at = 10.0 + i * 1.9;
  tl.to('#world',{x:camX[i],scale:camS[i],duration:1.5,ease:'power2.inOut'},at);
  tl.fromTo('.panel[data-si="'+i+'"]',{opacity:0,y:24,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:0.7,ease:'expo.out'},at+0.35);
  tl.to('.st-node[data-si="'+i+'"]',{filter:'drop-shadow(0 0 14px rgba(43,179,255,.8))',scale:1.5,transformOrigin:'50% 50%',duration:0.5,yoyo:true,repeat:1,ease:'sine.inOut'},at+0.4);
  if(i<3) tl.to('.panel[data-si="'+i+'"]',{opacity:0,y:-20,filter:'blur(6px)',duration:0.5,ease:'power2.in'},at+1.6);
}
// pull back to whole system
tl.to('#world',{x:0,scale:1.0,duration:1.4,ease:'power2.inOut'},17.0);
tl.to('.panel[data-si="3"]',{opacity:0,duration:0.6,ease:'power2.in'},17.2);
// clear the whole system so the proof + end scenes are clean
tl.to('#world',{opacity:0,duration:0.9,ease:'power2.in'},17.5);

// ===== S4  PROOF  (18.5 - 24.0) =====
tl.fromTo('#scene-proof',{opacity:0},{opacity:1,duration:0.6},18.4);
tl.from('#proof-head .w span',{yPercent:120,opacity:0,duration:0.8,stagger:0.05,ease:'expo.out'},18.6);
tl.fromTo('#ring-fg',{strokeDashoffset:1},{strokeDashoffset:0.22,duration:1.8,ease:'power2.inOut'},19.2);
var cObj = {v:0};
tl.to(cObj,{v:1889,duration:1.6,ease:'power2.out',onUpdate:function(){var e=document.getElementById('count');if(e)e.textContent=Math.round(cObj.v);}},19.2);
tl.from('#proof-stats .stat',{opacity:0,y:20,duration:0.6,stagger:0.18,ease:'power2.out'},20.0);
tl.to('#scene-proof',{opacity:0,filter:'blur(6px)',duration:0.8,ease:'power2.in'},23.2);

// ===== S5  CTA + LOGO OUT  (24.0 - 30.0) =====
tl.set('#world',{scale:1.0,x:0,y:0},23.2);
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.8,ease:'power1.out'},24.0);
tl.from('#mark2 .mk-bond',{strokeDashoffset:1,duration:1.0,stagger:0.05,ease:'power2.out'},24.0);
tl.from('#mark2 .mk-node',{scale:0,transformOrigin:'50% 50%',duration:0.5,stagger:0.04,ease:'back.out(2)'},24.5);
tl.to('#mark2',{filter:'drop-shadow(0 0 22px rgba(54,210,122,.6))',duration:1.0,ease:'power2.out'},24.6);
tl.from('#end-claim .w span',{yPercent:115,opacity:0,duration:0.9,stagger:0.05,ease:'expo.out'},24.8);
tl.from('#wordmark2 .w span',{yPercent:115,duration:0.8,stagger:0.05,ease:'expo.out'},25.6);
tl.from('#end-cta',{opacity:0,y:16,duration:0.8,ease:'power2.out'},26.4);
tl.to('#end-cta .dot',{opacity:0.2,duration:0.5,yoyo:true,repeat:-1,ease:'sine.inOut'},27.0);
tl.to({},{duration:2.4},27.6); // hold final frame

if (window.__fitAll) window.__fitAll();
`;

// ---------- markup helpers ----------
const words = (s: string) =>
  s
    .split(" ")
    .map((w) => `<span class="w"><span>${w}</span></span>`)
    .join(" ");

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Borregaard — Fra grantre til verden</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--bg:#06120c;--ink:#eaf7ef;--dim:rgba(234,247,239,.58);--green:#36d27a;--green2:#5ef0a0;--blue:#2bb3ff;--mono:'JetBrains Mono',monospace}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;background:var(--bg);overflow:hidden;container-type:size;color:var(--ink)}
/* background mesh */
#bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.5;mix-blend-mode:screen}
#blob1{width:60cqw;height:60cqw;left:-10cqw;top:-14cqw;background:radial-gradient(circle,#0f7a44,transparent 65%)}
#blob2{width:64cqw;height:64cqw;right:-16cqw;bottom:-18cqw;background:radial-gradient(circle,#0a4f86,transparent 65%)}
#gridlines{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:5cqw 5cqw;mask-image:radial-gradient(ellipse at center,#000 40%,transparent 80%)}
#vig{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(ellipse at center,transparent 52%,rgba(0,0,0,.62) 100%)}
#grain{position:absolute;inset:-100px;z-index:7;pointer-events:none;opacity:.05;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
/* world (camera) */
#world{position:absolute;inset:0;z-index:2;will-change:transform}
svg.layer{position:absolute;inset:0;width:100%;height:100%}
.hex{fill:none;stroke:rgba(94,240,160,.5);stroke-width:1.4;stroke-dasharray:1}
#lattice{opacity:0}
#stream-base{fill:none;stroke:url(#sg);stroke-width:3;stroke-linecap:round;stroke-dasharray:1}
#stream-flow{fill:none;stroke:var(--green2);stroke-width:4;stroke-linecap:round;stroke-dasharray:3 22;filter:drop-shadow(0 0 6px rgba(94,240,160,.9))}
.st-node{fill:var(--bg);stroke:var(--blue);stroke-width:3}
/* glass panels */
.panel{position:absolute;transform:translate(-50%,-50%);min-width:18cqw;padding:1.4cqw 1.8cqw;border-radius:1cqw;background:rgba(12,28,20,.55);border:1px solid rgba(94,240,160,.28);box-shadow:0 1.4cqw 4cqw rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.04);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.panel-k{font-family:var(--mono);font-size:1cqw;letter-spacing:.3em;color:var(--blue)}
.panel-t{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:2.4cqw;line-height:1;margin:.5cqw 0 .4cqw}
.panel-s{font-size:1.15cqw;color:var(--dim);letter-spacing:.01em}
/* scenes (screen space) */
.scene{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10cqw}
#scene-hook,#scene-proof,#scene-end{opacity:0}
.w{display:inline-block;overflow:hidden;vertical-align:top}
.w>span{display:inline-block}
.kicker{font-family:var(--mono);font-size:1.2cqw;letter-spacing:.42em;text-transform:uppercase;color:var(--green2);margin-bottom:1.6cqw}
.display{font-family:'Space Grotesk',sans-serif;font-weight:700;line-height:1.0;letter-spacing:-.01em;margin:0;text-wrap:balance}
.sub{font-size:1.9cqw;color:var(--dim);margin-top:1.6cqw;max-width:46em;line-height:1.4}
#hook-accent{position:relative;color:var(--green2)}
#hook-accent::after{content:"";position:absolute;left:0;right:0;bottom:-.1em;height:.07em;background:linear-gradient(90deg,var(--green),var(--blue));width:var(--uw,100%)}
/* logo */
#mark,#mark2{filter:drop-shadow(0 0 2px rgba(54,210,122,.2))}
.mk-bond,.mk-spoke{stroke:var(--green);stroke-width:3;stroke-dasharray:1;stroke-linecap:round}
.mk-spoke{stroke:rgba(43,179,255,.6);stroke-width:2}
.mk-node{fill:var(--green2);filter:drop-shadow(0 0 6px rgba(94,240,160,.8))}
#wordmark,#wordmark2{font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:.14em;margin-top:2cqw}
#logo-sub{font-family:var(--mono);font-size:1.2cqw;letter-spacing:.42em;text-transform:uppercase;color:var(--dim);margin-top:1.2cqw}
/* proof */
#ring-wrap{position:relative;width:22cqw;height:22cqw;margin:2cqw auto}
#ring svg{width:100%;height:100%;transform:rotate(-90deg)}
#ring-bg{fill:none;stroke:rgba(255,255,255,.1);stroke-width:6}
#ring-fg{fill:none;stroke:url(#rg);stroke-width:6;stroke-linecap:round;stroke-dasharray:1;filter:drop-shadow(0 0 6px rgba(94,240,160,.7))}
#count-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#count{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:5.5cqw;line-height:1}
#count-lbl{font-family:var(--mono);font-size:1cqw;letter-spacing:.3em;color:var(--dim);text-transform:uppercase}
#proof-stats{display:flex;gap:5cqw;margin-top:1cqw}
.stat{display:flex;flex-direction:column;gap:.4cqw}
.stat b{font-family:'Space Grotesk',sans-serif;font-size:2.8cqw;font-weight:700}
.stat span{font-size:1.1cqw;color:var(--dim);letter-spacing:.04em}
/* end cta */
#end-cta{margin-top:2.4cqw;font-family:var(--mono);font-size:1.5cqw;letter-spacing:.34em;text-transform:uppercase;color:var(--ink);display:flex;align-items:center;gap:1cqw}
#end-cta .dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--green2)}
/* HUD */
#hud{position:absolute;inset:0;z-index:5;pointer-events:none;font-family:var(--mono);font-size:.95cqw;letter-spacing:.28em;text-transform:uppercase;color:rgba(234,247,239,.7)}
#hud .tl{position:absolute;top:3cqw;left:4cqw}
#hud .tr{position:absolute;top:3cqw;right:4cqw;color:var(--green2)}
#hud .bl{position:absolute;bottom:3cqw;left:4cqw}
#hud .br{position:absolute;bottom:3cqw;right:4cqw}
</style></head>
<body>
<main id="stage">
  <div id="bg"><div class="blob" id="blob1"></div><div class="blob" id="blob2"></div><div id="gridlines"></div></div>

  <div id="world">
    <svg class="layer" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#36d27a"/><stop offset="1" stop-color="#2bb3ff"/></linearGradient>
      </defs>
      <g id="lattice">${hexes.join("")}</g>
      <g id="stream">
        <path id="stream-base" d="${streamD}" pathLength="1"/>
        <path id="stream-flow" d="${streamD}"/>
        ${stationNodes}
      </g>
    </svg>
    ${stationPanels}
  </div>

  <!-- S1 logo -->
  <div class="scene" id="scene-logo">
    <svg id="mark" viewBox="815 155 290 290" style="width:11cqw;height:auto">
      <g>${markSpokes}${markBonds}${markNodes}</g>
    </svg>
    <div id="wordmark" class="display" style="font-size:6.5cqw">${words("BORREGAARD")}</div>
    <div id="logo-sub">The Sustainable Biorefinery</div>
  </div>

  <!-- S2 hook -->
  <div class="scene" id="scene-hook">
    <div class="kicker">Østfold · Sarpsborg</div>
    <h1 id="hook-line" class="display fit" data-fit data-fit-max="8.5cqw" data-fit-min="3cqw" style="font-size:8.5cqw;max-width:24em">${words("Hva om et grantre kunne")} <span id="hook-accent">${words("erstatte olje?")}</span></h1>
  </div>

  <!-- S4 proof -->
  <div class="scene" id="scene-proof">
    <div id="proof-head" class="display" style="font-size:4.6cqw">${words("Avansert kjemi fra naturen")}</div>
    <div id="ring-wrap">
      <div id="ring">
        <svg viewBox="0 0 100 100"><circle id="ring-bg" cx="50" cy="50" r="44"/><circle id="ring-fg" cx="50" cy="50" r="44" pathLength="1"/></svg>
      </div>
      <div id="count-wrap"><div id="count">0</div><div id="count-lbl">Bioraffineri siden</div></div>
    </div>
    <div id="proof-stats">
      <div class="stat"><b>100+</b><span>land vi eksporterer til</span></div>
      <div class="stat"><b>0%</b><span>fossilt råstoff</span></div>
      <div class="stat"><b>1</b><span>av verdens mest avanserte bioraffinerier</span></div>
    </div>
  </div>

  <!-- S5 end / logo -->
  <div class="scene" id="scene-end">
    <svg id="mark2" viewBox="815 155 290 290" style="width:8.5cqw;height:auto">
      <g>${markSpokes}${markBonds}${markNodes}</g>
    </svg>
    <div id="end-claim" class="display" style="font-size:5cqw;margin-top:1cqw">${words("Naturens mest avanserte kjemi.")}</div>
    <div id="wordmark2" class="display" style="font-size:3.4cqw">${words("BORREGAARD")}</div>
    <div id="end-cta"><span class="dot"></span>borregaard.com</div>
  </div>

  <div id="hud">
    <div class="tl">Borregaard</div><div class="tr">● Film</div>
    <div class="bl">Fra grantre til verden</div><div class="br">26 — No</div>
  </div>
  <div id="grain"></div><div id="vig"></div>
  <svg width="0" height="0"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36d27a"/><stop offset="1" stop-color="#2bb3ff"/></linearGradient></defs></svg>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>
(function(){
  function boot(){ ${TIMELINE} }
  if(document.readyState==='complete') boot(); else window.addEventListener('load', boot);
})();
</script>
<!-- hexes:${HEX_COUNT} -->
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| hexes:", HEX_COUNT, "| bytes:", html.length);
