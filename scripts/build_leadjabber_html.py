import base64

with open('public/leadjabber/symbol.png', 'rb') as f:
    SYMBOL_B64 = base64.b64encode(f.read()).decode()
with open('public/leadjabber/logo-white.png', 'rb') as f:
    LOGOWHITE_B64 = base64.b64encode(f.read()).decode()
with open('scripts/gsap.min.js', 'r', encoding='utf-8') as f:
    GSAP_JS = f.read()

FONT_WEIGHTS = [300, 400, 500, 700]
FONT_FACES = []
for w in FONT_WEIGHTS:
    with open(f'public/fonts/Poppins-{w}.ttf', 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    FONT_FACES.append(f"""@font-face{{font-family:'Poppins';font-style:normal;font-weight:{w};src:url(data:font/ttf;base64,{b64}) format('truetype');}}""")
FONT_FACES_CSS = '\n  '.join(FONT_FACES)

HTML = f"""<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<title>LeadJabber — Slutt å ringe kaldt</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  {FONT_FACES_CSS}
  :root{{
    --bg:#FFFFFF; --bg2:#F4FAFC;
    --navy:#292B3C; --navy2:#1A2540;
    --teal:#1994B5; --tealLight:#559BB7; --tealDeep:#11718D;
    --body:#374151; --gray:#787E8B;
  }}
  *{{margin:0;padding:0;box-sizing:border-box;}}
  html,body{{width:100%;height:100%;background:#000;overflow:hidden;font-family:'Poppins',sans-serif;}}
  #viewport{{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;}}
  #canvas{{position:relative;width:1920px;height:1080px;background:var(--bg);overflow:hidden;transform-origin:center center;}}

  #grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(25,148,181,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(25,148,181,0.045) 1px,transparent 1px);background-size:90px 90px;}}
  #wash{{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 28%, rgba(25,148,181,0.07) 0%, transparent 70%);}}

  .scene{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;pointer-events:none;}}

  .accent{{color:var(--teal);}}

  #logo-wrap{{width:160px;height:160px;position:relative;}}
  #logo-svg{{width:100%;height:100%;overflow:visible;}}
  .mono-stroke{{fill:none;stroke:url(#flowGrad);stroke-width:7;stroke-linecap:round;stroke-linejoin:round;}}
  .mono-fill{{fill:url(#flowGrad);opacity:0;}}
  .assemble-dot{{fill:url(#flowGrad);}}

  #wordmark{{display:flex;align-items:baseline;overflow:hidden;clip-path:inset(0 100% 0 0);white-space:nowrap;}}
  #wordmark .w1{{font-size:92px;font-weight:300;color:var(--tealLight);letter-spacing:1px;}}
  #wordmark .w2{{font-size:92px;font-weight:700;color:var(--navy);letter-spacing:1px;}}
  #tagline{{font-size:25px;font-weight:400;color:var(--body);text-align:center;max-width:780px;opacity:0;}}

  .heading{{font-size:60px;font-weight:700;color:var(--navy);text-align:center;}}
  .divider{{height:3px;width:0;margin:16px auto 0;background:linear-gradient(90deg,var(--teal),var(--tealDeep),var(--teal));box-shadow:0 0 14px rgba(25,148,181,.4);}}

  /* corner logo */
  #corner-logo{{position:absolute;top:50px;left:64px;display:flex;align-items:center;gap:12px;opacity:0;z-index:20;}}
  #corner-logo img{{width:42px;height:42px;}}
  #corner-logo .w1{{font-size:26px;font-weight:300;color:var(--tealLight);}}
  #corner-logo .w2{{font-size:26px;font-weight:700;color:var(--navy);}}

  /* headline scene */
  #headline-text{{font-size:72px;font-weight:700;color:var(--navy);text-align:center;line-height:1.25;}}

  /* stats */
  #stats-grid{{display:flex;gap:36px;margin-top:48px;}}
  .stat-card{{background:#fff;border:1px solid rgba(25,148,181,0.22);border-radius:18px;padding:38px 46px;width:300px;text-align:center;opacity:0;box-shadow:0 14px 36px rgba(25,148,181,0.1);}}
  .stat-num{{font-size:58px;font-weight:700;color:var(--teal);}}
  .stat-label{{font-size:18px;color:var(--gray);margin-top:10px;}}

  /* process */
  #process-row{{display:flex;align-items:flex-start;gap:0;margin-top:54px;position:relative;}}
  .proc-step{{display:flex;flex-direction:column;align-items:center;width:340px;opacity:0;position:relative;z-index:2;}}
  .proc-num{{width:64px;height:64px;border-radius:50%;background:var(--teal);color:#fff;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(25,148,181,.4);}}
  .proc-title{{font-size:22px;font-weight:700;color:var(--navy);margin-top:18px;text-align:center;}}
  .proc-sub{{font-size:16px;color:var(--gray);margin-top:8px;text-align:center;max-width:280px;}}
  #process-line{{position:absolute;top:32px;left:170px;right:170px;height:3px;background:linear-gradient(90deg,var(--teal),var(--tealDeep),var(--teal));width:0;z-index:1;}}

  /* solutions */
  #solutions-grid{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:46px;}}
  .sol-card{{background:#fff;border:1px solid rgba(25,148,181,0.22);border-radius:18px;padding:32px 40px;width:480px;opacity:0;box-shadow:0 14px 36px rgba(25,148,181,0.1);}}
  .sol-title{{font-size:28px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:12px;}}
  .sol-dot{{width:10px;height:10px;border-radius:50%;background:var(--teal);}}
  .sol-sub{{font-size:18px;color:var(--gray);margin-top:8px;}}

  /* testimonial */
  #quote-mark{{font-size:130px;color:var(--teal);line-height:0.4;opacity:0;}}
  #quote-text{{font-size:36px;font-weight:500;color:var(--navy);text-align:center;max-width:1300px;line-height:1.55;opacity:0;}}
  #quote-name{{font-size:24px;font-weight:700;color:var(--teal);margin-top:30px;opacity:0;}}
  #quote-title{{font-size:18px;color:var(--gray);opacity:0;}}

  /* cta */
  #scene-cta{{background:linear-gradient(135deg,var(--navy),var(--navy2));}}
  #cta-logo{{width:420px;opacity:0;}}
  #cta-headline{{font-size:34px;font-weight:700;color:#fff;opacity:0;margin-top:18px;}}
  #cta-btn{{position:relative;border-radius:60px;overflow:hidden;opacity:0;margin-top:30px;}}
  #cta-btn-inner{{background:var(--teal);color:#fff;font-size:27px;font-weight:700;padding:21px 64px;border-radius:60px;box-shadow:0 0 44px rgba(25,148,181,.55);letter-spacing:0.5px;}}
  #cta-shimmer{{position:absolute;top:0;bottom:0;left:-60px;width:60px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);transform:skewX(-20deg);}}
  #cta-url{{font-size:19px;color:rgba(85,159,183,0.85);letter-spacing:4px;text-transform:uppercase;opacity:0;margin-top:14px;}}
  .cta-ring{{position:absolute;border-radius:50%;border:1px solid rgba(85,159,183,.28);top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}}

  #stage-content{{position:absolute;inset:0;}}

  #wipe{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:40;pointer-events:none;}}
  #wipe-circle{{width:3400px;height:3400px;border-radius:50%;background:var(--bg);transform:scale(0);}}
  #wipe-slide{{position:absolute;inset:0;background:var(--bg2);transform:translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-split-top{{position:absolute;left:0;top:0;width:100%;height:50%;background:var(--bg);transform:translateY(-100%);z-index:40;pointer-events:none;box-shadow:0 4px 30px rgba(25,148,181,.2);}}
  #wipe-split-bottom{{position:absolute;left:0;bottom:0;width:100%;height:50%;background:var(--bg);transform:translateY(100%);z-index:40;pointer-events:none;box-shadow:0 -4px 30px rgba(25,148,181,.2);}}
  #wipe-diag{{position:absolute;top:-25%;left:-65%;width:170%;height:150%;background:var(--bg2);transform:rotate(-14deg) translateX(-100%);z-index:40;pointer-events:none;}}

  #flash{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:35;pointer-events:none;opacity:0;}}
  .flash-glow{{width:1400px;height:1400px;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(25,148,181,.3) 35%, transparent 70%);}}

  #blackout{{position:absolute;inset:0;background:#fff;opacity:1;pointer-events:none;z-index:50;}}
</style>
</head>
<body>

<div id="viewport">
  <div id="canvas">
   <div id="stage-content">
    <div id="grid"></div>
    <div id="wash"></div>

    <!-- corner logo (appears after intro) -->
    <div id="corner-logo">
      <img src="data:image/png;base64,{SYMBOL_B64}" alt="">
      <div style="display:flex;align-items:baseline;">
        <span class="w1">Lead</span><span class="w2">Jabber</span>
      </div>
    </div>

    <!-- SCENE 1: intro -->
    <div class="scene" id="scene-intro">
      <div style="position:absolute;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(25,148,181,.10) 0%, transparent 65%);"></div>
      <div id="logo-wrap">
        <svg id="logo-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--tealLight)"/>
              <stop offset="100%" stop-color="var(--navy)"/>
            </linearGradient>
          </defs>
          <path id="measurePath" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105" fill="none" opacity="0"/>
          <g id="assemble-group"></g>
          <path id="strokePath" class="mono-stroke" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105"/>
          <path id="fillPath" class="mono-fill" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105"/>
        </svg>
      </div>
      <div id="wordmark"><span class="w1">Lead</span><span class="w2">Jabber</span></div>
      <div id="tagline">LeadJabber hjelper selgere med å bygge mer pipeline og være mer produktive</div>
    </div>

    <!-- SCENE 2: headline (real homepage hero copy) -->
    <div class="scene" id="scene-headline">
      <div style="text-align:center;max-width:1300px;">
        <div id="headline-text">Få bedre produktivitet og<br>bygg mer <span class="accent">pipeline</span></div>
      </div>
    </div>

    <!-- SCENE 3: stats -->
    <div class="scene" id="scene-stats">
      <div style="text-align:center;">
        <div class="heading">Resultater som <span class="accent">teller</span></div>
        <div class="divider" id="stats-divider"></div>
      </div>
      <div id="stats-grid">
        <div class="stat-card" id="stat1"><div class="stat-num" id="stat1-num">0</div><div class="stat-label">mer pipeline</div></div>
        <div class="stat-card" id="stat2"><div class="stat-num" id="stat2-num">0%</div><div class="stat-label">mindre tid på kaldt ringing</div></div>
        <div class="stat-card" id="stat3"><div class="stat-num" id="stat3-num">0+</div><div class="stat-label">fornøyde kunder</div></div>
      </div>
    </div>

    <!-- SCENE 4: process -->
    <div class="scene" id="scene-process">
      <div style="text-align:center;">
        <div class="heading">Slik <span class="accent">fungerer</span> det</div>
      </div>
      <div id="process-row">
        <div id="process-line"></div>
        <div class="proc-step" id="proc1"><div class="proc-num">1</div><div class="proc-title">Vi identifiserer</div><div class="proc-sub">Dine ideelle kunder kartlegges og kvalifiseres.</div></div>
        <div class="proc-step" id="proc2"><div class="proc-num">2</div><div class="proc-title">Vi booker</div><div class="proc-sub">Møter legges rett inn i kalenderen din.</div></div>
        <div class="proc-step" id="proc3"><div class="proc-num">3</div><div class="proc-title">Du selger</div><div class="proc-sub">Du møter opp og fokuserer på å lande avtalen.</div></div>
      </div>
    </div>

    <!-- SCENE 5: solutions -->
    <div class="scene" id="scene-solutions">
      <div style="text-align:center;">
        <div class="heading">Våre <span class="accent">løsninger</span></div>
        <div class="divider" id="solutions-divider"></div>
      </div>
      <div id="solutions-grid">
        <div class="sol-card" id="sol1"><div class="sol-title"><span class="sol-dot"></span>Outreach</div><div class="sol-sub">Bygg pipeline med nye prospekter hver eneste måned.</div></div>
        <div class="sol-card" id="sol2"><div class="sol-title"><span class="sol-dot"></span>Møtebooking</div><div class="sol-sub">Vi booker kvalitetsmøter direkte i kalenderen din.</div></div>
        <div class="sol-card" id="sol3"><div class="sol-title"><span class="sol-dot"></span>Leadgenerering</div><div class="sol-sub">Strategiske salgstrakter som konverterer.</div></div>
        <div class="sol-card" id="sol4"><div class="sol-title"><span class="sol-dot"></span>LeadJabber</div><div class="sol-sub">Programvaren som lar teamet ditt generere leads selv.</div></div>
      </div>
    </div>

    <!-- SCENE 6: testimonial -->
    <div class="scene" id="scene-testimonial">
      <div id="quote-mark">&ldquo;</div>
      <div id="quote-text">Jeg har brukt LeadJabber i flere år, og det har blitt helt avgjørende for min salgsprosess. Systemet har forvandlet måten jeg jobber på.</div>
      <div id="quote-name">Oddvar Meyer</div>
      <div id="quote-title">Sales Manager</div>
    </div>

    <!-- SCENE 7: CTA -->
    <div class="scene" id="scene-cta">
      <div class="cta-ring" id="ctaring1" style="width:560px;height:560px;"></div>
      <div class="cta-ring" id="ctaring2" style="width:680px;height:680px;"></div>
      <div class="cta-ring" id="ctaring3" style="width:800px;height:800px;"></div>
      <img id="cta-logo" src="data:image/png;base64,{LOGOWHITE_B64}" alt="LeadJabber">
      <div id="cta-headline">Klar til å stupe inn?</div>
      <div id="cta-btn"><div id="cta-btn-inner">Be om demo</div><div id="cta-shimmer"></div></div>
      <div id="cta-url">leadjabber.no</div>
    </div>
   </div>

    <div id="wipe"><div id="wipe-circle"></div></div>
    <div id="wipe-slide"></div>
    <div id="wipe-split-top"></div>
    <div id="wipe-split-bottom"></div>
    <div id="wipe-diag"></div>
    <div id="flash"><div class="flash-glow"></div></div>
    <div id="blackout"></div>
  </div>
</div>

<script>
{GSAP_JS}
</script>
<script>
function fitCanvas() {{
  const vw = window.innerWidth, vh = window.innerHeight;
  const scale = Math.min(vw / 1920, vh / 1080);
  document.getElementById('canvas').style.transform = `scale(${{scale}})`;
}}
fitCanvas();
window.addEventListener('resize', fitCanvas);

/* ---------- logo particle assembly ---------- */
const measurePath = document.getElementById('measurePath');
const strokePath = document.getElementById('strokePath');
const fillPath = document.getElementById('fillPath');
const assembleGroup = document.getElementById('assemble-group');
const SVG_NS = 'http://www.w3.org/2000/svg';

const len = measurePath.getTotalLength();
strokePath.style.strokeDasharray = len;
strokePath.style.strokeDashoffset = len;

const SAMPLE_STEP = 4;
const targets = [];
for (let d = 0; d < len; d += SAMPLE_STEP) {{
  const p = measurePath.getPointAtLength(d);
  targets.push({{ x: p.x, y: p.y }});
}}
const ctr = targets.reduce((a, t) => ({{ x: a.x + t.x, y: a.y + t.y }}), {{ x: 0, y: 0 }});
ctr.x /= targets.length; ctr.y /= targets.length;

const SCATTER = 2.8;
const dots = targets.map(t => {{
  const c = document.createElementNS(SVG_NS, 'circle');
  c.setAttribute('class', 'assemble-dot');
  c.setAttribute('r', 2.0);
  const sx = ctr.x + (t.x - ctr.x) * SCATTER;
  const sy = ctr.y + (t.y - ctr.y) * SCATTER;
  c.setAttribute('cx', sx);
  c.setAttribute('cy', sy);
  c.style.opacity = 0;
  assembleGroup.appendChild(c);
  return {{ el: c, sx, sy, tx: t.x, ty: t.y }};
}});

gsap.set(['#scene-stats .heading', '#scene-process .heading', '#scene-solutions .heading'], {{ opacity: 0, y: 20 }});

/* ---------- master timeline — loops, distinct transition per cut ---------- */
const tl = gsap.timeline({{ repeat: -1, repeatDelay: 0.5 }});

function irisWipe(time) {{
  tl.to('#wipe-circle', {{ scale: 1, duration: 0.32, ease: 'power2.in' }}, time - 0.32);
  tl.to('#wipe-circle', {{ scale: 0, duration: 0.32, ease: 'power2.out' }}, time);
}}
function slideWipe(time) {{
  tl.set('#wipe-slide', {{ transform: 'translateX(-100%)' }}, time - 0.3);
  tl.to('#wipe-slide', {{ transform: 'translateX(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-slide', {{ transform: 'translateX(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function splitWipe(time) {{
  tl.set(['#wipe-split-top', '#wipe-split-bottom'], {{ transform: (i) => i === 0 ? 'translateY(-100%)' : 'translateY(100%)' }}, time - 0.28);
  tl.to('#wipe-split-top', {{ transform: 'translateY(0%)', duration: 0.24, ease: 'power2.in' }}, time - 0.24);
  tl.to('#wipe-split-bottom', {{ transform: 'translateY(0%)', duration: 0.24, ease: 'power2.in' }}, time - 0.24);
  tl.to('#wipe-split-top', {{ transform: 'translateY(-100%)', duration: 0.24, ease: 'power2.out' }}, time);
  tl.to('#wipe-split-bottom', {{ transform: 'translateY(100%)', duration: 0.24, ease: 'power2.out' }}, time);
}}
function diagWipe(time) {{
  tl.set('#wipe-diag', {{ transform: 'rotate(-14deg) translateX(-100%)' }}, time - 0.3);
  tl.to('#wipe-diag', {{ transform: 'rotate(-14deg) translateX(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-diag', {{ transform: 'rotate(-14deg) translateX(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function countUp(id, time, target, suffix, dur = 1.0) {{
  const el = document.getElementById(id);
  tl.to({{ v: 0 }}, {{
    v: target, duration: dur, ease: 'power2.out',
    onUpdate() {{ el.textContent = Math.round(this.targets()[0].v) + suffix; }},
  }}, time);
}}
function zoomPunch(time) {{
  tl.to('#stage-content', {{ scale: 1.06, filter: 'blur(6px)', duration: 0.16, ease: 'power2.in' }}, time - 0.16);
  tl.to('#stage-content', {{ scale: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' }}, time);
  flash(time - 0.04, 0.55, 0.3);
}}
function flash(time, opacity = 0.4, dur = 0.4) {{
  tl.fromTo('#flash', {{ opacity: 0, scale: 0.6 }},
    {{ opacity, scale: 1, duration: dur * 0.4, ease: 'power2.out' }}, time);
  tl.to('#flash', {{ opacity: 0, scale: 1.35, duration: dur * 0.6, ease: 'power2.in' }}, time + dur * 0.4);
}}

// 0.0 — fade in from white
tl.set('#blackout', {{ opacity: 1 }});
tl.to('#blackout', {{ opacity: 0, duration: 0.4, ease: 'power1.in' }}, 0.0);
tl.set('#scene-intro', {{ opacity: 1 }}, 0.0);

// 0.2 — 1.5 particles implode into the logo mark
tl.to(dots.map(d => d.el), {{ opacity: 0.9, duration: 0.2, stagger: 0.0025 }}, 0.2);
tl.to(dots.map(d => d.el), {{
  attr: {{ cx: (i) => dots[i].tx, cy: (i) => dots[i].ty }},
  duration: 0.9, ease: 'power3.inOut', stagger: 0.0025,
}}, 0.4);
tl.to(dots.map(d => d.el), {{ opacity: 0, duration: 0.3, stagger: 0.0015 }}, 1.3);

// 1.2 — 2.4 outline draws itself, fill locks in
tl.to(strokePath, {{ strokeDashoffset: 0, duration: 1.2, ease: 'none' }}, 1.2);
flash(2.3, 0.45);
tl.to(fillPath, {{ opacity: 1, duration: 0.35, ease: 'power2.out' }}, 2.3);
tl.to(strokePath, {{ opacity: 0, duration: 0.3, ease: 'power1.in' }}, 2.4);

// 2.6 — 3.4 wordmark reveal + tagline
tl.to('#wordmark', {{ clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.out' }}, 2.6);
tl.to('#tagline', {{ opacity: 1, y: -4, duration: 0.6, ease: 'power2.out' }}, 3.2, 'taglinePos');
tl.fromTo('#tagline', {{ y: 8 }}, {{ y: 0, duration: 0.6, ease: 'power2.out' }}, 3.2);

tl.to('#scene-intro', {{ opacity: 0, duration: 0.4 }}, 4.6);

// 5.0  IRIS WIPE into headline (real homepage hero)
irisWipe(5.0);
tl.set('#scene-headline', {{ opacity: 1 }}, 5.02);
tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 5.1);

tl.fromTo('#headline-text', {{ opacity: 0, y: 26, filter: 'blur(10px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }}, 5.2);

tl.to('#scene-headline', {{ opacity: 0, duration: 0.4 }}, 8.0);

// 8.4  SLIDE WIPE into stats
slideWipe(8.4);
tl.set('#scene-stats', {{ opacity: 1 }}, 8.42);

tl.to('#scene-stats .heading', {{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }}, 8.55);
tl.to('#stats-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 8.75);

flash(9.2, 0.2);
['stat1', 'stat2', 'stat3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.9 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }}, 9.2 + i * 0.18);
}});
countUp('stat1-num', 9.5, 3, 'x', 1.0);
countUp('stat2-num', 9.68, 50, '%', 1.0);
countUp('stat3-num', 9.86, 100, '+', 1.0);

tl.to('#scene-stats', {{ opacity: 0, duration: 0.4 }}, 12.6);

// 13.0  DIAGONAL WIPE into process
diagWipe(13.0);
tl.set('#scene-process', {{ opacity: 1 }}, 13.02);

tl.to('#scene-process .heading', {{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }}, 13.15);
tl.to('#process-line', {{ width: '100%', duration: 0.7, ease: 'power2.out' }}, 13.4);

flash(13.6, 0.18);
['proc1', 'proc2', 'proc3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 13.6 + i * 0.32);
}});

tl.to('#scene-process', {{ opacity: 0, duration: 0.4 }}, 17.6);

// 18.0  SPLIT WIPE into solutions
splitWipe(18.0);
tl.set('#scene-solutions', {{ opacity: 1 }}, 18.02);

tl.to('#scene-solutions .heading', {{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }}, 18.15);
tl.to('#solutions-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 18.35);

flash(18.8, 0.2);
['sol1', 'sol2', 'sol3', 'sol4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }}, 18.8 + i * 0.22);
}});

tl.to('#scene-solutions', {{ opacity: 0, duration: 0.4 }}, 23.0);

// 23.4  IRIS WIPE into testimonial
irisWipe(23.4);
tl.set('#scene-testimonial', {{ opacity: 1 }}, 23.42);

tl.fromTo('#quote-mark', {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }}, 23.55);
tl.fromTo('#quote-text', {{ opacity: 0, y: 22, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }}, 23.8);
tl.to('#quote-name', {{ opacity: 1, duration: 0.45 }}, 25.0);
tl.to('#quote-title', {{ opacity: 1, duration: 0.45 }}, 25.2);

tl.to('#scene-testimonial', {{ opacity: 0, duration: 0.4 }}, 27.4);
tl.to('#corner-logo', {{ opacity: 0, duration: 0.3 }}, 27.4);

// 27.8  ZOOM PUNCH into CTA
zoomPunch(27.8);
tl.set('#scene-cta', {{ opacity: 1 }}, 27.82);

tl.fromTo('#cta-logo', {{ scale: 0.7, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' }}, 27.95);
['ctaring1', 'ctaring2', 'ctaring3'].forEach((id, i) => {{
  gsap.set('#' + id, {{ opacity: 0 }});
  tl.to('#' + id, {{ opacity: 1, duration: 0.35 }}, 27.95);
  tl.to('#' + id, {{ scale: 1.03, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 28.1 + i * 0.08);
}});
tl.fromTo('#cta-headline', {{ opacity: 0, y: 22, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }}, 28.7);
flash(29.2, 0.28);
gsap.set('#cta-btn', {{ scale: 0.7 }});
tl.to('#cta-btn', {{ opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 29.2);
tl.to('#cta-shimmer', {{ left: '120%', duration: 1.1, repeat: 3, ease: 'power1.inOut' }}, 29.4);
tl.to('#cta-url', {{ opacity: 1, y: -4, duration: 0.45 }}, 29.8);

// 36.6 — fade out, loop
tl.to('#scene-cta', {{ opacity: 0, duration: 0.45 }}, 36.6);
tl.to('#blackout', {{ opacity: 1, duration: 0.9, ease: 'power2.in' }}, 36.8);

// reset for next loop
tl.call(() => {{
  gsap.set('#wordmark', {{ clipPath: 'inset(0 100% 0 0)' }});
  gsap.set('#tagline', {{ opacity: 0 }});
  gsap.set(strokePath, {{ opacity: 1, strokeDashoffset: len }});
  gsap.set(fillPath, {{ opacity: 0 }});
  gsap.set('#corner-logo', {{ opacity: 0 }});
  gsap.set('#stats-divider', {{ width: '0px' }});
  gsap.set('#scene-stats .heading', {{ opacity: 0, y: 20 }});
  gsap.set(['#stat1', '#stat2', '#stat3'], {{ opacity: 0, y: 28, scale: 0.9 }});
  document.getElementById('stat1-num').textContent = '0x';
  document.getElementById('stat2-num').textContent = '0%';
  document.getElementById('stat3-num').textContent = '0+';
  gsap.set('#scene-process .heading', {{ opacity: 0, y: 20 }});
  gsap.set('#process-line', {{ width: '0%' }});
  gsap.set(['#proc1', '#proc2', '#proc3'], {{ opacity: 0, y: 24, scale: 0.92 }});
  gsap.set('#solutions-divider', {{ width: '0px' }});
  gsap.set('#scene-solutions .heading', {{ opacity: 0, y: 20 }});
  gsap.set(['#sol1', '#sol2', '#sol3', '#sol4'], {{ opacity: 0, y: 28, scale: 0.94 }});
  gsap.set(['#quote-mark', '#quote-text', '#quote-name', '#quote-title'], {{ opacity: 0 }});
  gsap.set(['#ctaring1', '#ctaring2', '#ctaring3'], {{ opacity: 0 }});
  gsap.set('#cta-btn', {{ opacity: 0, scale: 0.7 }});
  gsap.set('#cta-url', {{ opacity: 0 }});
  gsap.set('#cta-logo', {{ opacity: 0, scale: 0.7 }});
  gsap.set('#cta-headline', {{ opacity: 0 }});
  dots.forEach(d => {{ d.el.setAttribute('cx', d.sx); d.el.setAttribute('cy', d.sy); d.el.style.opacity = 0; }});
}}, [], 37.9);

window.__tl = tl;
(function() {{
  var m = location.hash.match(/t=([\d.]+)/);
  if (m) {{
    tl.pause(parseFloat(m[1]));
  }}
}})();
</script>
</body>
</html>
"""

with open('public/leadjabber-ad.html', 'w', encoding='utf-8') as f:
    f.write(HTML)

print('written', len(HTML), 'bytes')
