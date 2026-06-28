// HELLY HANSEN — "Slik holder vi deg tørr" — 30s product explainer.
// Clean Scandinavian explainer: a jacket cross-section builds layer by layer
// (LIFA base -> insulation -> Helly Tech shell). Rain streaks hit the shell and
// bounce; sweat vapor travels from the skin outward and escapes. One red accent
// payoff scene. Logo first + last. HH red / navy / warm paper.
//
// Core GSAP only. Self-contained, F11-ready.

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/hellyhansen.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

// vapor dots (sweat) — travel skin -> out; rain streaks — fall + bounce
let vapor = "";
for (let i = 0; i < 16; i++) {
  const top = 14 + (i * 73) / 16 + (i % 3) * 3;
  vapor += `<span class="vapor" style="top:${top.toFixed(1)}%"></span>`;
}
let rain = "";
for (let i = 0; i < 26; i++) {
  const left = 88 + (i % 7) * 2.0;
  rain += `<span class="rain" data-ri="${i}" style="left:${left.toFixed(1)}%"></span>`;
}
let splash = "";
for (let i = 0; i < 10; i++) splash += `<span class="splash" data-pi="${i}"></span>`;

const words = (s: string) =>
  s.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

const TIMELINE = `
var tl = gsap.timeline();
gsap.set('#world',{transformOrigin:'50% 50%'});

// ambient
gsap.to('#paperglow',{opacity:0.5,duration:5,ease:'sine.inOut',yoyo:true,repeat:-1});
gsap.to('#grain',{backgroundPosition:'160px 120px',duration:1.3,ease:'none',repeat:-1});

// ===== S1 LOGO IN (0 - 3.4) =====
tl.from('#sail path',{strokeDashoffset:1,duration:1.0,stagger:0.12,ease:'power2.out'},0.2);
tl.from('#sail .fill',{opacity:0,duration:0.6,ease:'power2.out'},0.9);
tl.from('#wm .w span',{yPercent:115,duration:0.8,stagger:0.04,ease:'expo.out'},0.7);
tl.from('#logo-sub',{opacity:0,y:12,duration:0.7,ease:'power2.out'},1.3);
tl.from('#hud',{opacity:0,duration:1.0},0.8);
tl.to('#scene-logo',{opacity:0,y:-24,duration:0.7,ease:'power2.in'},2.9);

// ===== S2 HOOK (3.4 - 7.6) =====
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.5},3.5);
tl.from('#hook-k',{opacity:0,y:14,duration:0.5,ease:'power2.out'},3.6);
tl.from('#hook-line .w span',{yPercent:120,opacity:0,duration:0.85,stagger:0.05,ease:'expo.out'},3.8);
tl.from('#hook-rain line',{opacity:0,scaleY:0,transformOrigin:'top',duration:0.5,stagger:0.04,ease:'power1.out'},4.4);
tl.to('#scene-hook',{opacity:0,y:-24,duration:0.6,ease:'power2.in'},7.0);

// ===== S3 EXPLAINER CORE (7.6 - 23.0) =====
tl.fromTo('#scene-core',{opacity:0},{opacity:1,duration:0.6},7.6);
tl.from('#core-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},7.8);
// diagram card draws in
tl.from('#xsec',{opacity:0,scale:0.94,duration:0.7,ease:'power3.out'},8.2);
tl.from('#skin',{xPercent:-120,duration:0.7,ease:'power3.out'},8.4);

// reveal each layer + its callout in sequence
var layers = ['lifa','insul','shell'];
for (var i=0;i<3;i++){
  var at = 9.2 + i*3.4;
  tl.from('#band-'+layers[i],{xPercent:140,opacity:0,duration:0.7,ease:'power3.out'},at);
  tl.fromTo('#call-'+i,{opacity:0,x:-20},{opacity:1,x:0,duration:0.6,ease:'expo.out'},at+0.25);
  tl.fromTo('#lead-'+i,{scaleX:0},{scaleX:1,transformOrigin:'left center',duration:0.5,ease:'power2.out'},at+0.3);
  tl.to('#call-'+i+' .num',{color:'#da291c',duration:0.3},at+0.3);
}

// start the physics once layers exist
tl.add(function(){
  gsap.to('#heat',{opacity:0.85,scale:1.12,duration:1.4,ease:'sine.inOut',yoyo:true,repeat:-1});
  gsap.fromTo('.vapor',{left:'7%',opacity:0},{left:'99%',opacity:1,duration:2.6,ease:'sine.in',
    stagger:{each:0.16,repeat:-1},keyframes:false,repeat:-1,
    onRepeat:function(){}});
  gsap.to('.vapor',{opacity:0,duration:0.5,delay:2.1,stagger:{each:0.16,repeat:-1},repeat:-1});
  gsap.fromTo('.rain',{top:'-12%',opacity:0.9},{top:'112%',opacity:0.9,duration:1.0,ease:'power1.in',
    stagger:{each:0.06,repeat:-1,from:'random'},repeat:-1});
  gsap.fromTo('.splash',{opacity:0,scale:0.2,x:0,y:0},{opacity:1,scale:1,x:18,y:-10,duration:0.5,ease:'power2.out',
    stagger:{each:0.22,repeat:-1,from:'random'},repeat:-1,yoyo:false,
    onStart:function(){}});
  gsap.to('.splash',{opacity:0,duration:0.4,delay:0.3,stagger:{each:0.22,repeat:-1},repeat:-1});
}, 11.0);

// gentle push to feel cinematic during the core
tl.fromTo('#xsec',{filter:'drop-shadow(0 20px 40px rgba(11,34,51,.18))'},{filter:'drop-shadow(0 28px 60px rgba(11,34,51,.26))',duration:8,ease:'sine.inOut'},11);
tl.to('#scene-core',{opacity:0,duration:0.7,ease:'power2.in'},22.4);

// ===== S4 ACCENT PAYOFF (23.0 - 26.6) =====
tl.fromTo('#scene-accent',{opacity:0},{opacity:1,duration:0.5},22.9);
tl.from('#scene-accent',{clipPath:'inset(0 0 100% 0)',duration:0.8,ease:'power4.inOut'},22.9);
tl.from('#accent-line .w span',{yPercent:120,opacity:0,duration:0.8,stagger:0.07,ease:'expo.out'},23.4);
tl.from('#accent-sub',{opacity:0,y:14,duration:0.6,ease:'power2.out'},24.3);
tl.to('#scene-accent',{opacity:0,duration:0.6,ease:'power2.in'},26.2);

// ===== S5 LOGO OUT (26.6 - 30) =====
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.7},26.4);
tl.from('#sail2 path',{strokeDashoffset:1,duration:0.9,stagger:0.1,ease:'power2.out'},26.6);
tl.from('#sail2 .fill',{opacity:0,duration:0.6},27.3);
tl.from('#wm2 .w span',{yPercent:115,duration:0.8,stagger:0.04,ease:'expo.out'},26.9);
tl.from('#end-claim',{opacity:0,y:16,duration:0.7,ease:'power2.out'},27.6);
tl.from('#end-cta',{opacity:0,y:14,duration:0.7,ease:'power2.out'},28.1);
tl.to('#end-cta .dot',{opacity:0.2,duration:0.5,yoyo:true,repeat:-1,ease:'sine.inOut'},28.6);
tl.to({},{duration:1.6},28.4);

if (window.__fitAll) window.__fitAll();
`;

const SAIL = (id: string) => `<svg id="${id}" viewBox="0 0 120 120" style="width:100%;height:100%">
  <path class="fill" d="M60 14 L60 96 L20 96 Z" fill="#da291c"/>
  <path d="M60 14 L60 96 L20 96 Z" fill="none" stroke="#da291c" stroke-width="3" pathLength="1"/>
  <path d="M66 30 L98 96 L66 96 Z" fill="none" stroke="#0b2233" stroke-width="3" pathLength="1"/>
  <line x1="14" y1="104" x2="106" y2="104" stroke="#0b2233" stroke-width="3" pathLength="1"/>
</svg>`;

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Helly Hansen — Slik holder vi deg tørr</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--paper:#f1ede6;--ink:#0e1a24;--navy:#0b2233;--red:#da291c;--dim:rgba(14,26,36,.55);--mono:'JetBrains Mono',monospace;--disp:'Oswald',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;background:var(--paper);overflow:hidden;container-type:size;color:var(--ink)}
#world{position:absolute;inset:0;z-index:2}
#paperglow{position:absolute;inset:0;z-index:0;background:radial-gradient(60cqw 50cqw at 28% 24%,rgba(255,255,255,.9),transparent 70%),radial-gradient(50cqw 40cqw at 82% 80%,rgba(218,41,28,.06),transparent 70%);opacity:.3}
#grain{position:absolute;inset:-100px;z-index:7;pointer-events:none;opacity:.04;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
#hud{position:absolute;inset:0;z-index:6;pointer-events:none;font-family:var(--mono);font-size:.95cqw;letter-spacing:.26em;text-transform:uppercase;color:rgba(14,26,36,.55)}
#hud .tl{position:absolute;top:3cqw;left:4cqw}#hud .tr{position:absolute;top:3cqw;right:4cqw;color:var(--red)}
#hud .bl{position:absolute;bottom:3cqw;left:4cqw}#hud .br{position:absolute;bottom:3cqw;right:4cqw}
.scene{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8cqw}
#scene-core{padding:5cqw 7cqw}
#scene-hook,#scene-core,#scene-accent,#scene-end{opacity:0}
.w{display:inline-block;overflow:hidden;vertical-align:top}.w>span{display:inline-block}
.kicker{font-family:var(--mono);font-size:1.1cqw;letter-spacing:.4em;text-transform:uppercase;color:var(--red);margin-bottom:1.4cqw}
.display{font-family:var(--disp);font-weight:700;text-transform:uppercase;line-height:.96;letter-spacing:.005em;margin:0;text-wrap:balance}
.sub{font-size:1.7cqw;color:var(--dim);margin-top:1.4cqw;max-width:40em;line-height:1.45}
/* logo */
.sailbox{width:9cqw;height:9cqw;margin-bottom:1.6cqw}
.path{stroke-dasharray:1}
#sail path,#sail2 path,#sail line,#sail2 line{stroke-dasharray:1}
#wm,#wm2{font-family:var(--disp);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:5cqw}
#wm2{font-size:3cqw}
#logo-sub{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.36em;text-transform:uppercase;color:var(--dim);margin-top:1cqw}
/* hook rain deco */
#hook-rain{position:absolute;inset:0;z-index:-1;width:100%;height:100%;opacity:.5}
#hook-rain line{stroke:rgba(11,34,51,.25);stroke-width:2}
/* CORE explainer layout */
#core-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.3cqw;max-width:22em;z-index:2}
#core-stage{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:space-between;gap:5cqw;width:86cqw}
#callouts{display:flex;flex-direction:column;gap:2.1cqw;flex:1;text-align:left}
.callout{display:grid;grid-template-columns:auto 1fr;gap:1.4cqw;align-items:start;opacity:0}
.callout .num{font-family:var(--disp);font-weight:700;font-size:3cqw;line-height:1;color:var(--ink);min-width:2.2em}
.callout .ct{font-family:var(--disp);font-weight:600;text-transform:uppercase;font-size:1.9cqw;letter-spacing:.04em;line-height:1.05}
.callout .cs{font-size:1.2cqw;color:var(--dim);line-height:1.4;margin-top:.3cqw}
.lead{height:2px;background:var(--red);width:2cqw;margin-top:1.1cqw;transform:scaleX(0)}
/* cross-section */
#xsec{position:relative;width:30cqw;height:44cqh;border-radius:1.6cqw;overflow:hidden;display:flex;background:#fff;box-shadow:0 20px 40px rgba(11,34,51,.18);flex:none}
.band{position:relative;height:100%;display:flex;align-items:flex-end;justify-content:center;padding-bottom:1.4cqw}
.band .bl{font-family:var(--mono);font-size:1cqw;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);writing-mode:vertical-rl;transform:rotate(180deg);position:absolute;top:1.4cqw;left:50%;translate:-50% 0;white-space:nowrap}
#skin{width:9%;background:linear-gradient(90deg,#f6e7e0,#efe2db)}
#heat{position:absolute;left:-2%;top:50%;width:16%;height:60%;transform:translateY(-50%);background:radial-gradient(circle,rgba(218,41,28,.5),transparent 70%);filter:blur(8px);opacity:.4;z-index:2;pointer-events:none}
#band-lifa{width:27%;background:repeating-linear-gradient(135deg,#e6ebe9,#e6ebe9 6px,#dfe6e3 6px,#dfe6e3 12px)}
#band-lifa .bl{color:#3a4a52}
#band-insul{width:30%;background:#eef1ee}
#band-insul::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(11,34,51,.12) 1.3px,transparent 1.3px);background-size:10px 10px;opacity:.7}
#band-shell{width:34%;background:linear-gradient(90deg,#123048,#0b2233);border-left:3px solid var(--red)}
#band-shell .bl{color:#cfe0ea}
.vapor{position:absolute;top:40%;width:.8cqw;height:.8cqw;border-radius:50%;background:rgba(43,140,200,.0);box-shadow:0 0 0 .18cqw rgba(120,170,205,.55) inset;z-index:4}
.vapor{background:radial-gradient(circle,rgba(150,195,225,.9),rgba(150,195,225,0) 70%)}
.rain{position:absolute;top:-10%;width:.28cqw;height:3.4cqw;border-radius:1cqw;background:linear-gradient(180deg,rgba(40,90,130,0),rgba(40,90,130,.7));z-index:5}
.splash{position:absolute;right:2%;top:50%;width:.7cqw;height:.7cqw;border-radius:50%;background:rgba(60,110,150,.7);z-index:5;opacity:0}
/* accent */
#scene-accent{background:var(--red);color:#fff;z-index:4}
#accent-line{font-size:11cqw}
#accent-sub{font-family:var(--mono);font-size:1.4cqw;letter-spacing:.34em;text-transform:uppercase;margin-top:1.6cqw;opacity:.92}
/* end */
#end-claim{font-family:var(--disp);text-transform:uppercase;font-weight:600;font-size:2.4cqw;letter-spacing:.02em;margin-top:1cqw;max-width:20em;line-height:1.1}
#end-cta{margin-top:1.8cqw;font-family:var(--mono);font-size:1.3cqw;letter-spacing:.32em;text-transform:uppercase;display:flex;align-items:center;gap:1cqw}
#end-cta .dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--red)}
</style></head>
<body>
<main id="stage">
  <div id="paperglow"></div>
  <div id="world">

  <!-- S1 logo -->
  <div class="scene" id="scene-logo">
    <div class="sailbox">${SAIL("sail")}</div>
    <div id="wm" class="display">${words("HELLY HANSEN")}</div>
    <div id="logo-sub">Siden 1877 · Moss, Norge</div>
  </div>

  <!-- S2 hook -->
  <div class="scene" id="scene-hook">
    <svg id="hook-rain" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      ${Array.from({ length: 22 }, (_, i) => `<line x1="${80 + i * 84}" y1="0" x2="${20 + i * 84}" y2="1080"/>`).join("")}
    </svg>
    <div id="hook-k" class="kicker">Regn ute · svette inne</div>
    <h1 id="hook-line" class="display fit" data-fit data-fit-max="8cqw" data-fit-min="3cqw" style="font-size:8cqw;max-width:18em">${words("Hvordan holder du deg tørr")} <span style="color:var(--red)">${words("fra begge?")}</span></h1>
  </div>

  <!-- S3 explainer core -->
  <div class="scene" id="scene-core">
    <div id="core-head" class="display">${words("Tre lag. Én jobb: holde deg tørr.")}</div>
    <div id="core-stage">
      <div id="callouts">
        <div class="callout" id="call-0"><div class="num">01</div><div><div class="ct">LIFA®</div><div class="cs">Frakter svette vekk fra huden — med en gang.</div><div class="lead" id="lead-0"></div></div></div>
        <div class="callout" id="call-1"><div class="num">02</div><div><div class="ct">Isolasjon</div><div class="cs">Låser inne kroppsvarmen, også når det er vått.</div><div class="lead" id="lead-1"></div></div></div>
        <div class="callout" id="call-2"><div class="num">03</div><div><div class="ct">Helly Tech®</div><div class="cs">Stopper regn og vind ute — slipper svette ut.</div><div class="lead" id="lead-2"></div></div></div>
      </div>
      <div id="xsec">
        <div id="heat"></div>
        <div class="band" id="skin"><span class="bl">Hud</span></div>
        <div class="band" id="band-lifa"><span class="bl">LIFA®</span></div>
        <div class="band" id="band-insul"><span class="bl">Isolasjon</span></div>
        <div class="band" id="band-shell"><span class="bl">Helly Tech®</span></div>
        ${vapor}${rain}${splash}
      </div>
    </div>
  </div>

  <!-- S4 accent payoff -->
  <div class="scene" id="scene-accent">
    <h1 id="accent-line" class="display">${words("Tørr. Varm. Klar.")}</h1>
    <div id="accent-sub">Bygget for de tøffeste forholdene</div>
  </div>

  <!-- S5 logo out -->
  <div class="scene" id="scene-end">
    <div class="sailbox" style="width:7cqw;height:7cqw">${SAIL("sail2")}</div>
    <div id="wm2" class="display">${words("HELLY HANSEN")}</div>
    <div id="end-claim" class="display">Bygget for de tøffeste forholdene siden 1877</div>
    <div id="end-cta"><span class="dot"></span>hellyhansen.com</div>
  </div>

  </div>
  <div id="hud"><div class="tl">Helly Hansen</div><div class="tr">● Explainer</div><div class="bl">Slik holder vi deg tørr</div><div class="br">26 — No</div></div>
  <div id="grain"></div>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>(function(){function boot(){ ${TIMELINE} } if(document.readyState==='complete')boot();else window.addEventListener('load',boot);})();</script>
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| bytes:", html.length);
