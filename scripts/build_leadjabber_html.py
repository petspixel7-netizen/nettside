import base64

with open('public/leadjabber/symbol.png', 'rb') as f:
    SYMBOL_B64 = base64.b64encode(f.read()).decode()
with open('public/leadjabber/logo-white.png', 'rb') as f:
    LOGOWHITE_B64 = base64.b64encode(f.read()).decode()
with open('public/leadjabber/qr-book.png', 'rb') as f:
    QRBOOK_B64 = base64.b64encode(f.read()).decode()
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

  @keyframes gridDrift{{0%{{background-position:0 0,0 0;}}100%{{background-position:90px 90px,90px 90px;}}}}
  #grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(25,148,181,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(25,148,181,0.045) 1px,transparent 1px);background-size:90px 90px;animation:gridDrift 16s linear infinite;}}
  @keyframes washPulse{{0%,100%{{opacity:.75;transform:scale(1);}}50%{{opacity:1;transform:scale(1.08);}}}}
  #wash{{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 28%, rgba(25,148,181,0.07) 0%, transparent 70%);animation:washPulse 7s ease-in-out infinite;}}

  @keyframes dotGlow{{0%,100%{{box-shadow:0 0 0 0 rgba(25,148,181,.45);}}50%{{box-shadow:0 0 16px 5px rgba(25,148,181,.45);}}}}
  .sol-dot,.platform-dot{{animation:dotGlow 2.4s ease-in-out infinite;}}
  @keyframes checkGlow{{0%,100%{{box-shadow:0 8px 20px rgba(25,148,181,.35);}}50%{{box-shadow:0 8px 26px rgba(25,148,181,.65);}}}}
  .benefit-check{{animation:checkGlow 2.4s ease-in-out infinite;}}

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
  .heading .word,#headline-text .word,#cta-headline .word{{display:inline-block;opacity:0;}}
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
  #process-line-svg{{position:absolute;top:32px;left:0;width:100%;height:14px;overflow:visible;z-index:1;}}
  #process-line-dot{{filter:drop-shadow(0 0 6px rgba(25,148,181,.8));}}

  /* benefits */
  #benefits-list{{display:flex;flex-direction:column;gap:24px;margin-top:50px;}}
  .benefit-row{{display:flex;align-items:center;gap:20px;opacity:0;width:880px;}}
  .benefit-check{{width:38px;height:38px;border-radius:50%;background:var(--teal);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;flex-shrink:0;box-shadow:0 8px 20px rgba(25,148,181,.35);}}
  .benefit-text{{font-size:25px;color:var(--navy);font-weight:500;}}

  /* platform */
  #platform-row{{display:flex;gap:26px;margin-top:50px;}}
  .platform-pill{{background:#fff;border:1px solid rgba(25,148,181,.22);border-radius:50px;padding:24px 40px;display:flex;align-items:center;gap:14px;opacity:0;box-shadow:0 14px 30px rgba(25,148,181,.1);}}
  .platform-dot{{width:12px;height:12px;border-radius:50%;background:var(--teal);}}
  .platform-label{{font-size:23px;font-weight:700;color:var(--navy);}}

  /* solutions */
  #solutions-grid{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:46px;}}
  .sol-card{{background:#fff;border:1px solid rgba(25,148,181,0.22);border-radius:18px;padding:32px 40px;width:480px;opacity:0;box-shadow:0 14px 36px rgba(25,148,181,0.1);}}
  .sol-title{{font-size:28px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:12px;}}
  .sol-dot{{width:10px;height:10px;border-radius:50%;background:var(--teal);}}
  .sol-sub{{font-size:18px;color:var(--gray);margin-top:8px;}}

  /* cta */
  #scene-cta{{background:linear-gradient(135deg,var(--navy),var(--navy2));}}
  #cta-logo{{width:420px;opacity:0;display:block;}}
  #cta-logo-wrap{{position:relative;width:420px;opacity:0;}}
  #cta-logo-wrap img#cta-logo{{opacity:1;}}
  #cta-logo-sheen{{position:absolute;top:0;left:-65%;width:55%;height:100%;
    background:linear-gradient(75deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 35%,rgba(255,255,255,.9) 50%,rgba(255,255,255,0) 65%,rgba(255,255,255,0) 100%);
    -webkit-mask-image:url(data:image/png;base64,{LOGOWHITE_B64});mask-image:url(data:image/png;base64,{LOGOWHITE_B64});
    -webkit-mask-size:420px auto;mask-size:420px auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:0 0;mask-position:0 0;
    mix-blend-mode:screen;pointer-events:none;}}
  #cta-headline{{font-size:34px;font-weight:700;color:#fff;opacity:0;margin-top:18px;}}
  #cta-qr-wrap{{position:relative;opacity:0;margin-top:28px;background:#fff;border-radius:22px;padding:22px;box-shadow:0 0 50px rgba(25,148,181,.45);}}
  #cta-qr-wrap img{{width:170px;height:170px;display:block;}}
  #cta-qr-ring{{position:absolute;inset:-6px;border-radius:26px;border:2px solid rgba(85,159,183,.6);pointer-events:none;}}
  #cta-qr-label{{font-size:18px;font-weight:500;color:rgba(255,255,255,.85);margin-top:16px;opacity:0;letter-spacing:0.3px;}}
  #cta-url{{font-size:19px;color:rgba(85,159,183,0.85);letter-spacing:4px;text-transform:uppercase;opacity:0;margin-top:10px;}}
  .cta-ring{{position:absolute;border-radius:50%;border:1px solid rgba(85,159,183,.28);top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}}

  #stage-content{{position:absolute;inset:0;}}

  #wipe{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:40;pointer-events:none;}}
  #wipe-circle{{width:3400px;height:3400px;border-radius:50%;background:var(--bg);transform:scale(0);}}
  #wipe-navy{{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, var(--navy2), var(--navy));transform:scale(0);border-radius:50%;width:3400px;height:3400px;left:50%;top:50%;margin-left:-1700px;margin-top:-1700px;z-index:41;pointer-events:none;}}
  #wipe-slide{{position:absolute;inset:0;background:var(--bg2);transform:translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-split-top{{position:absolute;left:0;top:0;width:100%;height:50%;background:var(--bg);transform:translateY(-100%);z-index:40;pointer-events:none;box-shadow:0 4px 30px rgba(25,148,181,.2);}}
  #wipe-split-bottom{{position:absolute;left:0;bottom:0;width:100%;height:50%;background:var(--bg);transform:translateY(100%);z-index:40;pointer-events:none;box-shadow:0 -4px 30px rgba(25,148,181,.2);}}
  #wipe-diag{{position:absolute;top:-25%;left:-65%;width:170%;height:150%;background:var(--bg2);transform:rotate(-14deg) translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-bars{{position:absolute;inset:0;display:flex;z-index:40;pointer-events:none;}}
  .wipe-bar{{flex:1;background:var(--bg2);transform:scaleY(0);}}
  #wipe-curtain{{position:absolute;inset:0;background:var(--bg2);transform:translateY(-100%);z-index:40;pointer-events:none;}}

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
            <linearGradient id="sheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
              <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
              <stop offset="50%" stop-color="#ffffff" stop-opacity=".95"/>
              <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <clipPath id="logoClip">
              <use href="#fillPath"/>
            </clipPath>
          </defs>
          <path id="measurePath" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105" fill="none" opacity="0"/>
          <g id="assemble-group"></g>
          <path id="strokePath" class="mono-stroke" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105"/>
          <path id="fillPath" class="mono-fill" d="M70,40 C40,40 30,60 30,90 L30,140 L70,140 L70,105 C70,85 80,75 100,75 L130,75 C160,75 170,55 170,40 L170,40 C170,75 160,140 110,140 C75,140 70,115 70,105"/>
          <rect id="logoSheen" x="-260" y="0" width="180" height="200" fill="url(#sheenGrad)" clip-path="url(#logoClip)" style="mix-blend-mode:screen;pointer-events:none;"/>
        </svg>
      </div>
      <div id="wordmark"><span class="w1">Lead</span><span class="w2">Jabber</span></div>
      <div id="tagline">LeadJabber hjelper selgere med å bygge mer pipeline og være mer produktive</div>
    </div>

    <!-- SCENE 2: headline (real homepage hero copy) -->
    <div class="scene" id="scene-headline">
      <div style="text-align:center;max-width:1300px;">
        <div id="headline-text"><span class="word">Få</span> <span class="word">bedre</span> <span class="word">produktivitet</span> <span class="word">og</span><br><span class="word">bygg</span> <span class="word">mer</span> <span class="word accent">pipeline</span></div>
      </div>
    </div>

    <!-- SCENE 3: stats -->
    <div class="scene" id="scene-stats">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Resultater</span> <span class="word">som</span> <span class="word accent">teller</span></div>
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
        <div class="heading"><span class="word">Slik</span> <span class="word accent">fungerer</span> <span class="word">det</span></div>
      </div>
      <div id="process-row">
        <svg id="process-line-svg" viewBox="0 0 1020 14" preserveAspectRatio="none">
          <line id="process-line-path" x1="170" y1="7" x2="850" y2="7" stroke="#1994B5" stroke-width="3" stroke-linecap="round" fill="none"/>
          <circle id="process-line-dot" cx="170" cy="7" r="7" fill="var(--teal)"/>
        </svg>
        <div class="proc-step" id="proc1"><div class="proc-num">1</div><div class="proc-title">Vi identifiserer</div><div class="proc-sub">Dine ideelle kunder kartlegges og kvalifiseres.</div></div>
        <div class="proc-step" id="proc2"><div class="proc-num">2</div><div class="proc-title">Vi booker</div><div class="proc-sub">Møter legges rett inn i kalenderen din.</div></div>
        <div class="proc-step" id="proc3"><div class="proc-num">3</div><div class="proc-title">Du selger</div><div class="proc-sub">Du møter opp og fokuserer på å lande avtalen.</div></div>
      </div>
    </div>

    <!-- SCENE 5: solutions -->
    <div class="scene" id="scene-solutions">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Våre</span> <span class="word accent">løsninger</span></div>
        <div class="divider" id="solutions-divider"></div>
      </div>
      <div id="solutions-grid">
        <div class="sol-card" id="sol1"><div class="sol-title"><span class="sol-dot"></span>Outreach</div><div class="sol-sub">Bygg pipeline med nye prospekter hver eneste måned.</div></div>
        <div class="sol-card" id="sol2"><div class="sol-title"><span class="sol-dot"></span>Møtebooking</div><div class="sol-sub">Vi booker kvalitetsmøter direkte i kalenderen din.</div></div>
        <div class="sol-card" id="sol3"><div class="sol-title"><span class="sol-dot"></span>Leadgenerering</div><div class="sol-sub">Strategiske salgstrakter som konverterer.</div></div>
        <div class="sol-card" id="sol4"><div class="sol-title"><span class="sol-dot"></span>LeadJabber</div><div class="sol-sub">Programvaren som lar teamet ditt generere leads selv.</div></div>
      </div>
    </div>

    <!-- SCENE 6: benefits -->
    <div class="scene" id="scene-benefits">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Hvorfor</span> <span class="word accent">LeadJabber</span></div>
        <div class="divider" id="benefits-divider"></div>
      </div>
      <div id="benefits-list">
        <div class="benefit-row" id="ben1"><div class="benefit-check">✓</div><div class="benefit-text">Dedikert salgsteam som jobber for deg</div></div>
        <div class="benefit-row" id="ben2"><div class="benefit-check">✓</div><div class="benefit-text">Kvalitetssikrede møter rett i kalenderen</div></div>
        <div class="benefit-row" id="ben3"><div class="benefit-check">✓</div><div class="benefit-text">Skalerbar pipeline uten å øke staben</div></div>
        <div class="benefit-row" id="ben4"><div class="benefit-check">✓</div><div class="benefit-text">Fullt innsyn i prosessen, alltid</div></div>
      </div>
    </div>

    <!-- SCENE 7: platform -->
    <div class="scene" id="scene-platform">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Alt</span> <span class="word">i</span> <span class="word accent">én</span> <span class="word accent">plattform</span></div>
      </div>
      <div id="platform-row">
        <div class="platform-pill" id="plat1"><span class="platform-dot"></span><span class="platform-label">CRM-integrasjon</span></div>
        <div class="platform-pill" id="plat2"><span class="platform-dot"></span><span class="platform-label">Sanntidsrapportering</span></div>
        <div class="platform-pill" id="plat3"><span class="platform-dot"></span><span class="platform-label">Dedikert kundeteam</span></div>
      </div>
    </div>

    <!-- SCENE 8: CTA -->
    <div class="scene" id="scene-cta">
      <div class="cta-ring" id="ctaring1" style="width:560px;height:560px;"></div>
      <div class="cta-ring" id="ctaring2" style="width:680px;height:680px;"></div>
      <div class="cta-ring" id="ctaring3" style="width:800px;height:800px;"></div>
      <div id="cta-logo-wrap">
        <img id="cta-logo" src="data:image/png;base64,{LOGOWHITE_B64}" alt="LeadJabber">
        <div id="cta-logo-sheen"></div>
      </div>
      <div id="cta-headline"><span class="word">Klar</span> <span class="word">til</span> <span class="word">å</span> <span class="word">stupe</span> <span class="word">inn?</span></div>
      <div id="cta-qr-wrap"><div id="cta-qr-ring"></div><img src="data:image/png;base64,{QRBOOK_B64}" alt="QR til leadjabber.no"></div>
      <div id="cta-qr-label">Skann for å besøke siden</div>
      <div id="cta-url">leadjabber.no</div>
    </div>
   </div>

    <div id="wipe"><div id="wipe-circle"></div></div>
    <div id="wipe-slide"></div>
    <div id="wipe-split-top"></div>
    <div id="wipe-split-bottom"></div>
    <div id="wipe-diag"></div>
    <div id="wipe-bars">
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
    </div>
    <div id="wipe-curtain"></div>
    <div id="wipe-navy"></div>
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
const logoSheen = document.getElementById('logoSheen');
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

gsap.set('.heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});

/* ---------- process line draw setup ---------- */
const procLine = document.getElementById('process-line-path');
const procLineLen = procLine.getTotalLength();
procLine.style.strokeDasharray = procLineLen;
procLine.style.strokeDashoffset = procLineLen;

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
function barsWipe(time) {{
  const bars = '.wipe-bar';
  tl.to(bars, {{ scaleY: 1, duration: 0.22, stagger: 0.03, ease: 'power2.in' }}, time - 0.34);
  tl.to(bars, {{ scaleY: 0, duration: 0.22, stagger: 0.03, ease: 'power2.out' }}, time);
}}
function curtainWipe(time) {{
  tl.set('#wipe-curtain', {{ transform: 'translateY(-100%)' }}, time - 0.3);
  tl.to('#wipe-curtain', {{ transform: 'translateY(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-curtain', {{ transform: 'translateY(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function zoomSpin(time) {{
  tl.to('#stage-content', {{ scale: 1.08, rotation: 1.5, filter: 'blur(7px)', duration: 0.18, ease: 'power2.in' }}, time - 0.18);
  tl.to('#stage-content', {{ scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.24, ease: 'power2.out' }}, time);
  flash(time - 0.04, 0.4, 0.3);
}}
function countUp(id, time, target, suffix, dur = 1.0) {{
  const el = document.getElementById(id);
  tl.to({{ v: 0 }}, {{
    v: target, duration: dur, ease: 'power2.out',
    onUpdate() {{ el.textContent = Math.round(this.targets()[0].v) + suffix; }},
  }}, time);
}}
function navyWipe(time) {{
  tl.to('#stage-content', {{ scale: 1.07, filter: 'blur(8px)', duration: 0.26, ease: 'power2.in' }}, time - 0.36);
  tl.to('#wipe-navy', {{ scale: 1, duration: 0.36, ease: 'power3.in' }}, time - 0.36);
  flash(time - 0.1, 0.5, 0.3);
  tl.to('#stage-content', {{ scale: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }}, time);
  tl.to('#wipe-navy', {{ scale: 0, duration: 0.4, ease: 'power3.out' }}, time + 0.02);
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

// crystal-shader style light sweep across the logo mark
tl.fromTo('#logoSheen', {{ attr: {{ x: -260 }} }}, {{ attr: {{ x: 220 }}, duration: 1.1, ease: 'power1.inOut' }}, 3.0);

tl.to('#scene-intro', {{ opacity: 0, duration: 0.4 }}, 4.6);

// 5.0  IRIS WIPE into headline (real homepage hero)
irisWipe(5.0);
tl.set('#scene-headline', {{ opacity: 1 }}, 5.02);
tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 5.1);

tl.fromTo('#headline-text .word', {{ opacity: 0, y: 30, filter: 'blur(9px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.045, ease: 'power3.out' }}, 5.2);

tl.to('#scene-headline', {{ opacity: 0, duration: 0.4 }}, 8.0);

// 8.4  SLIDE WIPE into stats
slideWipe(8.4);
tl.set('#scene-stats', {{ opacity: 1 }}, 8.42);

tl.to('#scene-stats .heading .word', {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.05, ease: 'power3.out' }}, 8.55);
tl.to('#stats-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 8.75);

flash(9.2, 0.2);
['stat1', 'stat2', 'stat3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 9.2 + i * 0.18);
  tl.to('#' + id, {{ y: -10, duration: 0.9, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 9.2 + i * 0.18 + 0.5);
}});
countUp('stat1-num', 9.5, 3, 'x', 1.0);
countUp('stat2-num', 9.68, 50, '%', 1.0);
countUp('stat3-num', 9.86, 100, '+', 1.0);

tl.to('#scene-stats', {{ opacity: 0, duration: 0.4 }}, 12.6);

// 13.0  DIAGONAL WIPE into process
diagWipe(13.0);
tl.set('#scene-process', {{ opacity: 1 }}, 13.02);

tl.to('#scene-process .heading .word', {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.05, ease: 'power3.out' }}, 13.15);

// step 1 appears first
flash(13.45, 0.16);
tl.fromTo('#proc1', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 13.45);
tl.to('#proc1 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 5, yoyo: true, ease: 'sine.inOut' }}, 13.95);

// line draws from step 1 to step 2, then step 2 appears
tl.to(procLine, {{ strokeDashoffset: procLineLen / 2, duration: 0.5, ease: 'power2.inOut' }}, 13.95);
tl.to('#process-line-dot', {{ attr: {{ cx: 510 }}, duration: 0.5, ease: 'power2.inOut' }}, 13.95);
flash(14.4, 0.14);
tl.fromTo('#proc2', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 14.4);
tl.to('#proc2 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 14.9);

// line draws from step 2 to step 3, then step 3 appears
tl.to(procLine, {{ strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }}, 14.9);
tl.to('#process-line-dot', {{ attr: {{ cx: 850 }}, duration: 0.5, ease: 'power2.inOut' }}, 14.9);
flash(15.35, 0.14);
tl.fromTo('#proc3', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 15.35);
tl.to('#proc3 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 15.85);

tl.to('#scene-process', {{ opacity: 0, duration: 0.4 }}, 17.6);

// 18.0  BARS WIPE into solutions
barsWipe(18.0);
tl.set('#scene-solutions', {{ opacity: 1 }}, 18.02);

tl.to('#scene-solutions .heading .word', {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.05, ease: 'power3.out' }}, 18.15);
tl.to('#solutions-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 18.35);

flash(18.8, 0.2);
['sol1', 'sol2', 'sol3', 'sol4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.94, rotation: -4, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 18.8 + i * 0.22);
  tl.to('#' + id, {{ y: -9, duration: 1.0, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 18.8 + i * 0.22 + 0.5);
}});

tl.to('#scene-solutions', {{ opacity: 0, duration: 0.4 }}, 23.0);

// 23.4  CURTAIN WIPE into benefits
curtainWipe(23.4);
tl.set('#scene-benefits', {{ opacity: 1 }}, 23.42);

tl.to('#scene-benefits .heading .word', {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.05, ease: 'power3.out' }}, 23.55);
tl.to('#benefits-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 23.75);

flash(24.2, 0.2);
['ben1', 'ben2', 'ben3', 'ben4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, x: -32, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }}, 24.2 + i * 0.22);
  tl.to('#' + id + ' .benefit-check', {{ scale: 1.15, rotation: 8, duration: 0.8, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 24.2 + i * 0.22 + 0.5);
}});

tl.to('#scene-benefits', {{ opacity: 0, duration: 0.4 }}, 27.6);

// 28.0  ZOOM SPIN into platform
zoomSpin(28.0);
tl.set('#scene-platform', {{ opacity: 1 }}, 28.02);

tl.to('#scene-platform .heading .word', {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.05, ease: 'power3.out' }}, 28.15);

['plat1', 'plat2', 'plat3'].forEach((id, i) => {{
  const fromX = i % 2 === 0 ? -40 : 40;
  tl.fromTo('#' + id, {{ opacity: 0, x: fromX, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 28.6 + i * 0.2);
  tl.to('#' + id, {{ y: -8, duration: 0.9, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 28.6 + i * 0.2 + 0.5);
}});

tl.to('#scene-platform', {{ opacity: 0, duration: 0.4 }}, 31.8);
tl.to('#corner-logo', {{ opacity: 0, duration: 0.3 }}, 31.8);

// 32.2  NAVY WIPE into CTA (white -> navy background, masked transition)
navyWipe(32.2);
tl.set('#scene-cta', {{ opacity: 1 }}, 32.22);

tl.fromTo('#cta-logo-wrap', {{ scale: 0.7, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' }}, 32.35);
tl.fromTo('#cta-logo-sheen', {{ left: '-65%' }}, {{ left: '135%', duration: 1.3, repeat: 2, repeatDelay: 1.4, ease: 'power1.inOut' }}, 33.0);
['ctaring1', 'ctaring2', 'ctaring3'].forEach((id, i) => {{
  gsap.set('#' + id, {{ opacity: 0 }});
  tl.to('#' + id, {{ opacity: 1, duration: 0.35 }}, 32.35);
  tl.to('#' + id, {{ scale: 1.03, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 32.5 + i * 0.08);
}});
tl.fromTo('#cta-headline .word', {{ opacity: 0, y: 22, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.05, ease: 'power3.out' }}, 33.1);
flash(33.6, 0.28);
gsap.set('#cta-qr-wrap', {{ scale: 0.7, rotation: -6 }});
tl.to('#cta-qr-wrap', {{ opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }}, 33.6);
tl.fromTo('#cta-qr-ring', {{ scale: 1, opacity: 0.9 }}, {{ scale: 1.18, opacity: 0, duration: 1.0, repeat: 2, ease: 'power1.out' }}, 34.1);
tl.to('#cta-qr-label', {{ opacity: 1, duration: 0.4 }}, 34.2);
tl.to('#cta-url', {{ opacity: 1, y: -4, duration: 0.45 }}, 34.35);

// 41.0 — fade out, loop
tl.to('#scene-cta', {{ opacity: 0, duration: 0.45 }}, 41.0);
tl.to('#blackout', {{ opacity: 1, duration: 0.9, ease: 'power2.in' }}, 41.2);

// reset for next loop
tl.call(() => {{
  gsap.set('#wordmark', {{ clipPath: 'inset(0 100% 0 0)' }});
  gsap.set('#tagline', {{ opacity: 0 }});
  gsap.set(strokePath, {{ opacity: 1, strokeDashoffset: len }});
  gsap.set(fillPath, {{ opacity: 0 }});
  gsap.set('#corner-logo', {{ opacity: 0 }});
  gsap.set('#stats-divider', {{ width: '0px' }});
  gsap.set('#scene-stats .heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});
  gsap.set(['#stat1', '#stat2', '#stat3'], {{ opacity: 0, y: 28, scale: 0.9 }});
  document.getElementById('stat1-num').textContent = '0x';
  document.getElementById('stat2-num').textContent = '0%';
  document.getElementById('stat3-num').textContent = '0+';
  gsap.set('#scene-process .heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});
  gsap.set(procLine, {{ strokeDashoffset: procLineLen }});
  gsap.set('#process-line-dot', {{ attr: {{ cx: 170 }} }});
  gsap.set(['#proc1', '#proc2', '#proc3'], {{ opacity: 0, y: 24, scale: 0.92 }});
  gsap.set('#solutions-divider', {{ width: '0px' }});
  gsap.set('#scene-solutions .heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});
  gsap.set(['#sol1', '#sol2', '#sol3', '#sol4'], {{ opacity: 0, y: 28, scale: 0.94, rotation: -4 }});
  gsap.set('#benefits-divider', {{ width: '0px' }});
  gsap.set('#scene-benefits .heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});
  gsap.set(['#ben1', '#ben2', '#ben3', '#ben4'], {{ opacity: 0, x: -32 }});
  gsap.set('#scene-platform .heading .word', {{ opacity: 0, y: 22, filter: 'blur(6px)' }});
  gsap.set('#plat1', {{ opacity: 0, x: -40 }});
  gsap.set('#plat2', {{ opacity: 0, x: 40 }});
  gsap.set('#plat3', {{ opacity: 0, x: -40 }});
  gsap.set(['#ctaring1', '#ctaring2', '#ctaring3'], {{ opacity: 0 }});
  gsap.set('#cta-qr-wrap', {{ opacity: 0, scale: 0.7, rotation: -6 }});
  gsap.set('#cta-qr-label', {{ opacity: 0 }});
  gsap.set('#cta-url', {{ opacity: 0 }});
  gsap.set('#cta-logo-wrap', {{ opacity: 0, scale: 0.7 }});
  gsap.set('#cta-logo-sheen', {{ left: '-65%' }});
  gsap.set(logoSheen, {{ attr: {{ x: -260 }} }});
  gsap.set('#cta-headline', {{ opacity: 0 }});
  dots.forEach(d => {{ d.el.setAttribute('cx', d.sx); d.el.setAttribute('cy', d.sy); d.el.style.opacity = 0; }});
}}, [], 42.3);

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
