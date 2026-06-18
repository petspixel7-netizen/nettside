import base64
import re

with open('public/wabisabi/hero1.jpg', 'rb') as f:
    HERO1_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/hero2.jpg', 'rb') as f:
    HERO2_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/mingle.jpg', 'rb') as f:
    MINGLE_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/sandstop.jpg', 'rb') as f:
    SANDSTOP_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/qr.png', 'rb') as f:
    QR_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/logo.svg', 'r', encoding='utf-8') as f:
    LOGO_SVG_RAW = f.read()
with open('scripts/gsap.min.js', 'r', encoding='utf-8') as f:
    GSAP_JS = f.read()

# make the wordmark inherit color via currentColor (paths have no own fill)
LOGO_SVG = re.sub(r'<svg ', '<svg fill="currentColor" ', LOGO_SVG_RAW, count=1)


def logo_svg(id_suffix):
    return LOGO_SVG.replace('id="wabisabi-logo"', f'id="wabisabi-logo-{id_suffix}"')


LOGO_SVG_INTRO = logo_svg('intro')
LOGO_SVG_CORNER = logo_svg('corner')
LOGO_SVG_CTA = logo_svg('cta')

FONT_FACES = []
for fam, file, weight, style in [
    ('Instrument Serif', 'InstrumentSerif-400.ttf', 400, 'normal'),
    ('Instrument Serif', 'InstrumentSerif-400i.ttf', 400, 'italic'),
    ('Poppins', 'Poppins-300.ttf', 300, 'normal'),
    ('Poppins', 'Poppins-400.ttf', 400, 'normal'),
    ('Poppins', 'Poppins-500.ttf', 500, 'normal'),
    ('Poppins', 'Poppins-700.ttf', 700, 'normal'),
]:
    folder = 'norleads/fonts' if 'InstrumentSerif' in file else 'fonts'
    with open(f'public/{folder}/{file}', 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    FONT_FACES.append(
        f"""@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};src:url(data:font/ttf;base64,{b64}) format('truetype');}}"""
    )
FONT_FACES_CSS = '\n  '.join(FONT_FACES)

HTML = f"""<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<title>Wabi Sabi — Lag ditt eget smykke</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  {FONT_FACES_CSS}
  :root{{
    --bg:#171310; --surface:#221c17; --surface2:#2c241d; --border:#3c322a;
    --terracotta:#C56448; --terracotta-dim:#8d544b; --brown:#6b4a3c; --cream:#F3ECE2; --gold:#C9A567;
    --text:#d8cfc3; --white:#f6f0e7; --dim:#9c8f80;
    --display:'Instrument Serif',serif; --sans:'Poppins',sans-serif;
  }}
  *{{margin:0;padding:0;box-sizing:border-box;}}
  html,body{{width:100%;height:100%;background:#000;overflow:hidden;font-family:var(--sans);}}
  #viewport{{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;}}
  #canvas{{position:relative;width:1920px;height:1080px;background:var(--bg);overflow:hidden;transform-origin:center center;}}

  @keyframes grainDrift{{0%{{background-position:0 0;}}100%{{background-position:120px 90px;}}}}
  #grain{{position:absolute;inset:-10%;opacity:.05;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' result='t'/><feColorMatrix in='t' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");animation:grainDrift 9s steps(6) infinite;pointer-events:none;z-index:6;}}
  @keyframes washPulse{{0%,100%{{opacity:.55;transform:scale(1);}}50%{{opacity:.9;transform:scale(1.06);}}}}
  #wash{{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 30%, rgba(197,100,72,0.14) 0%, transparent 70%);animation:washPulse 8s ease-in-out infinite;}}

  #orbs{{position:absolute;inset:0;overflow:hidden;}}
  .orb{{position:absolute;border-radius:50%;filter:blur(50px);opacity:.28;mix-blend-mode:screen;}}
  #orb1{{width:360px;height:360px;left:6%;top:12%;background:radial-gradient(circle,var(--terracotta),transparent 70%);animation:orbDrift1 14s ease-in-out infinite;}}
  #orb2{{width:280px;height:280px;right:8%;top:55%;background:radial-gradient(circle,var(--gold),transparent 70%);animation:orbDrift2 12s ease-in-out infinite;}}
  #orb3{{width:300px;height:300px;left:18%;bottom:8%;background:radial-gradient(circle,var(--brown),transparent 70%);animation:orbDrift3 16s ease-in-out infinite;}}
  @keyframes orbDrift1{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(70px,50px) scale(1.2);}}}}
  @keyframes orbDrift2{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(-60px,-40px) scale(0.85);}}}}
  @keyframes orbDrift3{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(50px,-50px) scale(1.15);}}}}

  .scene{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;pointer-events:none;}}
  .accent{{color:var(--terracotta);font-style:italic;}}

  /* full-bleed photo panel with vignette */
  .photo-panel{{position:absolute;inset:0;overflow:hidden;}}
  .photo-panel img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1);animation:kenBurns 9s ease-out forwards;}}
  @keyframes kenBurns{{0%{{transform:scale(1.0) translate(0,0);}}100%{{transform:scale(1.13) translate(-1%,-1%);}}}}
  .photo-vignette{{position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(15,11,8,.86) 100%),linear-gradient(180deg, rgba(15,11,8,.55) 0%, rgba(15,11,8,.25) 35%, rgba(15,11,8,.78) 100%);}}

  #logo-wrap-intro{{width:480px;opacity:0;}}
  #logo-wrap-intro svg{{width:100%;display:block;color:var(--cream);filter:drop-shadow(0 0 30px rgba(197,100,72,.35));}}
  #tagline{{font-family:var(--display);font-style:italic;font-size:30px;color:var(--terracotta);text-align:center;letter-spacing:.5px;opacity:0;}}
  #sub-tagline{{font-size:18px;font-weight:300;color:var(--dim);text-align:center;letter-spacing:2px;text-transform:uppercase;opacity:0;}}

  .heading{{font-family:var(--display);font-weight:400;font-size:78px;color:var(--white);text-align:center;letter-spacing:-.5px;}}
  .heading .word{{display:inline-block;opacity:0;}}
  #headline-text .word,#cta-headline .word{{display:inline-block;opacity:0;}}
  .divider{{height:2px;width:0;margin:18px auto 0;background:linear-gradient(90deg,transparent,var(--terracotta),transparent);box-shadow:0 0 14px rgba(197,100,72,.5);}}

  /* corner logo */
  #corner-logo{{position:absolute;top:54px;left:64px;display:flex;align-items:center;gap:0;opacity:0;z-index:20;}}
  #corner-logo svg{{width:160px;color:var(--cream);}}

  /* headline scene */
  #headline-text{{font-family:var(--display);font-weight:400;font-size:92px;color:var(--white);text-align:center;line-height:1.12;letter-spacing:-1px;}}
  #headline-sub{{font-size:22px;font-weight:300;color:var(--cream);text-align:center;margin-top:18px;opacity:0;letter-spacing:.5px;}}

  /* workshop cards */
  #workshop-grid{{display:flex;gap:30px;margin-top:48px;}}
  .ws-card{{position:relative;width:380px;height:480px;border-radius:6px;overflow:hidden;opacity:0;box-shadow:0 30px 60px rgba(0,0,0,.55);border:1px solid var(--border);}}
  .ws-card img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}}
  .ws-card .ws-overlay{{position:absolute;inset:0;background:linear-gradient(180deg, rgba(23,19,16,.05) 0%, rgba(23,19,16,.92) 78%);}}
  .ws-card .ws-num{{position:absolute;top:24px;left:24px;font-family:var(--display);font-style:italic;font-size:30px;color:var(--terracotta);}}
  .ws-card .ws-title{{position:absolute;bottom:78px;left:26px;right:26px;font-family:var(--display);font-size:34px;color:var(--white);}}
  .ws-card .ws-sub{{position:absolute;bottom:30px;left:26px;right:26px;font-size:15px;font-weight:300;color:var(--cream);line-height:1.4;}}

  /* process */
  #process-row{{display:flex;align-items:flex-start;gap:0;margin-top:56px;position:relative;}}
  .proc-step{{display:flex;flex-direction:column;align-items:center;width:340px;opacity:0;position:relative;z-index:2;}}
  .proc-num{{width:62px;height:62px;border-radius:50%;border:1px solid var(--terracotta);color:var(--terracotta);font-family:var(--display);font-style:italic;font-size:26px;display:flex;align-items:center;justify-content:center;background:var(--surface);box-shadow:0 10px 26px rgba(0,0,0,.4);}}
  .proc-title{{font-family:var(--display);font-size:26px;font-weight:400;color:var(--white);margin-top:20px;text-align:center;}}
  .proc-sub{{font-size:15px;font-weight:300;color:var(--dim);margin-top:8px;text-align:center;max-width:290px;}}
  #process-line-svg{{position:absolute;top:31px;left:0;width:100%;height:14px;overflow:visible;z-index:1;}}
  #process-line-dot{{filter:drop-shadow(0 0 6px rgba(197,100,72,.8));}}

  /* benefits */
  #benefits-list{{display:flex;flex-direction:column;gap:26px;margin-top:50px;}}
  .benefit-row{{display:flex;align-items:center;gap:22px;opacity:0;width:880px;}}
  .benefit-check{{width:14px;height:14px;border-radius:50%;background:var(--terracotta);flex-shrink:0;box-shadow:0 0 16px rgba(197,100,72,.6);}}
  .benefit-text{{font-family:var(--display);font-size:28px;font-weight:400;color:var(--white);}}

  /* location scene */
  #location-card{{text-align:center;opacity:0;}}
  #location-name{{font-family:var(--display);font-style:italic;font-size:46px;color:var(--terracotta);}}
  #location-addr{{font-size:20px;font-weight:300;color:var(--cream);margin-top:10px;letter-spacing:.5px;}}
  #location-phone{{font-size:18px;font-weight:300;color:var(--dim);margin-top:6px;letter-spacing:.5px;}}

  /* cta */
  #scene-cta{{background:radial-gradient(circle at 50% 28%, #241d17, var(--bg) 75%);}}
  #cta-logo-wrap{{width:340px;opacity:0;}}
  #cta-logo-wrap svg{{width:100%;display:block;color:var(--cream);filter:drop-shadow(0 0 30px rgba(197,100,72,.4));}}
  #cta-headline{{font-family:var(--display);font-size:46px;font-weight:400;color:var(--white);margin-top:10px;text-align:center;}}
  #cta-headline .acc{{color:var(--terracotta);font-style:italic;}}
  #cta-qr-wrap{{position:relative;opacity:0;margin-top:24px;background:#fff;border-radius:14px;padding:18px;box-shadow:0 0 50px rgba(197,100,72,.35);}}
  #cta-qr-wrap img{{width:150px;height:150px;display:block;}}
  #cta-qr-ring{{position:absolute;inset:-6px;border-radius:18px;border:2px solid rgba(197,100,72,.55);pointer-events:none;}}
  #cta-qr-label{{font-size:15px;font-weight:300;color:var(--dim);margin-top:14px;opacity:0;letter-spacing:1px;text-transform:uppercase;}}
  #cta-url{{font-family:var(--display);font-style:italic;font-size:26px;color:var(--terracotta);opacity:0;margin-top:4px;}}
  .cta-ring{{position:absolute;border-radius:50%;border:1px solid rgba(197,100,72,.22);top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}}

  #stage-content{{position:absolute;inset:0;}}

  #wipe{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:40;pointer-events:none;}}
  #wipe-circle{{width:3400px;height:3400px;border-radius:50%;background:var(--surface2);transform:scale(0);}}
  #wipe-neon{{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, var(--terracotta), #6b3424);transform:scale(0);border-radius:50%;width:3400px;height:3400px;left:50%;top:50%;margin-left:-1700px;margin-top:-1700px;z-index:41;pointer-events:none;}}
  #wipe-slide{{position:absolute;inset:0;background:var(--surface2);transform:translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-diag{{position:absolute;top:-25%;left:-65%;width:170%;height:150%;background:var(--surface2);transform:rotate(-14deg) translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-bars{{position:absolute;inset:0;display:flex;z-index:40;pointer-events:none;}}
  .wipe-bar{{flex:1;background:var(--surface2);transform:scaleY(0);}}
  #wipe-curtain{{position:absolute;inset:0;background:var(--surface2);transform:translateY(-100%);z-index:40;pointer-events:none;}}

  #flash{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:35;pointer-events:none;opacity:0;}}
  .flash-glow{{width:1400px;height:1400px;border-radius:50%;background:radial-gradient(circle, rgba(197,100,72,.9) 0%, rgba(197,100,72,.22) 35%, transparent 70%);}}

  #blackout{{position:absolute;inset:0;background:#000;opacity:1;pointer-events:none;z-index:50;}}
</style>
</head>
<body>

<div id="viewport">
  <div id="canvas">
   <div id="stage-content">
    <div id="wash"></div>
    <div id="orbs">
      <div class="orb" id="orb1"></div>
      <div class="orb" id="orb2"></div>
      <div class="orb" id="orb3"></div>
    </div>
    <div id="grain"></div>

    <!-- corner logo (appears after intro) -->
    <div id="corner-logo">{LOGO_SVG_CORNER}</div>

    <!-- SCENE 1: intro -->
    <div class="scene" id="scene-intro">
      <div style="position:absolute;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle,rgba(197,100,72,.12) 0%, transparent 65%);"></div>
      <div id="logo-wrap-intro">{LOGO_SVG_INTRO}</div>
      <div id="tagline">Beauty in imperfection</div>
      <div id="sub-tagline">Lag ditt eget smykke i Tromsø</div>
    </div>

    <!-- SCENE 2: headline w/ photo -->
    <div class="scene" id="scene-headline">
      <div class="photo-panel"><img src="data:image/jpeg;base64,{HERO1_B64}" alt=""><div class="photo-vignette"></div></div>
      <div style="position:relative;text-align:center;max-width:1500px;">
        <div id="headline-text"><span class="word">Lag</span> <span class="word">ditt</span> <span class="word accent">eget</span><br><span class="word accent">smykke</span></div>
        <div id="headline-sub">Med god veiledning fra en gullsmed, hele veien.</div>
      </div>
    </div>

    <!-- SCENE 3: workshop types -->
    <div class="scene" id="scene-workshops">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Tre</span> <span class="word accent">workshops,</span> <span class="word">ett</span> <span class="word accent">verksted</span></div>
        <div class="divider" id="workshops-divider"></div>
      </div>
      <div id="workshop-grid">
        <div class="ws-card" id="ws1">
          <img src="data:image/jpeg;base64,{MINGLE_B64}" alt="">
          <div class="ws-overlay"></div>
          <div class="ws-num">01</div>
          <div class="ws-title">Mingle</div>
          <div class="ws-sub">Lag din egen sølvring fra start til slutt.</div>
        </div>
        <div class="ws-card" id="ws2">
          <img src="data:image/jpeg;base64,{SANDSTOP_B64}" alt="">
          <div class="ws-overlay"></div>
          <div class="ws-num">02</div>
          <div class="ws-title">Sandstøp</div>
          <div class="ws-sub">Skap unike gullsmykker med klassisk sandstøp.</div>
        </div>
        <div class="ws-card" id="ws3">
          <img src="data:image/jpeg;base64,{HERO1_B64}" alt="">
          <div class="ws-overlay"></div>
          <div class="ws-num">03</div>
          <div class="ws-title">Omsmelting</div>
          <div class="ws-sub">Gi gamle gullsmykker nytt liv og ny form.</div>
        </div>
      </div>
    </div>

    <!-- SCENE 4: process -->
    <div class="scene" id="scene-process">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Slik</span> <span class="word accent">fungerer</span> <span class="word">det</span></div>
      </div>
      <div id="process-row">
        <svg id="process-line-svg" viewBox="0 0 1020 14" preserveAspectRatio="none">
          <line id="process-line-path" x1="170" y1="7" x2="850" y2="7" stroke="#C56448" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle id="process-line-dot" cx="170" cy="7" r="6" fill="var(--terracotta)"/>
        </svg>
        <div class="proc-step" id="proc1"><div class="proc-num">1</div><div class="proc-title">Book en workshop</div><div class="proc-sub">Velg Mingle, Sandstøp eller omsmelting — alene eller med følge.</div></div>
        <div class="proc-step" id="proc2"><div class="proc-num">2</div><div class="proc-title">Skap med en gullsmed</div><div class="proc-sub">Du formgir, vi veileder deg gjennom hele prosessen.</div></div>
        <div class="proc-step" id="proc3"><div class="proc-num">3</div><div class="proc-title">Ta med ditt unike smykke</div><div class="proc-sub">Et smykke ingen andre har — laget med dine egne hender.</div></div>
      </div>
    </div>

    <!-- SCENE 5: benefits -->
    <div class="scene" id="scene-benefits">
      <div class="photo-panel" style="opacity:.4;"><img src="data:image/jpeg;base64,{HERO2_B64}" alt=""><div class="photo-vignette"></div></div>
      <div style="position:relative;text-align:center;">
        <div class="heading"><span class="word">Hvorfor</span> <span class="word accent">Wabi</span> <span class="word accent">Sabi</span></div>
        <div class="divider" id="benefits-divider"></div>
      </div>
      <div id="benefits-list" style="position:relative;">
        <div class="benefit-row" id="ben1"><div class="benefit-check"></div><div class="benefit-text">Alt håndlaget i vårt eget verksted i Tromsø</div></div>
        <div class="benefit-row" id="ben2"><div class="benefit-check"></div><div class="benefit-text">Du finner aldri to smykker som er helt like</div></div>
        <div class="benefit-row" id="ben3"><div class="benefit-check"></div><div class="benefit-text">En opplevelse å dele med venner eller kjæresten</div></div>
        <div class="benefit-row" id="ben4"><div class="benefit-check"></div><div class="benefit-text">Skjønnheten ligger i det som ikke er perfekt</div></div>
      </div>
    </div>

    <!-- SCENE 6: location -->
    <div class="scene" id="scene-location">
      <div class="photo-panel"><img src="data:image/jpeg;base64,{SANDSTOP_B64}" alt=""><div class="photo-vignette"></div></div>
      <div id="location-card">
        <div id="location-name">Velkommen til Tromsø</div>
        <div id="location-addr">Skippergata 15, 9008 Tromsø</div>
        <div id="location-phone">46 67 88 72 · post@wabisabi.no</div>
      </div>
    </div>

    <!-- SCENE 7: CTA -->
    <div class="scene" id="scene-cta">
      <div class="cta-ring" id="ctaring1" style="width:560px;height:560px;"></div>
      <div class="cta-ring" id="ctaring2" style="width:680px;height:680px;"></div>
      <div class="cta-ring" id="ctaring3" style="width:800px;height:800px;"></div>
      <div id="cta-logo-wrap">{LOGO_SVG_CTA}</div>
      <div id="cta-headline"><span class="word">Bli</span> <span class="word">med</span> <span class="word accent">på</span> <span class="word accent">workshop</span></div>
      <div id="cta-qr-wrap"><div id="cta-qr-ring"></div><img src="data:image/png;base64,{QR_B64}" alt="QR til wabisabi.no"></div>
      <div id="cta-qr-label">Skann for å booke plass</div>
      <div id="cta-url">wabisabi.no/lag-ditt-eget-smykke</div>
    </div>
   </div>

    <div id="wipe"><div id="wipe-circle"></div></div>
    <div id="wipe-slide"></div>
    <div id="wipe-diag"></div>
    <div id="wipe-bars">
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
    </div>
    <div id="wipe-curtain"></div>
    <div id="wipe-neon"></div>
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

gsap.set('.heading .word', {{ opacity: 0, y: 24, scale: 0.7, filter: 'blur(6px)' }});

/* ---------- process line draw setup ---------- */
const procLine = document.getElementById('process-line-path');
const procLineLen = procLine.getTotalLength();
procLine.style.strokeDasharray = procLineLen;
procLine.style.strokeDashoffset = procLineLen;

/* ---------- master timeline — loops, distinct transition per cut ---------- */
const tl = gsap.timeline({{ repeat: -1, repeatDelay: 0.6 }});

function irisWipe(time) {{
  tl.to('#wipe-circle', {{ scale: 1, duration: 0.32, ease: 'power2.in' }}, time - 0.32);
  tl.to('#wipe-circle', {{ scale: 0, duration: 0.32, ease: 'power2.out' }}, time);
}}
function slideWipe(time) {{
  tl.set('#wipe-slide', {{ transform: 'translateX(-100%)' }}, time - 0.3);
  tl.to('#wipe-slide', {{ transform: 'translateX(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-slide', {{ transform: 'translateX(100%)', duration: 0.26, ease: 'power2.out' }}, time);
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
function neonWipe(time) {{
  tl.to('#stage-content', {{ scale: 1.07, filter: 'blur(8px)', duration: 0.26, ease: 'power2.in' }}, time - 0.36);
  tl.to('#wipe-neon', {{ scale: 1, duration: 0.36, ease: 'power3.in' }}, time - 0.36);
  flash(time - 0.1, 0.55, 0.3);
  tl.to('#stage-content', {{ scale: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }}, time);
  tl.to('#wipe-neon', {{ scale: 0, duration: 0.4, ease: 'power3.out' }}, time + 0.02);
}}
function flash(time, opacity = 0.4, dur = 0.4) {{
  tl.fromTo('#flash', {{ opacity: 0, scale: 0.6 }},
    {{ opacity, scale: 1, duration: dur * 0.4, ease: 'power2.out' }}, time);
  tl.to('#flash', {{ opacity: 0, scale: 1.35, duration: dur * 0.6, ease: 'power2.in' }}, time + dur * 0.4);
}}

// 0.0 — fade in from black
tl.set('#blackout', {{ opacity: 1 }});
tl.to('#blackout', {{ opacity: 0, duration: 0.5, ease: 'power1.in' }}, 0.0);
tl.set('#scene-intro', {{ opacity: 1 }}, 0.0);

// 0.2 — 3.4 logo + taglines
tl.fromTo('#logo-wrap-intro', {{ opacity: 0, y: 16, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }}, 0.25);
tl.fromTo('#tagline', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }}, 1.25);
tl.fromTo('#sub-tagline', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }}, 1.65);

tl.to('#scene-intro', {{ opacity: 0, duration: 0.45 }}, 4.1);

// 4.5  IRIS WIPE into headline
irisWipe(4.5);
tl.set('#scene-headline', {{ opacity: 1 }}, 4.52);
tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 4.6);

tl.fromTo('#headline-text .word', {{ opacity: 0, y: 30, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.1, ease: 'power3.out' }}, 4.7);
tl.fromTo('#headline-sub', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }}, 5.7);

tl.to('#scene-headline', {{ opacity: 0, duration: 0.45 }}, 8.6);

// 9.0  SLIDE WIPE into workshops
slideWipe(9.0);
tl.set('#scene-workshops', {{ opacity: 1 }}, 9.02);

tl.to('#scene-workshops .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 9.15);
tl.to('#workshops-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 9.35);

flash(9.75, 0.22);
['ws1', 'ws2', 'ws3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 36, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }}, 9.75 + i * 0.2);
  tl.to('#' + id, {{ y: -8, duration: 1.1, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 9.75 + i * 0.2 + 0.6);
}});

tl.to('#scene-workshops', {{ opacity: 0, duration: 0.45 }}, 16.4);

// 16.8  DIAGONAL WIPE into process
diagWipe(16.8);
tl.set('#scene-process', {{ opacity: 1 }}, 16.82);

tl.to('#scene-process .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 16.95);

flash(17.25, 0.18);
tl.fromTo('#proc1', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 17.25);
tl.to('#proc1 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 4, yoyo: true, ease: 'sine.inOut' }}, 17.75);

tl.to(procLine, {{ strokeDashoffset: procLineLen / 2, duration: 0.55, ease: 'power2.inOut' }}, 17.75);
tl.to('#process-line-dot', {{ attr: {{ cx: 510 }}, duration: 0.55, ease: 'power2.inOut' }}, 17.75);
flash(18.3, 0.16);
tl.fromTo('#proc2', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 18.3);
tl.to('#proc2 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 18.8);

tl.to(procLine, {{ strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }}, 18.8);
tl.to('#process-line-dot', {{ attr: {{ cx: 850 }}, duration: 0.55, ease: 'power2.inOut' }}, 18.8);
flash(19.35, 0.16);
tl.fromTo('#proc3', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 19.35);
tl.to('#proc3 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 19.85);

tl.to('#scene-process', {{ opacity: 0, duration: 0.45 }}, 22.8);

// 23.2  CURTAIN WIPE into benefits
curtainWipe(23.2);
tl.set('#scene-benefits', {{ opacity: 1 }}, 23.22);

tl.to('#scene-benefits .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 23.35);
tl.to('#benefits-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 23.55);

flash(23.95, 0.22);
['ben1', 'ben2', 'ben3', 'ben4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, x: -34, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }}, 23.95 + i * 0.22);
  tl.to('#' + id + ' .benefit-check', {{ scale: 1.5, duration: 0.9, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 23.95 + i * 0.22 + 0.5);
}});

tl.to('#scene-benefits', {{ opacity: 0, duration: 0.45 }}, 29.4);

// 29.8  BARS WIPE into location
barsWipe(29.8);
tl.set('#scene-location', {{ opacity: 1 }}, 29.82);

tl.fromTo('#location-card', {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }}, 29.95);

tl.to('#scene-location', {{ opacity: 0, duration: 0.45 }}, 33.0);
tl.to('#corner-logo', {{ opacity: 0, duration: 0.3 }}, 33.0);

// 33.4  NEON WIPE into CTA
neonWipe(33.4);
tl.set('#scene-cta', {{ opacity: 1 }}, 33.41);

tl.fromTo('#cta-logo-wrap', {{ scale: 0.75, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }}, 33.55);
['ctaring1', 'ctaring2', 'ctaring3'].forEach((id, i) => {{
  gsap.set('#' + id, {{ opacity: 0 }});
  tl.to('#' + id, {{ opacity: 1, duration: 0.35 }}, 33.55);
  tl.to('#' + id, {{ scale: 1.03, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 33.68 + i * 0.07);
}});
tl.fromTo('#cta-headline .word', {{ opacity: 0, y: 28, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'power3.out' }}, 34.2);
flash(34.65, 0.28);
gsap.set('#cta-qr-wrap', {{ scale: 0.7, rotation: -6 }});
tl.to('#cta-qr-wrap', {{ opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }}, 34.65);
tl.fromTo('#cta-qr-ring', {{ scale: 1, opacity: 0.9 }}, {{ scale: 1.18, opacity: 0, duration: 1.0, repeat: 2, ease: 'power1.out' }}, 35.1);
tl.to('#cta-qr-label', {{ opacity: 1, duration: 0.4 }}, 35.2);
tl.to('#cta-url', {{ opacity: 1, y: -4, duration: 0.45 }}, 35.35);

// 39.6 — fade out, loop
tl.to('#scene-cta', {{ opacity: 0, duration: 0.45 }}, 39.4);
tl.to('#blackout', {{ opacity: 1, duration: 0.9, ease: 'power2.in' }}, 39.55);

// reset for next loop
tl.call(() => {{
  gsap.set('#logo-wrap-intro', {{ opacity: 0, y: 16, scale: 0.92 }});
  gsap.set('#tagline', {{ opacity: 0 }});
  gsap.set('#sub-tagline', {{ opacity: 0 }});
  gsap.set('#corner-logo', {{ opacity: 0 }});
  gsap.set('#headline-text .word', {{ opacity: 0, y: 30, filter: 'blur(8px)' }});
  gsap.set('#headline-sub', {{ opacity: 0 }});
  gsap.set('#workshops-divider', {{ width: '0px' }});
  gsap.set('#scene-workshops .heading .word', {{ opacity: 0, y: 24, scale: 0.7, filter: 'blur(6px)' }});
  gsap.set(['#ws1', '#ws2', '#ws3'], {{ opacity: 0, y: 36, scale: 0.94 }});
  gsap.set('#scene-process .heading .word', {{ opacity: 0, y: 24, scale: 0.7, filter: 'blur(6px)' }});
  gsap.set(procLine, {{ strokeDashoffset: procLineLen }});
  gsap.set('#process-line-dot', {{ attr: {{ cx: 170 }} }});
  gsap.set(['#proc1', '#proc2', '#proc3'], {{ opacity: 0, y: 26, scale: 0.92 }});
  gsap.set('#benefits-divider', {{ width: '0px' }});
  gsap.set('#scene-benefits .heading .word', {{ opacity: 0, y: 24, scale: 0.7, filter: 'blur(6px)' }});
  gsap.set(['#ben1', '#ben2', '#ben3', '#ben4'], {{ opacity: 0, x: -34 }});
  gsap.set('#location-card', {{ opacity: 0, y: 20 }});
  gsap.set(['#ctaring1', '#ctaring2', '#ctaring3'], {{ opacity: 0 }});
  gsap.set('#cta-logo-wrap', {{ opacity: 0, scale: 0.75 }});
  gsap.set('#cta-headline .word', {{ opacity: 0 }});
  gsap.set('#cta-qr-wrap', {{ opacity: 0, scale: 0.7, rotation: -6 }});
  gsap.set('#cta-qr-label', {{ opacity: 0 }});
  gsap.set('#cta-url', {{ opacity: 0 }});
}}, [], 40.4);

window.__tl = tl;
(function() {{
  var m = location.hash.match(/t=([\\d.]+)/);
  if (m) {{
    tl.pause();
    tl.seek(parseFloat(m[1]), false);
  }}
}})();
</script>
</body>
</html>
"""

with open('public/wabisabi-ad.html', 'w', encoding='utf-8') as f:
    f.write(HTML)

print('written', len(HTML), 'bytes')
