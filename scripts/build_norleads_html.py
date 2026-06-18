import base64

with open('public/norleads/logo.png', 'rb') as f:
    LOGO_B64 = base64.b64encode(f.read()).decode()
with open('public/norleads/qr-pris.png', 'rb') as f:
    QR_B64 = base64.b64encode(f.read()).decode()
with open('scripts/gsap.min.js', 'r', encoding='utf-8') as f:
    GSAP_JS = f.read()

FONT_FACES = []
for fam, file, weight, style in [
    ('Big Shoulders Display', 'BigShoulders-400.ttf', 400, 'normal'),
    ('Big Shoulders Display', 'BigShoulders-500.ttf', 500, 'normal'),
    ('Big Shoulders Display', 'BigShoulders-700.ttf', 700, 'normal'),
    ('Big Shoulders Display', 'BigShoulders-900.ttf', 900, 'normal'),
    ('Instrument Serif', 'InstrumentSerif-400.ttf', 400, 'normal'),
    ('Instrument Serif', 'InstrumentSerif-400i.ttf', 400, 'italic'),
    ('JetBrains Mono', 'JetBrainsMono-400.ttf', 400, 'normal'),
    ('JetBrains Mono', 'JetBrainsMono-500.ttf', 500, 'normal'),
    ('JetBrains Mono', 'JetBrainsMono-700.ttf', 700, 'normal'),
]:
    with open(f'public/norleads/fonts/{file}', 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    FONT_FACES.append(
        f"""@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};src:url(data:font/ttf;base64,{b64}) format('truetype');}}"""
    )
FONT_FACES_CSS = '\n  '.join(FONT_FACES)

HTML = f"""<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<title>NorLeads — Motion Design Studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  {FONT_FACES_CSS}
  :root{{
    --bg:#060606; --surface:#0c0c0c; --surface2:#161616; --border:#2e2e2e;
    --lime:#B6FF3D; --pink:#FF2E93; --orange:#FF6B1A; --yellow:#FFE74C; --cyan:#00E5FF; --violet:#B47CFF;
    --text:#cfccc6; --white:#f2efe9; --dim:#8a8a8a;
    --display:'Big Shoulders Display',sans-serif; --serif:'Instrument Serif',serif; --mono:'JetBrains Mono',monospace;
  }}
  *{{margin:0;padding:0;box-sizing:border-box;}}
  html,body{{width:100%;height:100%;background:#000;overflow:hidden;font-family:var(--mono);}}
  #viewport{{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;}}
  #canvas{{position:relative;width:1920px;height:1080px;background:var(--bg);overflow:hidden;transform-origin:center center;}}

  @keyframes gridDrift{{0%{{background-position:0 0,0 0;}}100%{{background-position:90px 90px,90px 90px;}}}}
  #grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(182,255,61,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(182,255,61,0.05) 1px,transparent 1px);background-size:90px 90px;animation:gridDrift 16s linear infinite;}}
  @keyframes washPulse{{0%,100%{{opacity:.6;transform:scale(1);}}50%{{opacity:1;transform:scale(1.08);}}}}
  #wash{{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 28%, rgba(182,255,61,0.08) 0%, transparent 70%);animation:washPulse 7s ease-in-out infinite;}}

  #orbs{{position:absolute;inset:0;overflow:hidden;}}
  .orb{{position:absolute;border-radius:50%;filter:blur(40px);opacity:.35;mix-blend-mode:screen;}}
  #orb1{{width:340px;height:340px;left:6%;top:14%;background:radial-gradient(circle,var(--lime),transparent 70%);animation:orbDrift1 13s ease-in-out infinite;}}
  #orb2{{width:260px;height:260px;right:8%;top:58%;background:radial-gradient(circle,var(--cyan),transparent 70%);animation:orbDrift2 11s ease-in-out infinite;}}
  #orb3{{width:300px;height:300px;left:20%;bottom:6%;background:radial-gradient(circle,var(--pink),transparent 70%);animation:orbDrift3 15s ease-in-out infinite;}}
  #orb4{{width:220px;height:220px;right:18%;top:8%;background:radial-gradient(circle,var(--violet),transparent 70%);animation:orbDrift4 9.5s ease-in-out infinite;}}
  @keyframes orbDrift1{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(80px,50px) scale(1.25);}}}}
  @keyframes orbDrift2{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(-70px,-40px) scale(0.85);}}}}
  @keyframes orbDrift3{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(60px,-60px) scale(1.15);}}}}
  @keyframes orbDrift4{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(-50px,60px) scale(1.3);}}}}

  @keyframes scanlineMove{{0%{{transform:translateY(-100%);}}100%{{transform:translateY(100%);}}}}
  #scanline{{position:absolute;left:0;top:0;width:100%;height:140px;background:linear-gradient(180deg,transparent,rgba(182,255,61,0.06),transparent);animation:scanlineMove 6s linear infinite;pointer-events:none;z-index:5;}}

  @keyframes dotGlow{{0%,100%{{box-shadow:0 0 0 0 rgba(182,255,61,.5);}}50%{{box-shadow:0 0 16px 5px rgba(182,255,61,.5);}}}}
  .sol-dot,.platform-dot{{animation:dotGlow 2.4s ease-in-out infinite;}}
  @keyframes checkGlow{{0%,100%{{box-shadow:0 8px 20px rgba(182,255,61,.3);}}50%{{box-shadow:0 8px 26px rgba(182,255,61,.6);}}}}
  .benefit-check{{animation:checkGlow 2.4s ease-in-out infinite;}}

  .scene{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;pointer-events:none;}}

  .accent{{color:var(--lime);}}

  #logo-wrap{{width:160px;height:160px;position:relative;}}
  #logo-wrap img{{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 0 24px rgba(182,255,61,.45));}}
  #logo-ghost-r,#logo-ghost-c{{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;mix-blend-mode:screen;opacity:0;}}
  #logo-sheen{{position:absolute;top:0;left:-65%;width:55%;height:100%;
    background:linear-gradient(75deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 35%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 65%,rgba(255,255,255,0) 100%);
    -webkit-mask-image:url(data:image/png;base64,{LOGO_B64});mask-image:url(data:image/png;base64,{LOGO_B64});
    -webkit-mask-size:160px auto;mask-size:160px auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;
    mix-blend-mode:screen;pointer-events:none;}}

  #wordmark{{font-family:var(--display);font-weight:900;font-size:96px;letter-spacing:-1px;color:var(--white);text-transform:uppercase;overflow:hidden;clip-path:inset(0 100% 0 0);white-space:nowrap;}}
  #wordmark .acc{{color:var(--lime);}}
  #tagline{{font-family:var(--mono);font-size:20px;font-weight:500;color:var(--dim);text-align:center;letter-spacing:1px;text-transform:uppercase;opacity:0;}}

  .heading{{font-family:var(--display);font-weight:900;font-size:64px;color:var(--white);text-align:center;text-transform:uppercase;letter-spacing:-0.5px;}}
  .heading .word,#headline-text .word,#cta-headline .word{{display:inline-block;opacity:0;}}
  .divider{{height:3px;width:0;margin:16px auto 0;background:linear-gradient(90deg,var(--lime),var(--cyan),var(--lime));box-shadow:0 0 14px rgba(182,255,61,.5);}}

  /* corner logo */
  #corner-logo{{position:absolute;top:50px;left:64px;display:flex;align-items:center;gap:12px;opacity:0;z-index:20;}}
  #corner-logo img{{width:38px;height:38px;}}
  #corner-logo span{{font-family:var(--display);font-weight:900;font-size:24px;color:var(--white);text-transform:uppercase;letter-spacing:-0.5px;}}
  #corner-logo span .acc{{color:var(--lime);}}

  /* headline scene */
  #headline-text{{font-family:var(--display);font-weight:900;font-size:84px;color:var(--white);text-align:center;line-height:1.15;text-transform:uppercase;letter-spacing:-1px;}}

  /* stats */
  #stats-grid{{display:flex;gap:36px;margin-top:48px;}}
  .stat-card{{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:38px 46px;width:300px;text-align:center;opacity:0;box-shadow:0 14px 36px rgba(0,0,0,0.5);}}
  .stat-num{{font-family:var(--display);font-size:58px;font-weight:900;color:var(--lime);}}
  .stat-label{{font-size:15px;color:var(--dim);margin-top:10px;text-transform:uppercase;letter-spacing:0.5px;}}

  /* process */
  #process-row{{display:flex;align-items:flex-start;gap:0;margin-top:54px;position:relative;}}
  .proc-step{{display:flex;flex-direction:column;align-items:center;width:340px;opacity:0;position:relative;z-index:2;}}
  .proc-num{{width:64px;height:64px;border-radius:50%;background:var(--lime);color:var(--bg);font-family:var(--display);font-size:26px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(182,255,61,.4);}}
  .proc-title{{font-family:var(--display);font-size:22px;font-weight:700;color:var(--white);margin-top:18px;text-align:center;text-transform:uppercase;}}
  .proc-sub{{font-size:14px;color:var(--dim);margin-top:8px;text-align:center;max-width:280px;}}
  #process-line-svg{{position:absolute;top:32px;left:0;width:100%;height:14px;overflow:visible;z-index:1;}}
  #process-line-dot{{filter:drop-shadow(0 0 6px rgba(182,255,61,.8));}}

  /* benefits */
  #benefits-list{{display:flex;flex-direction:column;gap:24px;margin-top:50px;}}
  .benefit-row{{display:flex;align-items:center;gap:20px;opacity:0;width:920px;}}
  .benefit-check{{width:38px;height:38px;border-radius:50%;background:var(--lime);display:flex;align-items:center;justify-content:center;color:var(--bg);font-weight:900;font-size:20px;flex-shrink:0;box-shadow:0 8px 20px rgba(182,255,61,.35);}}
  .benefit-text{{font-size:24px;color:var(--white);font-weight:500;}}

  /* formats / platform */
  #platform-row{{display:flex;gap:26px;margin-top:50px;}}
  .platform-pill{{background:var(--surface);border:1px solid var(--border);border-radius:50px;padding:24px 40px;display:flex;align-items:center;gap:14px;opacity:0;box-shadow:0 14px 30px rgba(0,0,0,0.4);}}
  .platform-dot{{width:12px;height:12px;border-radius:50%;background:var(--lime);}}
  .platform-label{{font-size:21px;font-weight:700;color:var(--white);text-transform:uppercase;letter-spacing:0.3px;}}

  /* solutions / ad types */
  #solutions-grid{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:46px;}}
  .sol-card{{background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--card-color,var(--lime));border-radius:4px;padding:32px 40px;width:480px;opacity:0;box-shadow:0 14px 36px rgba(0,0,0,0.4);}}
  .sol-title{{font-family:var(--display);font-size:27px;font-weight:900;color:var(--white);display:flex;align-items:center;gap:12px;text-transform:uppercase;}}
  .sol-dot{{width:10px;height:10px;border-radius:50%;background:var(--card-color,var(--lime));}}
  .sol-sub{{font-size:16px;color:var(--dim);margin-top:8px;}}

  /* cta */
  #scene-cta{{background:radial-gradient(circle at 50% 30%, #101010, var(--bg) 70%);}}
  #cta-logo-wrap{{position:relative;width:220px;height:220px;opacity:0;}}
  #cta-logo-wrap img{{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 0 30px rgba(182,255,61,.5));}}
  #cta-logo-sheen{{position:absolute;top:0;left:-65%;width:55%;height:100%;
    background:linear-gradient(75deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 35%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 65%,rgba(255,255,255,0) 100%);
    -webkit-mask-image:url(data:image/png;base64,{LOGO_B64});mask-image:url(data:image/png;base64,{LOGO_B64});
    -webkit-mask-size:220px auto;mask-size:220px auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;
    mix-blend-mode:screen;pointer-events:none;}}
  #cta-headline{{font-family:var(--display);font-size:40px;font-weight:900;color:var(--white);margin-top:14px;text-transform:uppercase;text-align:center;}}
  #cta-headline .acc{{color:var(--lime);}}
  #cta-qr-wrap{{position:relative;opacity:0;margin-top:26px;background:#fff;border-radius:18px;padding:20px;box-shadow:0 0 50px rgba(182,255,61,.4);}}
  #cta-qr-wrap img{{width:160px;height:160px;display:block;}}
  #cta-qr-ring{{position:absolute;inset:-6px;border-radius:22px;border:2px solid rgba(182,255,61,.6);pointer-events:none;}}
  #cta-qr-label{{font-size:16px;font-weight:500;color:var(--dim);margin-top:16px;opacity:0;letter-spacing:0.3px;text-transform:uppercase;}}
  #cta-url{{font-family:var(--display);font-size:22px;font-weight:900;color:var(--lime);letter-spacing:2px;text-transform:uppercase;opacity:0;margin-top:8px;}}
  .cta-ring{{position:absolute;border-radius:50%;border:1px solid rgba(182,255,61,.25);top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}}

  #stage-content{{position:absolute;inset:0;}}

  #wipe{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:40;pointer-events:none;}}
  #wipe-circle{{width:3400px;height:3400px;border-radius:50%;background:var(--surface2);transform:scale(0);}}
  #wipe-neon{{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, var(--lime), #6b9c1e);transform:scale(0);border-radius:50%;width:3400px;height:3400px;left:50%;top:50%;margin-left:-1700px;margin-top:-1700px;z-index:41;pointer-events:none;mix-blend-mode:normal;}}
  #wipe-slide{{position:absolute;inset:0;background:var(--surface2);transform:translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-split-top{{position:absolute;left:0;top:0;width:100%;height:50%;background:var(--surface);transform:translateY(-100%);z-index:40;pointer-events:none;box-shadow:0 4px 30px rgba(182,255,61,.15);}}
  #wipe-split-bottom{{position:absolute;left:0;bottom:0;width:100%;height:50%;background:var(--surface);transform:translateY(100%);z-index:40;pointer-events:none;box-shadow:0 -4px 30px rgba(182,255,61,.15);}}
  #wipe-diag{{position:absolute;top:-25%;left:-65%;width:170%;height:150%;background:var(--surface2);transform:rotate(-14deg) translateX(-100%);z-index:40;pointer-events:none;}}
  #wipe-bars{{position:absolute;inset:0;display:flex;z-index:40;pointer-events:none;}}
  .wipe-bar{{flex:1;background:var(--surface2);transform:scaleY(0);}}
  #wipe-curtain{{position:absolute;inset:0;background:var(--surface2);transform:translateY(-100%);z-index:40;pointer-events:none;}}

  #flash{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:35;pointer-events:none;opacity:0;}}
  .flash-glow{{width:1400px;height:1400px;border-radius:50%;background:radial-gradient(circle, rgba(182,255,61,.9) 0%, rgba(182,255,61,.25) 35%, transparent 70%);}}

  #blackout{{position:absolute;inset:0;background:#000;opacity:1;pointer-events:none;z-index:50;}}
</style>
</head>
<body>

<div id="viewport">
  <div id="canvas">
   <div id="stage-content">
    <div id="grid"></div>
    <div id="wash"></div>
    <div id="orbs">
      <div class="orb" id="orb1"></div>
      <div class="orb" id="orb2"></div>
      <div class="orb" id="orb3"></div>
      <div class="orb" id="orb4"></div>
    </div>
    <div id="scanline"></div>

    <!-- corner logo (appears after intro) -->
    <div id="corner-logo">
      <img src="data:image/png;base64,{LOGO_B64}" alt="">
      <span>Nor<span class="acc">Leads</span></span>
    </div>

    <!-- SCENE 1: intro -->
    <div class="scene" id="scene-intro">
      <div style="position:absolute;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(182,255,61,.08) 0%, transparent 65%);"></div>
      <div id="logo-wrap">
        <img id="logo-ghost-r" src="data:image/png;base64,{LOGO_B64}" style="filter:drop-shadow(0 0 0 transparent) brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(7000%) hue-rotate(320deg);">
        <img id="logo-ghost-c" src="data:image/png;base64,{LOGO_B64}" style="filter:brightness(0) saturate(100%) invert(70%) sepia(80%) saturate(2000%) hue-rotate(150deg);">
        <img id="logo-main" src="data:image/png;base64,{LOGO_B64}" alt="NorLeads">
        <div id="logo-sheen"></div>
      </div>
      <div id="wordmark">Nor<span class="acc">Leads</span></div>
      <div id="tagline">Animerte reklamefilmer som selger</div>
    </div>

    <!-- SCENE 2: headline (real homepage hero copy) -->
    <div class="scene" id="scene-headline">
      <div style="text-align:center;max-width:1500px;">
        <div id="headline-text"><span class="word">Motion</span> <span class="word">design</span><br><span class="word">som</span> <span class="word accent">selger</span></div>
      </div>
    </div>

    <!-- SCENE 3: stats -->
    <div class="scene" id="scene-stats">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Mockup</span> <span class="word">først.</span> <span class="word accent">Du</span> <span class="word accent">bestemmer.</span></div>
        <div class="divider" id="stats-divider"></div>
      </div>
      <div id="stats-grid">
        <div class="stat-card" id="stat1"><div class="stat-num" id="stat1-num">0</div><div class="stat-label">virkedager levering</div></div>
        <div class="stat-card" id="stat2"><div class="stat-num" id="stat2-num">0t</div><div class="stat-label">gratis mockup</div></div>
        <div class="stat-card" id="stat3"><div class="stat-num" id="stat3-num">0t</div><div class="stat-label">svartid</div></div>
      </div>
    </div>

    <!-- SCENE 4: process -->
    <div class="scene" id="scene-process">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Slik</span> <span class="word accent">fungerer</span> <span class="word">det</span></div>
      </div>
      <div id="process-row">
        <svg id="process-line-svg" viewBox="0 0 1020 14" preserveAspectRatio="none">
          <line id="process-line-path" x1="170" y1="7" x2="850" y2="7" stroke="#B6FF3D" stroke-width="3" stroke-linecap="round" fill="none"/>
          <circle id="process-line-dot" cx="170" cy="7" r="7" fill="var(--lime)"/>
        </svg>
        <div class="proc-step" id="proc1"><div class="proc-num">1</div><div class="proc-title">Send oss en brief</div><div class="proc-sub">Kort prat om merkevaren, målgruppen og hva du vil oppnå. 15 min.</div></div>
        <div class="proc-step" id="proc2"><div class="proc-num">2</div><div class="proc-title">Få første mockup</div><div class="proc-sub">Innen 48 timer leverer vi en visuell preview. Helt gratis.</div></div>
        <div class="proc-step" id="proc3"><div class="proc-num">3</div><div class="proc-title">Liker du det? Vi fortsetter</div><div class="proc-sub">Null risiko — liker du det ikke, stopper vi der.</div></div>
      </div>
    </div>

    <!-- SCENE 5: solutions / ad types -->
    <div class="scene" id="scene-solutions">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Reklame,</span> <span class="word accent">alle</span> <span class="word accent">typer</span></div>
        <div class="divider" id="solutions-divider"></div>
      </div>
      <div id="solutions-grid">
        <div class="sol-card" id="sol1" style="--card-color:var(--lime);"><div class="sol-title"><span class="sol-dot"></span>Kampanjelansering</div><div class="sol-sub">Hovedfilmen som setter tonen for hele kampanjen. Hero · 30–40s.</div></div>
        <div class="sol-card" id="sol2" style="--card-color:var(--pink);"><div class="sol-title"><span class="sol-dot"></span>Produktlansering</div><div class="sol-sub">Fra silhuett til detalj — bygget for å skape «wow» i feed. 20–30s.</div></div>
        <div class="sol-card" id="sol3" style="--card-color:var(--cyan);"><div class="sol-title"><span class="sol-dot"></span>Sosiale medier</div><div class="sol-sub">Reels, Stories, TikTok, LinkedIn — i 9:16, 1:1 og 16:9.</div></div>
        <div class="sol-card" id="sol4" style="--card-color:var(--orange);"><div class="sol-title"><span class="sol-dot"></span>Event &amp; salg</div><div class="sol-sub">Tydelig CTA, brennbar timing, fokusert effekt. 15–20s.</div></div>
      </div>
    </div>

    <!-- SCENE 6: benefits -->
    <div class="scene" id="scene-benefits">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Hvorfor</span> <span class="word accent">NorLeads</span></div>
        <div class="divider" id="benefits-divider"></div>
      </div>
      <div id="benefits-list">
        <div class="benefit-row" id="ben1"><div class="benefit-check">✓</div><div class="benefit-text">Stopper scroll uten å tape varemerket</div></div>
        <div class="benefit-row" id="ben2"><div class="benefit-check">✓</div><div class="benefit-text">Norsk håndverk og presisjon i hver ramme</div></div>
        <div class="benefit-row" id="ben3"><div class="benefit-check">✓</div><div class="benefit-text">IAB-standard, optimalisert for alle kanaler</div></div>
        <div class="benefit-row" id="ben4"><div class="benefit-check">✓</div><div class="benefit-text">Null risiko — du betaler først når du liker mockupen</div></div>
      </div>
    </div>

    <!-- SCENE 7: formats -->
    <div class="scene" id="scene-platform">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Ett</span> <span class="word">prosjekt,</span> <span class="word accent">alle</span> <span class="word accent">formater</span></div>
      </div>
      <div id="platform-row">
        <div class="platform-pill" id="plat1"><span class="platform-dot"></span><span class="platform-label">9:16 · 1:1 · 16:9</span></div>
        <div class="platform-pill" id="plat2"><span class="platform-dot"></span><span class="platform-label">Display &lt;150kb</span></div>
        <div class="platform-pill" id="plat3"><span class="platform-dot"></span><span class="platform-label">IAB-standard</span></div>
      </div>
    </div>

    <!-- SCENE 8: CTA -->
    <div class="scene" id="scene-cta">
      <div class="cta-ring" id="ctaring1" style="width:560px;height:560px;"></div>
      <div class="cta-ring" id="ctaring2" style="width:680px;height:680px;"></div>
      <div class="cta-ring" id="ctaring3" style="width:800px;height:800px;"></div>
      <div id="cta-logo-wrap">
        <img src="data:image/png;base64,{LOGO_B64}" alt="NorLeads">
        <div id="cta-logo-sheen"></div>
      </div>
      <div id="cta-headline"><span class="word">Be</span> <span class="word">om</span> <span class="word accent">pris</span></div>
      <div id="cta-qr-wrap"><div id="cta-qr-ring"></div><img src="data:image/png;base64,{QR_B64}" alt="QR til norleads.no"></div>
      <div id="cta-qr-label">Skann for å be om pris</div>
      <div id="cta-url">norleads.no</div>
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

gsap.set('.heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});

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
  flash(time - 0.04, 0.45, 0.3);
}}
function countUp(id, time, target, suffix, dur = 1.0) {{
  const el = document.getElementById(id);
  tl.to({{ v: 0 }}, {{
    v: target, duration: dur, ease: 'power2.out',
    onUpdate() {{ el.textContent = Math.round(this.targets()[0].v) + suffix; }},
  }}, time);
}}
function neonWipe(time) {{
  tl.to('#stage-content', {{ scale: 1.07, filter: 'blur(8px)', duration: 0.26, ease: 'power2.in' }}, time - 0.36);
  tl.to('#wipe-neon', {{ scale: 1, duration: 0.36, ease: 'power3.in' }}, time - 0.36);
  flash(time - 0.1, 0.6, 0.3);
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
tl.to('#blackout', {{ opacity: 0, duration: 0.4, ease: 'power1.in' }}, 0.0);
tl.set('#scene-intro', {{ opacity: 1 }}, 0.0);

// 0.1 — 0.7 glitch / RGB-split logo intro
gsap.set(['#logo-main', '#logo-ghost-r', '#logo-ghost-c'], {{ opacity: 0 }});
tl.to('#logo-main', {{ opacity: 1, duration: 0.05 }}, 0.08);
tl.to(['#logo-ghost-r', '#logo-ghost-c'], {{ opacity: 0.8, duration: 0.05 }}, 0.08);
tl.to('#logo-ghost-r', {{ x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' }}, 0.08);
tl.to('#logo-ghost-c', {{ x: -8, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' }}, 0.08);
tl.to(['#logo-ghost-r', '#logo-ghost-c'], {{ x: 0, opacity: 0, duration: 0.18, ease: 'power2.out' }}, 0.46);
flash(0.52, 0.5, 0.25);

// 0.85 — 1.6 wordmark reveal + tagline
tl.to('#wordmark', {{ clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.out' }}, 0.72);
tl.to('#tagline', {{ opacity: 1, y: -4, duration: 0.5, ease: 'power2.out' }}, 1.14);
tl.fromTo('#tagline', {{ y: 8 }}, {{ y: 0, duration: 0.5, ease: 'power2.out' }}, 1.14);

// crystal-shader style light sweep across the logo mark
tl.fromTo('#logo-sheen', {{ left: '-65%' }}, {{ left: '135%', duration: 1.1, ease: 'power1.inOut' }}, 1.35);

tl.to('#scene-intro', {{ opacity: 0, duration: 0.4 }}, 3.37);

// 4.4  IRIS WIPE into headline
irisWipe(3.7);
tl.set('#scene-headline', {{ opacity: 1 }}, 3.72);
tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 3.79);

tl.fromTo('#headline-text .word', {{ opacity: 0, y: 36, scale: 0.55, rotation: -10, filter: 'blur(9px)' }}, {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.07, ease: 'back.out(2)' }}, 3.87);
tl.to('#headline-text .word', {{ y: -6, duration: 1.1, repeat: 2, yoyo: true, ease: 'sine.inOut', stagger: 0.08 }}, 4.6);

tl.to('#scene-headline', {{ opacity: 0, duration: 0.4 }}, 6.23);

// 7.8  SLIDE WIPE into stats
slideWipe(6.56);
tl.set('#scene-stats', {{ opacity: 1 }}, 6.58);

tl.to('#scene-stats .heading .word', {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' }}, 6.69);
tl.to('#stats-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 6.86);

flash(7.24, 0.25);
['stat1', 'stat2', 'stat3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 7.24 + i * 0.15);
  tl.to('#' + id, {{ y: -10, duration: 0.9, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 7.24 + i * 0.15 + 0.5);
}});
countUp('stat1-num', 6.30, 7, '', 1.0);
countUp('stat2-num', 6.43, 48, 't', 1.0);
countUp('stat3-num', 6.55, 24, 't', 1.0);

tl.to('#scene-stats', {{ opacity: 0, duration: 0.4 }}, 10.1);

// 12.4  DIAGONAL WIPE into process
diagWipe(10.43);
tl.set('#scene-process', {{ opacity: 1 }}, 10.45);

tl.to('#scene-process .heading .word', {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' }}, 10.56);

// step 1 appears first
flash(10.81, 0.18);
tl.fromTo('#proc1', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 10.81);
tl.to('#proc1 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 5, yoyo: true, ease: 'sine.inOut' }}, 11.23);

// line draws from step 1 to step 2, then step 2 appears
tl.to(procLine, {{ strokeDashoffset: procLineLen / 2, duration: 0.5, ease: 'power2.inOut' }}, 11.23);
tl.to('#process-line-dot', {{ attr: {{ cx: 510 }}, duration: 0.5, ease: 'power2.inOut' }}, 11.23);
flash(11.61, 0.16);
tl.fromTo('#proc2', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 11.61);
tl.to('#proc2 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 12.03);

// line draws from step 2 to step 3, then step 3 appears
tl.to(procLine, {{ strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }}, 12.03);
tl.to('#process-line-dot', {{ attr: {{ cx: 850 }}, duration: 0.5, ease: 'power2.inOut' }}, 12.03);
flash(12.41, 0.16);
tl.fromTo('#proc3', {{ opacity: 0, y: 24, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }}, 12.41);
tl.to('#proc3 .proc-num', {{ y: -6, scale: 1.06, duration: 0.7, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 12.83);

tl.to('#scene-process', {{ opacity: 0, duration: 0.4 }}, 14.3);

// 17.4  BARS WIPE into solutions
barsWipe(14.64);
tl.set('#scene-solutions', {{ opacity: 1 }}, 14.66);

tl.to('#scene-solutions .heading .word', {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' }}, 14.77);
tl.to('#solutions-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 14.93);

flash(15.31, 0.25);
['sol1', 'sol2', 'sol3', 'sol4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 28, scale: 0.94, rotation: -4, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 15.31 + i * 0.19);
  tl.to('#' + id, {{ y: -9, duration: 1.0, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 15.31 + i * 0.19 + 0.5);
}});

tl.to('#scene-solutions', {{ opacity: 0, duration: 0.4 }}, 18.85);

// 22.8  CURTAIN WIPE into benefits
curtainWipe(19.18);
tl.set('#scene-benefits', {{ opacity: 1 }}, 19.2);

tl.to('#scene-benefits .heading .word', {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' }}, 19.31);
tl.to('#benefits-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 19.48);

flash(19.86, 0.25);
['ben1', 'ben2', 'ben3', 'ben4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, x: -32, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }}, 19.86 + i * 0.19);
  tl.to('#' + id + ' .benefit-check', {{ scale: 1.15, rotation: 8, duration: 0.8, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 19.86 + i * 0.19 + 0.5);
}});

tl.to('#scene-benefits', {{ opacity: 0, duration: 0.4 }}, 22.72);

// 27.4  ZOOM SPIN into formats
zoomSpin(23.05);
tl.set('#scene-platform', {{ opacity: 1 }}, 23.07);

tl.to('#scene-platform .heading .word', {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' }}, 23.18);

['plat1', 'plat2', 'plat3'].forEach((id, i) => {{
  const fromX = i % 2 === 0 ? -40 : 40;
  tl.fromTo('#' + id, {{ opacity: 0, x: fromX, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }}, 23.56 + i * 0.17);
  tl.to('#' + id, {{ y: -8, duration: 0.9, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 23.56 + i * 0.17 + 0.5);
}});

tl.to('#scene-platform', {{ opacity: 0, duration: 0.4 }}, 26.25);
tl.to('#corner-logo', {{ opacity: 0, duration: 0.3 }}, 26.25);

// 31.6  NEON WIPE into CTA (bold lime strobe cut)
neonWipe(26.59);
tl.set('#scene-cta', {{ opacity: 1 }}, 26.6);

tl.fromTo('#cta-logo-wrap', {{ scale: 0.7, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.5)' }}, 26.71);
tl.fromTo('#cta-logo-sheen', {{ left: '-65%' }}, {{ left: '135%', duration: 1.3, repeat: 2, repeatDelay: 1.4, ease: 'power1.inOut' }}, 27.26);
['ctaring1', 'ctaring2', 'ctaring3'].forEach((id, i) => {{
  gsap.set('#' + id, {{ opacity: 0 }});
  tl.to('#' + id, {{ opacity: 1, duration: 0.35 }}, 26.71);
  tl.to('#' + id, {{ scale: 1.03, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 26.84 + i * 0.07);
}});
tl.fromTo('#cta-headline .word', {{ opacity: 0, y: 28, scale: 0.5, rotation: -10, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(2.4)' }}, 27.34);
flash(27.76, 0.32);
gsap.set('#cta-qr-wrap', {{ scale: 0.7, rotation: -6 }});
tl.to('#cta-qr-wrap', {{ opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }}, 27.76);
tl.fromTo('#cta-qr-ring', {{ scale: 1, opacity: 0.9 }}, {{ scale: 1.18, opacity: 0, duration: 1.0, repeat: 2, ease: 'power1.out' }}, 28.19);
tl.to('#cta-qr-label', {{ opacity: 1, duration: 0.4 }}, 28.27);
tl.to('#cta-url', {{ opacity: 1, y: -4, duration: 0.45 }}, 28.4);

// 40.4 — fade out, loop
tl.to('#scene-cta', {{ opacity: 0, duration: 0.45 }}, 33.99);
tl.to('#blackout', {{ opacity: 1, duration: 0.9, ease: 'power2.in' }}, 34.16);

// reset for next loop
tl.call(() => {{
  gsap.set('#wordmark', {{ clipPath: 'inset(0 100% 0 0)' }});
  gsap.set('#tagline', {{ opacity: 0 }});
  gsap.set(['#logo-main', '#logo-ghost-r', '#logo-ghost-c'], {{ opacity: 0, x: 0 }});
  gsap.set('#logo-sheen', {{ left: '-65%' }});
  gsap.set('#corner-logo', {{ opacity: 0 }});
  gsap.set('#stats-divider', {{ width: '0px' }});
  gsap.set('#scene-stats .heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});
  gsap.set(['#stat1', '#stat2', '#stat3'], {{ opacity: 0, y: 28, scale: 0.9 }});
  document.getElementById('stat1-num').textContent = '0';
  document.getElementById('stat2-num').textContent = '0t';
  document.getElementById('stat3-num').textContent = '0t';
  gsap.set('#scene-process .heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});
  gsap.set(procLine, {{ strokeDashoffset: procLineLen }});
  gsap.set('#process-line-dot', {{ attr: {{ cx: 170 }} }});
  gsap.set(['#proc1', '#proc2', '#proc3'], {{ opacity: 0, y: 24, scale: 0.92 }});
  gsap.set('#solutions-divider', {{ width: '0px' }});
  gsap.set('#scene-solutions .heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});
  gsap.set(['#sol1', '#sol2', '#sol3', '#sol4'], {{ opacity: 0, y: 28, scale: 0.94, rotation: -4 }});
  gsap.set('#benefits-divider', {{ width: '0px' }});
  gsap.set('#scene-benefits .heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});
  gsap.set(['#ben1', '#ben2', '#ben3', '#ben4'], {{ opacity: 0, x: -32 }});
  gsap.set('#scene-platform .heading .word', {{ opacity: 0, y: 22, scale: 0.6, rotation: -8, filter: 'blur(6px)' }});
  gsap.set('#plat1', {{ opacity: 0, x: -40 }});
  gsap.set('#plat2', {{ opacity: 0, x: 40 }});
  gsap.set('#plat3', {{ opacity: 0, x: -40 }});
  gsap.set(['#ctaring1', '#ctaring2', '#ctaring3'], {{ opacity: 0 }});
  gsap.set('#cta-qr-wrap', {{ opacity: 0, scale: 0.7, rotation: -6 }});
  gsap.set('#cta-qr-label', {{ opacity: 0 }});
  gsap.set('#cta-url', {{ opacity: 0 }});
  gsap.set('#cta-logo-wrap', {{ opacity: 0, scale: 0.7 }});
  gsap.set('#cta-logo-sheen', {{ left: '-65%' }});
  gsap.set('#cta-headline .word', {{ opacity: 0 }});
}}, [], 35.0);

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

with open('public/norleads-ad.html', 'w', encoding='utf-8') as f:
    f.write(HTML)

print('written', len(HTML), 'bytes')
