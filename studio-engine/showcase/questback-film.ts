// QUESTBACK — "Tilbakemeldinger – din vinnende strategi" — 40s B2B brand film.
// Built from Questback's REAL brand system pulled from their page source: real
// colours (dark green / cream / purple / yellow), real fonts (Marcellus serif +
// Onest sans), real copy, real customer names, real testimonial, real stats.
// Design-/data-led (matching their actual site, which is illustration + product
// data, not photography). Logo recreated as a clean wordmark (their logo SVG and
// photos are 403-blocked) — swap in the real files when available.

import { writeFileSync, readFileSync } from "node:fs";
import { FIT_TEXT_RUNTIME } from "../reel/fit-text";

const SCRATCH = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const OUT = "/home/user/nettside/studio-engine/out/questback.html";
const gsap = readFileSync(`${SCRATCH}/gsap.min.js`, "utf8");

const words = (s: string) =>
  s.split(" ").map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

const CUSTOMERS = ["Posten", "Telia", "Visma", "Skanska", "BI", "Atea", "ISS", "Finn", "Apotek1", "Byggmakker"];
const customerEls = CUSTOMERS.map((c) => `<div class="logo">${c}</div>`).join("");

const QUESTS = [
  { t: "EmployeeQuest™", s: "Øk engasjement og vekst med medarbeiderundersøkelser." },
  { t: "CustomerQuest™", s: "Styrk kundelojaliteten med innsikt fra tilbakemeldinger." },
  { t: "MarketQuest™", s: "Oppdag nye vekstmuligheter gjennom markedsforskning." },
];
const questEls = QUESTS.map(
  (q, i) => `<div class="quest" data-qi="${i}"><div class="qbar"></div><div class="qt">${q.t}</div><div class="qs">${q.s}</div></div>`,
).join("");

// data bars for the "report" motif
const BARS = [62, 88, 47, 74, 95, 58];
const barEls = BARS.map((h, i) => `<div class="bar" data-bi="${i}" style="--h:${h}%"></div>`).join("");

const TIMELINE = `
var tl = gsap.timeline();
gsap.to('#grain',{backgroundPosition:'140px 100px',duration:1.4,ease:'none',repeat:-1});

// S1 LOGO (0-4.2) cream
tl.from('#logo1 .qmark',{scale:0,transformOrigin:'50% 50%',duration:0.7,ease:'back.out(2)'},0.3);
tl.from('#logo1 .word',{opacity:0,x:-18,duration:0.8,ease:'power3.out'},0.5);
tl.from('#logo1 .dot',{scale:0,transformOrigin:'50% 50%',duration:0.5,ease:'back.out(3)'},1.0);
tl.from('#logo-sub',{opacity:0,y:14,duration:0.8,ease:'power2.out'},1.2);
tl.from('#hud',{opacity:0,duration:1.0},0.8);

// S2 HOOK (4.2-10) dark green
tl.fromTo('#scene-hook',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},4.0);
tl.from('.chip',{opacity:0,scale:0.5,duration:0.5,stagger:0.08,ease:'back.out(2)'},4.4);
tl.to('.chip',{y:'-=14',duration:2.4,ease:'sine.inOut',yoyo:true,repeat:-1,stagger:{each:0.2,from:'random'}},5.0);
tl.from('#hook-line .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.05,ease:'expo.out'},5.0);
tl.from('#hook-sub',{opacity:0,y:16,duration:0.7,ease:'power2.out'},6.2);

// S3 PRODUCT FLOW (10-18) cream — survey -> NPS gauge -> report
tl.fromTo('#scene-flow',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},9.6);
tl.from('#flow-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},9.9);
tl.from('#card-survey',{opacity:0,y:30,duration:0.7,ease:'power3.out'},10.4);
tl.from('#card-survey .row',{opacity:0,x:-16,duration:0.5,stagger:0.12,ease:'power2.out'},10.7);
tl.from('.flow-arrow',{opacity:0,scaleX:0,transformOrigin:'left center',duration:0.5,stagger:0.5,ease:'power2.out'},11.4);
tl.from('#gauge-wrap',{opacity:0,scale:0.85,duration:0.7,ease:'power3.out'},11.8);
tl.fromTo('#gauge-fg',{strokeDashoffset:1},{strokeDashoffset:0.32,duration:1.4,ease:'power2.inOut'},12.0);
var g={v:0};tl.to(g,{v:68,duration:1.4,ease:'power2.out',onUpdate:function(){var e=document.getElementById('gauge-num');if(e)e.textContent=Math.round(g.v);}},12.0);
tl.from('#card-report',{opacity:0,y:30,duration:0.7,ease:'power3.out'},12.6);
tl.from('.bar',{scaleY:0,transformOrigin:'bottom center',duration:0.7,stagger:0.08,ease:'power3.out'},13.0);

// S4 SOLUTIONS (18-25) dark green — three quests one by one
tl.fromTo('#scene-quests',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},17.6);
tl.from('#quests-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},17.9);
tl.from('.quest',{y:46,opacity:0,duration:0.7,stagger:0.6,ease:'power3.out'},18.5);
tl.from('.qbar',{scaleX:0,transformOrigin:'left center',duration:0.5,stagger:0.6,ease:'power2.out'},18.7);

// S5 SOCIAL PROOF (25-33) cream — customer wall + stats
tl.fromTo('#scene-proof',{opacity:0},{opacity:1,duration:0.8,ease:'power1.inOut'},24.8);
tl.from('#proof-head .w span',{yPercent:120,opacity:0,duration:0.7,stagger:0.04,ease:'expo.out'},25.1);
tl.from('.logo',{opacity:0,y:20,scale:0.8,duration:0.6,stagger:0.07,ease:'back.out(1.6)'},25.6);
tl.from('#proof-stats .st',{opacity:0,y:16,duration:0.6,stagger:0.15,ease:'power2.out'},27.8);
tl.from('#quote',{opacity:0,y:20,duration:0.8,ease:'power2.out'},29.4);

// S6 CTA + LOGO (33-40) dark green
tl.fromTo('#scene-end',{opacity:0},{opacity:1,duration:0.9,ease:'power1.inOut'},33.0);
tl.from('#logo2 .qmark',{scale:0,transformOrigin:'50% 50%',duration:0.6,ease:'back.out(2)'},33.4);
tl.from('#logo2 .word',{opacity:0,x:-16,duration:0.7,ease:'power3.out'},33.6);
tl.from('#end-claim .w span',{yPercent:120,opacity:0,duration:0.9,stagger:0.06,ease:'expo.out'},33.9);
tl.from('#end-pills .pill',{opacity:0,y:14,duration:0.6,stagger:0.14,ease:'power2.out'},34.9);
tl.from('#end-contact',{opacity:0,y:12,duration:0.6,ease:'power2.out'},35.8);
tl.to('#end-cta-dot',{opacity:0.3,duration:0.6,yoyo:true,repeat:-1,ease:'sine.inOut'},36.2);
tl.to({},{duration:2.4},37.0);

if (window.__fitAll) window.__fitAll();
`;

// Questback wordmark (recreated): rounded "Q" mark + "Questback" + feedback dot
const WORD = (id: string, scale: string) => `<div class="qlogo" id="${id}" style="font-size:${scale}">
  <span class="qmark"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="5"/><path d="M28 28 L37 37" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></span><span class="word">Questback</span><span class="dot"></span></div>`;

const html = `<!DOCTYPE html>
<html lang="no"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Questback — Tilbakemeldinger, din vinnende strategi</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Onest:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<script>${gsap}</script>
<style>
:root{--green:#273E32;--green1:#286043;--green2:#A5C4A5;--green3:#C4D5B6;--cream:#F5F5E8;--cream2:#E7E6B3;--beige:#B1A768;--purple:#9F82F6;--yellow:#FFC950;--ink:#333333;--disp:'Marcellus',serif;--sans:'Onest',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:var(--sans)}
#stage{position:relative;margin:auto;width:min(100vw,177.78vh);height:min(56.25vw,100vh);aspect-ratio:16/9;overflow:hidden;container-type:size;background:var(--cream)}
#world{position:absolute;inset:0;z-index:2}
#grain{position:absolute;inset:-100px;z-index:9;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNjAnIGhlaWdodD0nMTYwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzInLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknLz48L3N2Zz4=")}
#hud{position:absolute;inset:0;z-index:8;pointer-events:none;font-family:var(--sans);font-size:.92cqw;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:var(--beige)}
#hud .tl{position:absolute;top:3.2cqw;left:4cqw}#hud .tr{position:absolute;top:3.2cqw;right:4cqw}
#hud .bl{position:absolute;bottom:3.2cqw;left:4cqw}#hud .br{position:absolute;bottom:3.2cqw;right:4cqw}
.scene{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7cqw;background:var(--cream);color:var(--ink)}
#scene-hook,#scene-flow,#scene-quests,#scene-proof,#scene-end{opacity:0}
#scene-hook,#scene-quests,#scene-end{background:var(--green);color:var(--cream)}
.w{display:inline-block;overflow:hidden;vertical-align:top}.w>span{display:inline-block}
.display{font-family:var(--disp);line-height:1.08;margin:0;text-wrap:balance}
.kicker{font-family:var(--sans);font-size:1.05cqw;letter-spacing:.28em;text-transform:uppercase;color:var(--beige);font-weight:700;margin-bottom:1.4cqw}
/* logo */
.qlogo{display:flex;align-items:center;gap:.34em;color:var(--green)}
#scene-end .qlogo{color:var(--cream)}
.qlogo .qmark{width:1.06em;height:1.06em;display:inline-flex;color:var(--purple)}
.qlogo .qmark svg{width:100%;height:100%}
.qlogo .word{font-family:var(--sans);font-weight:800;letter-spacing:-.02em}
.qlogo .dot{width:.18em;height:.18em;border-radius:50%;background:var(--yellow);align-self:flex-end;margin-bottom:.18em}
#logo-sub{font-family:var(--disp);font-size:2.4cqw;color:var(--green1);margin-top:1.8cqw}
/* hook */
#chips{position:absolute;inset:0;z-index:-1}
.chip{position:absolute;font-family:var(--sans);font-size:1.1cqw;font-weight:600;padding:.7cqw 1.2cqw;border-radius:2cqw;background:rgba(245,245,232,.08);border:1px solid rgba(165,196,165,.3);color:var(--green2)}
.chip.y{color:var(--yellow);border-color:rgba(255,201,80,.4)}.chip.p{color:var(--purple);border-color:rgba(159,130,246,.4)}
#hook-line{font-size:7cqw;max-width:17em;color:var(--cream)}
#hook-line em{font-style:italic;color:var(--green2)}
#hook-sub{font-family:var(--sans);font-size:1.8cqw;color:var(--green2);margin-top:1.6cqw;max-width:38em;line-height:1.45}
/* flow */
#flow-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.6cqw;color:var(--green);font-family:var(--disp);z-index:4}
#flow-row{display:flex;align-items:center;gap:3cqw;margin-top:4cqw}
.card{background:#fff;border-radius:1.4cqw;padding:1.8cqw;box-shadow:0 1.4cqw 3cqw rgba(39,62,50,.12);text-align:left}
#card-survey{width:22cqw}
.card-h{font-family:var(--sans);font-weight:700;font-size:1.3cqw;color:var(--green);margin-bottom:1.2cqw;display:flex;align-items:center;gap:.6cqw}
.card-h::before{content:"";width:.8cqw;height:.8cqw;border-radius:50%;background:var(--purple)}
#card-survey .row{display:flex;align-items:center;gap:.8cqw;margin:.7cqw 0;font-size:1.1cqw;color:var(--ink)}
#card-survey .row .stars{color:var(--yellow);letter-spacing:.1em}
#card-survey .row .pillbar{flex:1;height:.7cqw;border-radius:1cqw;background:var(--green3);position:relative;overflow:hidden}
#card-survey .row .pillbar::after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--p,60%);background:var(--green1);border-radius:1cqw}
.flow-arrow{width:3cqw;height:2px;background:var(--green1);position:relative;flex:none}
.flow-arrow::after{content:"";position:absolute;right:-1px;top:-3px;border-left:7px solid var(--green1);border-top:4px solid transparent;border-bottom:4px solid transparent}
#gauge-wrap{position:relative;width:17cqw;height:17cqw}
#gauge-wrap svg{width:100%;height:100%;transform:rotate(-90deg)}
#gauge-bg{fill:none;stroke:var(--green3);stroke-width:7}
#gauge-fg{fill:none;stroke:url(#gg);stroke-width:7;stroke-linecap:round;stroke-dasharray:1}
#gauge-num-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
#gauge-num{font-family:var(--disp);font-size:5cqw;color:var(--green);line-height:1}
#gauge-lbl{font-family:var(--sans);font-weight:700;font-size:1cqw;letter-spacing:.2em;color:var(--beige)}
#card-report{width:20cqw}
#bars{display:flex;align-items:flex-end;gap:1cqw;height:9cqw;margin-top:.4cqw}
.bar{flex:1;height:var(--h);border-radius:.5cqw .5cqw 0 0;background:linear-gradient(180deg,var(--green1),var(--green2))}
.bar[data-bi="4"]{background:linear-gradient(180deg,var(--purple),#c3b0f7)}
/* quests */
#quests-head{position:absolute;top:6cqw;left:7cqw;text-align:left;font-size:2.6cqw;color:var(--cream);font-family:var(--disp);z-index:4;max-width:18em}
#quests-row{display:flex;gap:2.6cqw;margin-top:5cqw}
.quest{width:21cqw;background:rgba(245,245,232,.06);border:1px solid rgba(165,196,165,.25);border-radius:1.4cqw;padding:2cqw;text-align:left}
.qbar{height:.4cqw;width:4cqw;background:var(--yellow);border-radius:1cqw;margin-bottom:1.4cqw}
.quest[data-qi="1"] .qbar{background:var(--purple)}.quest[data-qi="2"] .qbar{background:var(--green2)}
.qt{font-family:var(--disp);font-size:2.1cqw;color:var(--cream);margin-bottom:.8cqw}
.qs{font-family:var(--sans);font-size:1.15cqw;color:var(--green2);line-height:1.45}
/* proof */
#proof-head{font-family:var(--disp);font-size:3.4cqw;color:var(--green)}
#logos{display:flex;flex-wrap:wrap;gap:1.4cqw 2cqw;justify-content:center;max-width:74cqw;margin:2.4cqw 0}
.logo{font-family:var(--sans);font-weight:800;font-size:2cqw;color:var(--green1);opacity:.92;letter-spacing:-.01em}
#proof-stats{display:flex;gap:4cqw;margin-top:.6cqw}
.st{display:flex;flex-direction:column;gap:.2cqw}.st b{font-family:var(--disp);font-size:2.6cqw;color:var(--green)}
.st span{font-family:var(--sans);font-size:1cqw;color:var(--ink);opacity:.7}
#quote{font-family:var(--disp);font-style:italic;font-size:1.9cqw;color:var(--green1);max-width:40em;margin-top:2.4cqw;line-height:1.4}
#quote cite{display:block;font-style:normal;font-family:var(--sans);font-size:1.05cqw;color:var(--beige);margin-top:1cqw;font-weight:700;letter-spacing:.04em}
/* end */
#end-claim{font-family:var(--disp);font-size:6cqw;color:var(--cream);margin:1.6cqw 0 .4cqw;max-width:18em}
#end-pills{display:flex;gap:1.4cqw;margin-top:1.6cqw}
.pill{font-family:var(--sans);font-weight:600;font-size:1.2cqw;padding:.8cqw 1.6cqw;border-radius:3cqw;background:rgba(245,245,232,.08);border:1px solid rgba(165,196,165,.3);color:var(--cream)}
.pill.go{background:var(--yellow);color:var(--green);border:none;font-weight:800}
#end-contact{font-family:var(--sans);font-size:1.1cqw;color:var(--green2);margin-top:2cqw;letter-spacing:.04em;display:flex;align-items:center;gap:1cqw}
#end-cta-dot{width:.7cqw;height:.7cqw;border-radius:50%;background:var(--yellow)}
</style></head>
<body>
<main id="stage"><div id="world">

  <div class="scene" id="scene-logo">
    ${WORD("logo1", "7cqw")}
    <div id="logo-sub">Tilbakemeldinger – din vinnende strategi</div>
  </div>

  <div class="scene" id="scene-hook">
    <div id="chips">
      <div class="chip y" style="left:13%;top:24%">★★★★★</div>
      <div class="chip" style="left:70%;top:20%">NPS +72</div>
      <div class="chip p" style="left:22%;top:70%">eNPS</div>
      <div class="chip" style="left:66%;top:68%">"Anbefaler dere"</div>
      <div class="chip y" style="left:44%;top:16%">92% svar</div>
      <div class="chip p" style="left:80%;top:46%">Innsikt</div>
    </div>
    <h1 id="hook-line" class="display">${words("Hva forteller kundene og ansatte dine deg")} <em>${words("egentlig?")}</em></h1>
    <div id="hook-sub">Øk organisasjonens effektivitet og lønnsomhet med nyskapende innsikt.</div>
  </div>

  <div class="scene" id="scene-flow">
    <div id="flow-head" class="display">${words("Fra spørsmål til innsikt — på minutter")}</div>
    <div id="flow-row">
      <div class="card" id="card-survey">
        <div class="card-h">Undersøkelse</div>
        <div class="row"><span>Hvor fornøyd er du?</span><span class="stars">★★★★★</span></div>
        <div class="row"><span class="pillbar" style="--p:82%"></span></div>
        <div class="row"><span>Vil du anbefale oss?</span></div>
        <div class="row"><span class="pillbar" style="--p:68%"></span></div>
      </div>
      <div class="flow-arrow"></div>
      <div id="gauge-wrap">
        <svg viewBox="0 0 100 100"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#286043"/><stop offset="1" stop-color="#9F82F6"/></linearGradient></defs><circle id="gauge-bg" cx="50" cy="50" r="42"/><circle id="gauge-fg" cx="50" cy="50" r="42" pathLength="1"/></svg>
        <div id="gauge-num-wrap"><div id="gauge-num">0</div><div id="gauge-lbl">NPS</div></div>
      </div>
      <div class="flow-arrow"></div>
      <div class="card" id="card-report">
        <div class="card-h">Rapport</div>
        <div id="bars">${barEls}</div>
      </div>
    </div>
  </div>

  <div class="scene" id="scene-quests">
    <div id="quests-head" class="display">${words("Én plattform. All innsikt du trenger.")}</div>
    <div id="quests-row">${questEls}</div>
  </div>

  <div class="scene" id="scene-proof">
    <div class="kicker">Betrodd i Norden i 25 år</div>
    <h1 id="proof-head" class="display">Den mest pålitelige tilbakemeldingsplattformen i Norden</h1>
    <div id="logos">${customerEls}</div>
    <div id="proof-stats">
      <div class="st"><b>25 år</b><span>med tilbakemeldinger</span></div>
      <div class="st"><b>GDPR</b><span>full dekning</span></div>
      <div class="st"><b>Norden</b><span>lokal support</span></div>
    </div>
    <div id="quote">«Beste gjør-det-selv survey-tool på markedet — intuitivt og likevel mange avanserte funksjoner.»<cite>Anne-Perly Eriksen · VP Customer Success, Visma</cite></div>
  </div>

  <div class="scene" id="scene-end">
    ${WORD("logo2", "4cqw")}
    <h1 id="end-claim" class="display">${words("Test Questback gratis i 14 dager")}</h1>
    <div id="end-pills"><span class="pill">Ingen kredittkort</span><span class="pill">Klar på 5 minutter</span><span class="pill go">Prøv nå</span></div>
    <div id="end-contact"><span id="end-cta-dot"></span>questback.com · sales.no@questback.com · +47 21 02 70 70</div>
  </div>

  </div>
  <div id="hud"><div class="tl">Questback</div><div class="tr">● Film</div><div class="bl">Din vinnende strategi</div><div class="br">26 — No</div></div>
  <div id="grain"></div>
</main>
<script>${FIT_TEXT_RUNTIME}</script>
<script>(function(){function boot(){ ${TIMELINE} } if(document.readyState==='complete')boot();else window.addEventListener('load',boot);})();</script>
</body></html>`;

writeFileSync(OUT, html);
console.log("Wrote", OUT, "| bytes:", html.length);
