// BRAATHE (iteam Braathe) — "Bekymringsfri IT" — 30s premium brand film.
// Uses REAL assets pulled from braathe.no: the actual logo SVG (first + last
// slide), real brand colours (#004851 petrol + #eed484 gold), real copy
// ("Bekymringsfri IT", "Global IT lokalt", "Et hav av muligheter") and a real
// photo from their site. Font: Hanken Grotesk — closest free twin of their
// licensed Aeonik Pro (which can't be legally embedded).
//
// Concept: your business sits still at the centre while the IT services ORBIT
// around it and quietly handle everything.

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/braathe.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

// real logo: split the first path (the mark) from the wordmark so we can tint
// the mark gold and animate it separately.
const rawLogo = readFileSync(`${SCRATCH}/braathe-logo.svg`, "utf8");
const logoInner = rawLogo.replace(/^[\s\S]*?<g fill="#f3f3f3">/, "").replace(/<\/g><\/svg>\s*$/, "");
const firstPathEnd = logoInner.indexOf("/>") + 2;
const markPath = logoInner.slice(0, firstPathEnd).replace("<path ", '<path class="bm" ');
const wordPaths = logoInner.slice(firstPathEnd);
const LOGO = (cls: string) =>
  `<svg class="${cls}" viewBox="0 0 164 24" xmlns="http://www.w3.org/2000/svg"><g fill="#f3f3f3"><g class="mk">${markPath}</g><g class="wd">${wordPaths}</g></g></svg>`;

const dataUri = (f: string, mime: string) =>
  `data:${mime};base64,` + readFileSync(`${SCRATCH}/${f}`).toString("base64");
const archImg = dataUri("braathe-arch.jpg", "image/jpeg");
const shapesImg = dataUri("braathe-shapes.jpg", "image/jpeg");

const words = (s: string) =>
  s.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

const NODES = [
  { x: 50, y: 0, t: "Nettsky", s: "Skalerbart" },
  { x: 100, y: 50, t: "Infrastruktur", s: "Stabilt" },
  { x: 50, y: 100, t: "Sikkerhet", s: "Beskyttet" },
  { x: 0, y: 50, t: "Support", s: "Alltid der" },
];
const nodeEls = NODES.map(
  (n, i) => `<div class="node" data-ni="${i}" style="left:${n.x}%;top:${n.y}%"><div class="node-in"><div class="node-dot"></div><div class="node-card"><div class="node-t">${n.t}</div><div class="node-s">${n.s}</div></div></div></div>`,
).join("");
const lineEls = NODES.map((n) => `<line x1="50" y1="50" x2="${n.x}" y2="${n.y}" class="spoke" pathLength="1"/>`).join("");

const TIMELINE = `
var tl = gsap.timeline();
gsap.set('#world',{transformOrigin:'50% 50%'});
gsap.to('#glow',{opacity:0.55,scale:1.1,duration:6,ease:'sine.inOut',yoyo:true,repeat:-1});
gsap.to('#grain',{backgroundPosition:'150px 110px',duration:1.4,ease:'none',repeat:-1});
gsap.to('#ringdash',{strokeDashoffset:-40,duration:14,ease:'none',repeat:-1});

// ===== S1 LOGO (0 - 3.4) =====
tl.from('#blogo .mk',{xPercent:-40,opacity:0,duration:0.8,ease:'power3.out'},0.3);
tl.from('#blogo',{clipPath:'inset(0 100% 0 0)',duration:1.0,ease:'power3.inOut'},0.4);
tl.from('#logo-sub',{opacity:0,y:12,duration:0.7,ease:'power2.out'},1.2);
tl.from('#hud',{opacity:0,duration:1.0},0.8);
tl.to('#scene-logo',{opacity:0,y:-22,duration:0.7,ease:'power2.in'},3.0);

// ===== S2 HOOK (3.4 - 8.0) =====
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.5},3.5);
tl.from('.chip',{opacity:0,scale:0.6,duration:0.4,stagger:0.06,ease:'back.out(2)'},3.6);
tl.to('.chip',{opacity:0,y:-30,filter:'blur(6px)',duration:0.9,stagger:0.05,ease:'power2.in'},5.4);
tl.from('#hook-line .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.05,ease:'expo.out'},5.0);
tl.from('#hook-accent',{'--uw':'0%',duration:0.9,ease:'power3.inOut'},6.0);
tl.to('#scene-hook',{opacity:0,y:-22,duration:0.6,ease:'power2.in'},7.4);

// ===== S3 ORBIT (8.0 - 18.0) =====
tl.fromTo('#scene-orbit',{opacity:0},{opacity:1,duration:0.6},8.0);
tl.from('#orbit-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},8.2);
tl.from('#orbit',{scale:0.7,opacity:0,duration:0.9,ease:'power3.out'},8.4);
tl.from('#core',{scale:0,transformOrigin:'50% 50%',duration:0.7,ease:'back.out(2)'},8.8);
tl.from('.spoke',{strokeDashoffset:1,duration:0.7,stagger:0.12,ease:'power2.out'},9.2);
tl.from('.node',{scale:0,opacity:0,transformOrigin:'50% 50%',duration:0.6,stagger:0.14,ease:'back.out(2.2)'},9.4);
tl.add(function(){
  gsap.to('#orbit-spin',{rotation:360,duration:30,ease:'none',repeat:-1,transformOrigin:'50% 50%'});
  gsap.to('.node-in',{rotation:-360,duration:30,ease:'none',repeat:-1,transformOrigin:'50% 50%'});
  gsap.to('#core',{boxShadow:'0 0 0 1.4cqw rgba(238,212,132,.16)',duration:2.2,ease:'sine.inOut',yoyo:true,repeat:-1});
},10.2);
tl.to('#scene-orbit',{opacity:0,duration:0.7,ease:'power2.in'},17.6);

// ===== S4 PROOF (18.0 - 24.0) — real photo bg =====
tl.fromTo('#scene-proof',{opacity:0},{opacity:1,duration:0.6},18.0);
tl.fromTo('#proof-photo',{scale:1.12,opacity:0},{scale:1,opacity:1,duration:6,ease:'none'},18.0);
tl.from('#proof-k',{opacity:0,y:12,duration:0.5,ease:'power2.out'},18.4);
tl.from('#proof-line .w span',{yPercent:120,opacity:0,duration:0.8,stagger:0.06,ease:'expo.out'},18.6);
tl.fromTo('#horizon',{scaleX:0},{scaleX:1,transformOrigin:'left center',duration:1.1,ease:'power3.inOut'},19.4);
var c={v:0};
tl.to(c,{v:24,duration:1.2,ease:'power2.out',onUpdate:function(){var e=document.getElementById('p247');if(e)e.textContent=Math.round(c.v);}},19.8);
tl.from('#proof-stats .stat',{opacity:0,y:18,duration:0.6,stagger:0.16,ease:'power2.out'},20.0);
tl.to('#scene-proof',{opacity:0,duration:0.7,ease:'power2.in'},23.4);

// ===== S5 CTA + LOGO (24.0 - 30) =====
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.7},23.8);
tl.from('#blogo2',{clipPath:'inset(0 100% 0 0)',duration:0.9,ease:'power3.inOut'},24.0);
tl.from('#end-claim .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.06,ease:'expo.out'},24.4);
tl.from('#end-cta',{opacity:0,y:14,duration:0.7,ease:'power2.out'},25.4);
tl.to('#end-cta .dot',{opacity:0.2,duration:0.5,yoyo:true,repeat:-1,ease:'sine.inOut'},26.0);
tl.to({},{duration:2.2},25.8);

if (window.__fitAll) window.__fitAll();
`;

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Braathe — Bekymringsfri IT</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--teal:#004851;--gold:#eed484;--gold2:#f4e6b6;--ink:#eef3f2;--dim:rgba(238,243,242,.62);--mono:'JetBrains Mono',monospace;--disp:'Hanken Grotesk',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:'Inter',system-ui,sans-serif}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;background:var(--teal);overflow:hidden;container-type:size;color:var(--ink)}
#world{position:absolute;inset:0;z-index:2}
#bg{position:absolute;inset:0;z-index:0;background:radial-gradient(70cqw 60cqw at 50% 30%,#015c68,#01323a 72%)}
#shapes{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;opacity:.10;mix-blend-mode:screen}
#glow{position:absolute;left:50%;top:48%;width:60cqw;height:60cqw;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(238,212,132,.18),transparent 65%);opacity:.35;z-index:0}
#grain{position:absolute;inset:-100px;z-index:8;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
#hud{position:absolute;inset:0;z-index:7;pointer-events:none;font-family:var(--mono);font-size:.95cqw;letter-spacing:.26em;text-transform:uppercase;color:rgba(238,243,242,.6)}
#hud .tl{position:absolute;top:3cqw;left:4cqw}#hud .tr{position:absolute;top:3cqw;right:4cqw;color:var(--gold)}
#hud .bl{position:absolute;bottom:3cqw;left:4cqw}#hud .br{position:absolute;bottom:3cqw;right:4cqw}
.scene{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8cqw}
#scene-hook,#scene-orbit,#scene-proof,#scene-end{opacity:0}
.w{display:inline-block;overflow:hidden;vertical-align:top}.w>span{display:inline-block}
.kicker{font-family:var(--mono);font-size:1.1cqw;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:1.4cqw}
.display{font-family:var(--disp);font-weight:700;line-height:1.02;letter-spacing:-.015em;margin:0;text-wrap:balance}
/* real logo */
.blogo-svg{height:auto}
#blogo{width:34cqw}#blogo2{width:22cqw}
.blogo-svg .mk path{fill:var(--gold)}
.blogo-svg .wd path{fill:var(--ink)}
#logo-sub{font-family:var(--mono);font-size:1.05cqw;letter-spacing:.34em;text-transform:uppercase;color:var(--dim);margin-top:1.8cqw}
/* hook */
#chips{position:absolute;inset:0;z-index:-1}
.chip{position:absolute;font-family:var(--mono);font-size:1cqw;letter-spacing:.04em;background:rgba(255,255,255,.06);border:1px solid rgba(238,243,242,.16);color:var(--dim);padding:.7cqw 1.2cqw;border-radius:.6cqw;white-space:nowrap}
#hook-line{font-size:7.5cqw;max-width:20em}
#hook-accent{position:relative;color:var(--gold)}
#hook-accent::after{content:"";position:absolute;left:0;right:0;bottom:-.08em;height:.06em;background:var(--gold);width:var(--uw,100%)}
/* orbit */
#orbit-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.4cqw;max-width:18em;z-index:4;font-family:var(--disp);font-weight:700}
#orbit{position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);width:42cqh;height:42cqh}
#orbit svg.ring{position:absolute;inset:0;width:100%;height:100%}
#ringdash{fill:none;stroke:rgba(238,212,132,.45);stroke-width:.5;stroke-dasharray:2 3}
.spoke{stroke:rgba(238,243,242,.28);stroke-width:.5;stroke-dasharray:1}
#orbit-spin{position:absolute;inset:0}
#core{position:absolute;left:50%;top:50%;width:14cqh;height:14cqh;transform:translate(-50%,-50%);border-radius:50%;background:rgba(238,212,132,.1);border:1.5px solid var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:3}
#core .ct{font-family:var(--disp);font-weight:700;font-size:1.6cqw;line-height:1.05}
#core .cs{font-family:var(--mono);font-size:.8cqw;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:.3cqw}
.node{position:absolute;transform:translate(-50%,-50%);z-index:4}
.node-in{display:flex;flex-direction:column;align-items:center;gap:.7cqw}
.node-dot{width:1.4cqw;height:1.4cqw;border-radius:50%;background:var(--gold);box-shadow:0 0 .8cqw rgba(238,212,132,.7)}
.node-card{background:rgba(1,40,46,.72);border:1px solid rgba(238,212,132,.3);border-radius:.7cqw;padding:.7cqw 1.1cqw;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center}
.node-t{font-family:var(--disp);font-weight:700;font-size:1.45cqw;line-height:1}
.node-s{font-family:var(--mono);font-size:.8cqw;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-top:.3cqw}
/* proof (real photo) */
#proof-photo{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center}
#proof-grade{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,50,58,.78),rgba(0,40,46,.62)),radial-gradient(60cqw 50cqw at 50% 50%,rgba(0,40,46,.2),rgba(0,30,34,.85))}
#scene-proof .inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center}
#proof-line{font-size:6cqw}#proof-line .g{color:var(--gold)}
#horizon{height:2px;width:42cqw;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:2cqw 0 .6cqw;transform:scaleX(0)}
#proof-stats{display:flex;gap:5cqw;margin-top:2.2cqw}
.stat{display:flex;flex-direction:column;gap:.3cqw}.stat b{font-family:var(--disp);font-weight:800;font-size:2.6cqw}
.stat span{font-size:1.05cqw;color:var(--dim);letter-spacing:.03em}
/* end */
#end-claim{font-family:var(--disp);font-weight:800;font-size:6.5cqw;margin-top:.4cqw}
#end-cta{margin-top:1.8cqw;font-family:var(--mono);font-size:1.3cqw;letter-spacing:.32em;text-transform:uppercase;display:flex;align-items:center;gap:1cqw}
#end-cta .dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--gold)}
</style></head>
<body>
<main id="stage">
  <div id="bg"></div><div id="shapes" style="background-image:url('${shapesImg}')"></div><div id="glow"></div>
  <div id="world">

  <div class="scene" id="scene-logo">
    ${LOGO("blogo-svg").replace('class="blogo-svg"', 'class="blogo-svg" id="blogo"')}
    <div id="logo-sub">Bekymringsfri IT · del av iteam</div>
  </div>

  <div class="scene" id="scene-hook">
    <div id="chips">
      <div class="chip" style="left:14%;top:26%">⚠ server nede</div>
      <div class="chip" style="left:69%;top:22%">⚠ backup feilet</div>
      <div class="chip" style="left:22%;top:70%">⚠ lisens utløpt</div>
      <div class="chip" style="left:63%;top:69%">⚠ sikkerhetsvarsel</div>
      <div class="chip" style="left:44%;top:17%">⚠ treg e-post</div>
    </div>
    <h1 id="hook-line" class="display fit" data-fit data-fit-max="7.5cqw" data-fit-min="3cqw">${words("IT skal ikke være noe")} <span id="hook-accent">${words("du tenker på.")}</span></h1>
  </div>

  <div class="scene" id="scene-orbit">
    <div id="orbit-head">${words("Vi håndterer IT-en. Du driver bedriften.")}</div>
    <div id="orbit">
      <svg class="ring" viewBox="0 0 100 100"><circle id="ringdash" cx="50" cy="50" r="46"/></svg>
      <div id="orbit-spin">
        <svg class="ring" viewBox="0 0 100 100" style="overflow:visible">${lineEls}</svg>
        ${nodeEls}
      </div>
      <div id="core"><div class="ct">Din bedrift</div><div class="cs">i ro</div></div>
    </div>
  </div>

  <div class="scene" id="scene-proof">
    <div id="proof-photo" style="background-image:url('${archImg}')"></div>
    <div id="proof-grade"></div>
    <div class="inner">
      <div id="proof-k" class="kicker">Et hav av muligheter</div>
      <h1 id="proof-line" class="display">${words("Global IT —")} <span class="g">${words("levert lokalt.")}</span></h1>
      <div id="horizon"></div>
      <div id="proof-stats">
        <div class="stat"><b><span id="p247">0</span>/7</b><span>overvåking og support</span></div>
        <div class="stat"><b>100%</b><span>fokus på din drift</span></div>
        <div class="stat"><b>iteam</b><span>nordisk slagkraft, lokalt nær</span></div>
      </div>
    </div>
  </div>

  <div class="scene" id="scene-end">
    ${LOGO("blogo-svg").replace('class="blogo-svg"', 'class="blogo-svg" id="blogo2"')}
    <h1 id="end-claim" class="display">Bekymringsfri IT.</h1>
    <div id="end-cta"><span class="dot"></span>braathe.no · Global IT lokalt</div>
  </div>

  </div>
  <div id="hud"><div class="tl">Braathe</div><div class="tr">● Film</div><div class="bl">Bekymringsfri IT</div><div class="br">26 — No</div></div>
  <div id="grain"></div>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>(function(){function boot(){ ${TIMELINE} } if(document.readyState==='complete')boot();else window.addEventListener('load',boot);})();</script>
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| bytes:", html.length);
