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
with open('public/wabisabi/craft.jpg', 'rb') as f:
    CRAFT_B64 = base64.b64encode(f.read()).decode()
with open('public/wabisabi/finished.jpg', 'rb') as f:
    FINISHED_B64 = base64.b64encode(f.read()).decode()
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
    --paper:#EAE1D2; --paper2:#E1D5C0; --ink:#2C2520; --ink-dim:#6b5d4f;
    --clay:#B5563A; --clay-deep:#8a3f29; --moss:#5c6650; --gold:#A9803F;
    --line:#c9b89e; --card:#F4ECDD;
    --display:'Instrument Serif',serif; --sans:'Poppins',sans-serif;
  }}
  *{{margin:0;padding:0;box-sizing:border-box;}}
  html,body{{width:100%;height:100%;background:#000;overflow:hidden;font-family:var(--sans);}}
  #viewport{{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;}}
  #canvas{{position:relative;width:1920px;height:1080px;background:var(--paper);overflow:hidden;transform-origin:center center;}}

  /* paper fiber texture */
  #paper-tex{{position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;pointer-events:none;z-index:3;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' result='t'/><feColorMatrix in='t' type='matrix' values='0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}}
  @keyframes paperDrift{{0%{{background-position:0 0;}}100%{{background-position:90px 70px;}}}}
  #paper-tex{{animation:paperDrift 14s steps(4) infinite;}}

  /* hand-drawn organic blobs instead of glow orbs */
  #blobs{{position:absolute;inset:0;overflow:hidden;z-index:1;}}
  .blob{{position:absolute;opacity:.5;}}
  #blob1{{width:520px;height:520px;left:-120px;top:-100px;background:var(--clay);opacity:.10;border-radius:38% 62% 63% 37% / 41% 44% 56% 59%;animation:blobMove1 18s ease-in-out infinite;}}
  #blob2{{width:420px;height:420px;right:-100px;bottom:-80px;background:var(--moss);opacity:.10;border-radius:56% 44% 41% 59% / 60% 38% 62% 40%;animation:blobMove2 20s ease-in-out infinite;}}
  #blob3{{width:300px;height:300px;left:62%;top:58%;background:var(--gold);opacity:.08;border-radius:46% 54% 60% 40% / 50% 46% 54% 50%;animation:blobMove3 16s ease-in-out infinite;}}
  @keyframes blobMove1{{0%,100%{{transform:translate(0,0) rotate(0deg);}}50%{{transform:translate(40px,30px) rotate(8deg);}}}}
  @keyframes blobMove2{{0%,100%{{transform:translate(0,0) rotate(0deg);}}50%{{transform:translate(-35px,-25px) rotate(-6deg);}}}}
  @keyframes blobMove3{{0%,100%{{transform:translate(0,0) scale(1);}}50%{{transform:translate(-20px,20px) scale(1.1);}}}}

  .scene{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;pointer-events:none;z-index:4;}}
  .accent{{color:var(--clay);font-style:italic;}}

  /* organic-framed photo, off-center, not full-bleed */
  .photo-organic{{position:absolute;overflow:hidden;box-shadow:0 30px 70px rgba(44,37,32,.25);border:1px solid rgba(44,37,32,.08);}}
  .photo-organic img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1);animation:kenBurns 9s ease-out forwards;filter:saturate(.92) contrast(1.04);}}
  @keyframes kenBurns{{0%{{transform:scale(1.0) translate(0,0);}}100%{{transform:scale(1.1) translate(-1%,-1%);}}}}

  #logo-wrap-intro{{width:460px;opacity:0;}}
  #logo-wrap-intro svg{{width:100%;display:block;color:var(--ink);}}
  .a_2{{transform:scaleY(-1);transform-box:fill-box;transform-origin:center;}}
  #tagline{{font-family:var(--display);font-style:italic;font-size:30px;color:var(--clay);text-align:center;letter-spacing:.5px;opacity:0;}}
  #sub-tagline{{font-size:16px;font-weight:300;color:var(--ink-dim);text-align:center;letter-spacing:3px;text-transform:uppercase;opacity:0;}}
  .hairline{{height:1px;width:0;background:var(--line);}}

  .heading{{font-family:var(--display);font-weight:400;font-size:76px;color:var(--ink);text-align:center;letter-spacing:-.5px;}}
  .heading .word{{display:inline-block;opacity:0;}}
  #headline-text .word,#cta-headline .word{{display:inline-block;opacity:0;}}
  .divider{{height:1px;width:0;margin:18px auto 0;background:var(--clay);}}

  /* corner logo */
  #corner-logo{{position:absolute;top:54px;left:64px;display:flex;align-items:center;gap:0;opacity:0;z-index:20;}}
  #corner-logo svg{{width:150px;color:var(--ink);}}
  #corner-mark{{position:absolute;top:50px;right:64px;width:14px;height:14px;border-radius:46% 54% 60% 40% / 50% 46% 54% 50%;background:var(--clay);opacity:0;z-index:20;}}

  /* headline scene — asymmetric split, photo right, text left on paper */
  #scene-headline{{flex-direction:row;align-items:center;justify-content:flex-start;gap:0;}}
  #headline-textwrap{{position:relative;width:860px;padding-left:140px;z-index:5;}}
  #headline-text{{font-family:var(--display);font-weight:400;font-size:88px;color:var(--ink);text-align:left;line-height:1.14;letter-spacing:-1px;}}
  #headline-sub{{font-size:21px;font-weight:300;color:var(--ink-dim);text-align:left;margin-top:20px;opacity:0;letter-spacing:.3px;max-width:480px;}}
  #headline-photo{{right:0;top:0;width:920px;height:1080px;border-radius:0;}}
  #headline-photo::after{{content:'';position:absolute;inset:0;background:linear-gradient(90deg, var(--paper) 0%, transparent 8%);}}

  /* workshop cards — paper card, photo inset top, organic corner */
  #workshop-grid{{display:flex;gap:36px;margin-top:46px;}}
  .ws-card{{position:relative;width:368px;opacity:0;background:var(--card);border-radius:4px 28px 4px 4px;box-shadow:0 18px 40px rgba(44,37,32,.16);border:1px solid var(--line);overflow:hidden;}}
  .ws-photo{{position:relative;width:100%;height:300px;overflow:hidden;}}
  .ws-photo img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.03) sepia(.06);}}
  .ws-body{{padding:24px 26px 30px;}}
  .ws-num{{font-family:var(--display);font-style:italic;font-size:24px;color:var(--clay);}}
  .ws-title{{font-family:var(--display);font-size:32px;color:var(--ink);margin-top:6px;}}
  .ws-sub{{font-size:14.5px;font-weight:300;color:var(--ink-dim);line-height:1.5;margin-top:8px;}}

  /* process */
  #process-row{{display:flex;align-items:flex-start;gap:0;margin-top:54px;position:relative;}}
  .proc-step{{display:flex;flex-direction:column;align-items:center;width:340px;opacity:0;position:relative;z-index:2;}}
  .proc-num{{width:60px;height:60px;border-radius:42% 58% 60% 40% / 54% 46% 54% 46%;border:1.5px solid var(--clay);color:var(--clay);font-family:var(--display);font-style:italic;font-size:25px;display:flex;align-items:center;justify-content:center;background:var(--card);}}
  .proc-title{{font-family:var(--display);font-size:25px;font-weight:400;color:var(--ink);margin-top:20px;text-align:center;}}
  .proc-sub{{font-size:14.5px;font-weight:300;color:var(--ink-dim);margin-top:8px;text-align:center;max-width:288px;}}
  #process-line-svg{{position:absolute;top:30px;left:0;width:100%;height:14px;overflow:visible;z-index:1;}}
  #process-line-dot{{filter:none;}}

  /* benefits */
  #benefits-list{{display:flex;flex-direction:column;gap:24px;margin-top:48px;}}
  .benefit-row{{display:flex;align-items:center;gap:20px;opacity:0;width:860px;}}
  .benefit-check{{width:10px;height:10px;border-radius:42% 58% 60% 40% / 54% 46% 54% 46%;background:var(--clay);flex-shrink:0;}}
  .benefit-text{{font-family:var(--display);font-size:27px;font-weight:400;color:var(--ink);}}

  /* location scene — asymmetric split mirrored */
  #scene-location{{flex-direction:row;align-items:center;justify-content:flex-end;gap:0;}}
  #location-photo{{left:0;top:0;width:920px;height:1080px;}}
  #location-photo::after{{content:'';position:absolute;inset:0;background:linear-gradient(270deg, var(--paper) 0%, transparent 8%);}}
  #location-card{{position:relative;width:860px;padding-right:150px;text-align:right;opacity:0;}}
  #location-name{{font-family:var(--display);font-style:italic;font-size:44px;color:var(--clay);}}
  #location-addr{{font-size:19px;font-weight:300;color:var(--ink);margin-top:12px;letter-spacing:.3px;}}
  #location-phone{{font-size:16px;font-weight:300;color:var(--ink-dim);margin-top:6px;letter-spacing:.3px;}}
  #location-name .word{{display:inline-block;opacity:0;}}

  /* full-bleed animation-only photo scenes */
  .photo-full{{position:absolute;inset:0;overflow:hidden;}}
  .photo-full img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1);animation:kenBurns 9s ease-out forwards;filter:saturate(.94) contrast(1.05);}}
  .photo-full-veil{{position:absolute;inset:0;background:linear-gradient(180deg, rgba(44,37,32,.05) 0%, rgba(44,37,32,.6) 100%);}}
  .full-caption{{position:absolute;bottom:90px;left:0;right:0;text-align:center;z-index:5;}}
  .full-caption .line{{font-family:var(--display);font-style:italic;font-size:42px;color:var(--paper);}}
  .full-caption .line .word{{display:inline-block;opacity:0;}}

  /* cta */
  #scene-cta{{background:var(--paper2);}}
  #cta-logo-wrap{{width:320px;opacity:0;}}
  #cta-logo-wrap svg{{width:100%;display:block;color:var(--ink);}}
  #cta-headline{{font-family:var(--display);font-size:44px;font-weight:400;color:var(--ink);margin-top:10px;text-align:center;}}
  #cta-headline .acc{{color:var(--clay);font-style:italic;}}
  #cta-qr-wrap{{position:relative;opacity:0;margin-top:24px;background:#fff;border-radius:4px 20px 4px 4px;padding:18px;box-shadow:0 14px 36px rgba(44,37,32,.2);border:1px solid var(--line);}}
  #cta-qr-wrap img{{width:150px;height:150px;display:block;}}
  #cta-qr-label{{font-size:14px;font-weight:300;color:var(--ink-dim);margin-top:14px;opacity:0;letter-spacing:1px;text-transform:uppercase;}}
  #cta-url{{font-family:var(--display);font-style:italic;font-size:25px;color:var(--clay);opacity:0;margin-top:4px;}}
  .cta-ring{{position:absolute;border-radius:48% 52% 56% 44% / 50% 48% 52% 50%;border:1px solid rgba(44,37,32,.14);top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}}

  #stage-content{{position:absolute;inset:0;}}

  /* ink-bleed wipe: organic irregular blob expands */
  #wipe-ink{{position:absolute;left:50%;top:50%;width:3000px;height:3000px;margin-left:-1500px;margin-top:-1500px;background:var(--ink);transform:scale(0);border-radius:43% 57% 61% 39% / 49% 44% 56% 51%;z-index:40;pointer-events:none;}}
  /* torn-paper slide wipe */
  #wipe-tear{{position:absolute;inset:0;background:var(--ink);transform:translateX(-100%);z-index:40;pointer-events:none;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);}}
  /* brush-stroke diagonal wipe */
  #wipe-brush{{position:absolute;top:-30%;left:-70%;width:180%;height:160%;background:var(--ink);transform:rotate(-9deg) translateX(-100%);z-index:40;pointer-events:none;}}
  /* fiber bars wipe */
  #wipe-bars{{position:absolute;inset:0;display:flex;z-index:40;pointer-events:none;}}
  .wipe-bar{{flex:1;background:var(--ink);transform:scaleY(0);}}
  /* fold wipe (curtain-like, top down) */
  #wipe-fold{{position:absolute;inset:0;background:var(--ink);transform:translateY(-100%);z-index:40;pointer-events:none;}}
  /* clay-bloom wipe for finale */
  #wipe-clay{{position:absolute;left:50%;top:50%;width:3000px;height:3000px;margin-left:-1500px;margin-top:-1500px;background:radial-gradient(circle, var(--clay), var(--clay-deep));transform:scale(0);border-radius:50%;z-index:41;pointer-events:none;}}

  #dust{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:35;pointer-events:none;opacity:0;}}
  .dust-glow{{width:1300px;height:1300px;border-radius:50%;background:radial-gradient(circle, rgba(181,86,58,.5) 0%, rgba(181,86,58,.12) 35%, transparent 70%);}}

  #blackout{{position:absolute;inset:0;background:var(--ink);opacity:1;pointer-events:none;z-index:50;}}
</style>
</head>
<body>

<div id="viewport">
  <div id="canvas">
   <div id="stage-content">
    <div id="blobs">
      <div class="blob" id="blob1"></div>
      <div class="blob" id="blob2"></div>
      <div class="blob" id="blob3"></div>
    </div>
    <div id="paper-tex"></div>

    <!-- corner logo (appears after intro) -->
    <div id="corner-logo">{LOGO_SVG_CORNER}</div>
    <div id="corner-mark"></div>

    <!-- SCENE 1: intro -->
    <div class="scene" id="scene-intro">
      <div id="logo-wrap-intro">{LOGO_SVG_INTRO}</div>
      <div class="hairline" id="intro-hairline" style="width:0;"></div>
      <div id="tagline">Beauty in imperfection</div>
      <div id="sub-tagline">Lag ditt eget smykke i Tromsø</div>
    </div>

    <!-- SCENE 2: headline w/ asymmetric photo -->
    <div class="scene" id="scene-headline">
      <div id="headline-textwrap">
        <div id="headline-text"><span class="word">Lag</span> <span class="word">ditt</span> <span class="word accent">eget</span><br><span class="word accent">smykke</span></div>
        <div id="headline-sub">Med god veiledning fra en gullsmed, hele veien.</div>
      </div>
      <div class="photo-organic" id="headline-photo"><img src="data:image/jpeg;base64,{HERO1_B64}" alt=""></div>
    </div>

    <!-- SCENE 3: workshop types -->
    <div class="scene" id="scene-workshops">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Tre</span> <span class="word accent">workshops,</span> <span class="word">ett</span> <span class="word accent">verksted</span></div>
        <div class="divider" id="workshops-divider"></div>
      </div>
      <div id="workshop-grid">
        <div class="ws-card" id="ws1">
          <div class="ws-photo"><img src="data:image/jpeg;base64,{MINGLE_B64}" alt=""></div>
          <div class="ws-body">
            <div class="ws-num">01</div>
            <div class="ws-title">Mingle</div>
            <div class="ws-sub">Lag din egen sølvring fra start til slutt.</div>
          </div>
        </div>
        <div class="ws-card" id="ws2">
          <div class="ws-photo"><img src="data:image/jpeg;base64,{SANDSTOP_B64}" alt=""></div>
          <div class="ws-body">
            <div class="ws-num">02</div>
            <div class="ws-title">Sandstøp</div>
            <div class="ws-sub">Skap unike gullsmykker med klassisk sandstøp.</div>
          </div>
        </div>
        <div class="ws-card" id="ws3">
          <div class="ws-photo"><img src="data:image/jpeg;base64,{HERO1_B64}" alt=""></div>
          <div class="ws-body">
            <div class="ws-num">03</div>
            <div class="ws-title">Omsmelting</div>
            <div class="ws-sub">Gi gamle gullsmykker nytt liv og ny form.</div>
          </div>
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
          <line id="process-line-path" x1="170" y1="7" x2="850" y2="7" stroke="#B5563A" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <circle id="process-line-dot" cx="170" cy="7" r="5" fill="var(--clay)"/>
        </svg>
        <div class="proc-step" id="proc1"><div class="proc-num">1</div><div class="proc-title">Book en workshop</div><div class="proc-sub">Velg Mingle, Sandstøp eller omsmelting — alene eller med følge.</div></div>
        <div class="proc-step" id="proc2"><div class="proc-num">2</div><div class="proc-title">Skap med en gullsmed</div><div class="proc-sub">Du formgir, vi veileder deg gjennom hele prosessen.</div></div>
        <div class="proc-step" id="proc3"><div class="proc-num">3</div><div class="proc-title">Ta med ditt unike smykke</div><div class="proc-sub">Et smykke ingen andre har — laget med dine egne hender.</div></div>
      </div>
    </div>

    <!-- SCENE 5: benefits -->
    <div class="scene" id="scene-benefits">
      <div style="text-align:center;">
        <div class="heading"><span class="word">Hvorfor</span> <span class="word accent">Wabi</span> <span class="word accent">Sabi</span></div>
        <div class="divider" id="benefits-divider"></div>
      </div>
      <div id="benefits-list">
        <div class="benefit-row" id="ben1"><div class="benefit-check"></div><div class="benefit-text">Alt håndlaget i vårt eget verksted i Tromsø</div></div>
        <div class="benefit-row" id="ben2"><div class="benefit-check"></div><div class="benefit-text">Du finner aldri to smykker som er helt like</div></div>
        <div class="benefit-row" id="ben3"><div class="benefit-check"></div><div class="benefit-text">En opplevelse å dele med venner eller kjæresten</div></div>
        <div class="benefit-row" id="ben4"><div class="benefit-check"></div><div class="benefit-text">Skjønnheten ligger i det som ikke er perfekt</div></div>
      </div>
    </div>

    <!-- SCENE 6: location -->
    <div class="scene" id="scene-location">
      <div class="photo-organic" id="location-photo"><img src="data:image/jpeg;base64,{SANDSTOP_B64}" alt=""></div>
      <div id="location-card">
        <div id="location-name"><span class="word">Velkommen</span> <span class="word">til</span> <span class="word">Tromsø</span></div>
        <div id="location-addr">Skippergata 15, 9008 Tromsø</div>
        <div id="location-phone">46 67 88 72 · post@wabisabi.no</div>
      </div>
    </div>

    <!-- SCENE 4b: craft (animation-only photo) -->
    <div class="scene" id="scene-craft">
      <div class="photo-full"><img src="data:image/jpeg;base64,{CRAFT_B64}" alt=""></div>
      <div class="photo-full-veil"></div>
      <div class="full-caption">
        <div class="line" id="craft-caption"><span class="word">Verktøy</span> <span class="word">formet</span> <span class="word">av</span> <span class="word">år</span> <span class="word">med</span> <span class="word">håndverk</span></div>
      </div>
    </div>

    <!-- SCENE 5b: finished pieces (animation-only photo) -->
    <div class="scene" id="scene-finished">
      <div class="photo-full"><img src="data:image/jpeg;base64,{FINISHED_B64}" alt=""></div>
      <div class="photo-full-veil"></div>
      <div class="full-caption">
        <div class="line" id="finished-caption"><span class="word">Hvert</span> <span class="word">smykke,</span> <span class="word">en</span> <span class="word">historie</span></div>
      </div>
    </div>

    <!-- SCENE 7: CTA -->
    <div class="scene" id="scene-cta">
      <div class="cta-ring" id="ctaring1" style="width:540px;height:540px;"></div>
      <div class="cta-ring" id="ctaring2" style="width:660px;height:660px;"></div>
      <div class="cta-ring" id="ctaring3" style="width:780px;height:780px;"></div>
      <div id="cta-logo-wrap">{LOGO_SVG_CTA}</div>
      <div id="cta-headline"><span class="word">Bli</span> <span class="word">med</span> <span class="word accent">på</span> <span class="word accent">workshop</span></div>
      <div id="cta-qr-wrap"><img src="data:image/png;base64,{QR_B64}" alt="QR til wabisabi.no"></div>
      <div id="cta-qr-label">Skann for å booke plass</div>
      <div id="cta-url">wabisabi.no/lag-ditt-eget-smykke</div>
    </div>
   </div>

    <div id="wipe-ink"></div>
    <div id="wipe-tear"></div>
    <div id="wipe-brush"></div>
    <div id="wipe-bars">
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
      <div class="wipe-bar"></div><div class="wipe-bar"></div><div class="wipe-bar"></div>
    </div>
    <div id="wipe-fold"></div>
    <div id="wipe-clay"></div>
    <div id="dust"><div class="dust-glow"></div></div>
    <div id="blackout"></div>
  </div>
</div>

<script>
{GSAP_JS}
</script>
<script>
function fitCanvas() {{
  const vw = window.innerWidth, vh = window.innerHeight;
  const scale = Math.max(vw / 1920, vh / 1080);
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

/* ---------- master timeline — loops, distinct organic transition per cut ---------- */
const tl = gsap.timeline({{ repeat: -1, repeatDelay: 0.6 }});

function inkWipe(time) {{
  tl.to('#wipe-ink', {{ scale: 1, duration: 0.34, ease: 'power2.in' }}, time - 0.34);
  tl.to('#wipe-ink', {{ scale: 0, duration: 0.34, ease: 'power2.out' }}, time);
}}
function tearWipe(time) {{
  tl.set('#wipe-tear', {{ transform: 'translateX(-100%)' }}, time - 0.3);
  tl.to('#wipe-tear', {{ transform: 'translateX(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-tear', {{ transform: 'translateX(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function brushWipe(time) {{
  tl.set('#wipe-brush', {{ transform: 'rotate(-9deg) translateX(-100%)' }}, time - 0.3);
  tl.to('#wipe-brush', {{ transform: 'rotate(-9deg) translateX(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-brush', {{ transform: 'rotate(-9deg) translateX(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function barsWipe(time) {{
  const bars = '.wipe-bar';
  tl.to(bars, {{ scaleY: 1, duration: 0.22, stagger: 0.03, ease: 'power2.in' }}, time - 0.34);
  tl.to(bars, {{ scaleY: 0, duration: 0.22, stagger: 0.03, ease: 'power2.out' }}, time);
}}
function foldWipe(time) {{
  tl.set('#wipe-fold', {{ transform: 'translateY(-100%)' }}, time - 0.3);
  tl.to('#wipe-fold', {{ transform: 'translateY(0%)', duration: 0.26, ease: 'power2.in' }}, time - 0.26);
  tl.to('#wipe-fold', {{ transform: 'translateY(100%)', duration: 0.26, ease: 'power2.out' }}, time);
}}
function clayWipe(time) {{
  tl.to('#stage-content', {{ scale: 1.06, filter: 'blur(7px)', duration: 0.26, ease: 'power2.in' }}, time - 0.36);
  tl.to('#wipe-clay', {{ scale: 1, duration: 0.36, ease: 'power3.in' }}, time - 0.36);
  dust(time - 0.1, 0.5, 0.3);
  tl.to('#stage-content', {{ scale: 1, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }}, time);
  tl.to('#wipe-clay', {{ scale: 0, duration: 0.4, ease: 'power3.out' }}, time + 0.02);
}}
function dust(time, opacity = 0.4, dur = 0.4) {{
  tl.fromTo('#dust', {{ opacity: 0, scale: 0.6 }},
    {{ opacity, scale: 1, duration: dur * 0.4, ease: 'power2.out' }}, time);
  tl.to('#dust', {{ opacity: 0, scale: 1.35, duration: dur * 0.6, ease: 'power2.in' }}, time + dur * 0.4);
}}

// 0.0 — fade in from ink
tl.set('#blackout', {{ opacity: 1 }});
tl.to('#blackout', {{ opacity: 0, duration: 0.5, ease: 'power1.in' }}, 0.0);
tl.set('#scene-intro', {{ opacity: 1 }}, 0.0);

// 0.2 — 3.4 logo + taglines
tl.fromTo('#logo-wrap-intro', {{ opacity: 0, y: 16, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }}, 0.25);
tl.to('#intro-hairline', {{ width: '220px', duration: 0.5, ease: 'power2.out' }}, 1.05);
tl.fromTo('#tagline', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }}, 1.25);
tl.fromTo('#sub-tagline', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }}, 1.65);

tl.to('#scene-intro', {{ opacity: 0, duration: 0.45 }}, 4.1);

// 4.5  INK WIPE into headline
inkWipe(4.5);
tl.set('#scene-headline', {{ opacity: 1 }}, 4.52);
tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 4.6);
tl.to('#corner-mark', {{ opacity: 1, duration: 0.4, ease: 'power2.out' }}, 4.6);

tl.fromTo('#headline-text .word', {{ opacity: 0, y: 30, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.1, ease: 'power3.out' }}, 4.7);
tl.fromTo('#headline-sub', {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }}, 5.7);

tl.to('#scene-headline', {{ opacity: 0, duration: 0.45 }}, 8.6);

// 9.0  TEAR WIPE into workshops
tearWipe(9.0);
tl.set('#scene-workshops', {{ opacity: 1 }}, 9.02);

tl.to('#scene-workshops .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 9.15);
tl.to('#workshops-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 9.35);

dust(9.75, 0.2);
['ws1', 'ws2', 'ws3'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, y: 36, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }}, 9.75 + i * 0.2);
  tl.to('#' + id, {{ y: -8, duration: 1.1, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 9.75 + i * 0.2 + 0.6);
}});

tl.to('#scene-workshops', {{ opacity: 0, duration: 0.45 }}, 16.4);

// 16.8  BRUSH WIPE into craft (animation-only photo)
brushWipe(16.8);
tl.set('#scene-craft', {{ opacity: 1 }}, 16.82);
tl.fromTo('#craft-caption .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out' }}, 17.1);

tl.to('#scene-craft', {{ opacity: 0, duration: 0.45 }}, 20.8);

// 21.2  FOLD WIPE into process
foldWipe(21.2);
tl.set('#scene-process', {{ opacity: 1 }}, 21.22);

tl.to('#scene-process .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 21.35);

dust(21.65, 0.16);
tl.fromTo('#proc1', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 21.65);
tl.to('#proc1 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 4, yoyo: true, ease: 'sine.inOut' }}, 22.15);

tl.to(procLine, {{ strokeDashoffset: procLineLen / 2, duration: 0.55, ease: 'power2.inOut' }}, 22.15);
tl.to('#process-line-dot', {{ attr: {{ cx: 510 }}, duration: 0.55, ease: 'power2.inOut' }}, 22.15);
dust(22.7, 0.14);
tl.fromTo('#proc2', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 22.7);
tl.to('#proc2 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 23.2);

tl.to(procLine, {{ strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }}, 23.2);
tl.to('#process-line-dot', {{ attr: {{ cx: 850 }}, duration: 0.55, ease: 'power2.inOut' }}, 23.2);
dust(23.75, 0.14);
tl.fromTo('#proc3', {{ opacity: 0, y: 26, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }}, 23.75);
tl.to('#proc3 .proc-num', {{ y: -6, scale: 1.06, duration: 0.8, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 24.25);

tl.to('#scene-process', {{ opacity: 0, duration: 0.45 }}, 27.2);

// 27.6  TEAR WIPE into benefits
tearWipe(27.6);
tl.set('#scene-benefits', {{ opacity: 1 }}, 27.62);

tl.to('#scene-benefits .heading .word', {{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.07, ease: 'back.out(1.8)' }}, 27.75);
tl.to('#benefits-divider', {{ width: '420px', duration: 0.5, ease: 'power2.out' }}, 27.95);

dust(28.35, 0.2);
['ben1', 'ben2', 'ben3', 'ben4'].forEach((id, i) => {{
  tl.fromTo('#' + id, {{ opacity: 0, x: -34, filter: 'blur(6px)' }}, {{ opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }}, 28.35 + i * 0.22);
  tl.to('#' + id + ' .benefit-check', {{ scale: 1.5, duration: 0.9, repeat: 2, yoyo: true, ease: 'sine.inOut' }}, 28.35 + i * 0.22 + 0.5);
}});

tl.to('#scene-benefits', {{ opacity: 0, duration: 0.45 }}, 33.8);

// 34.2  INK WIPE into finished pieces (animation-only photo)
inkWipe(34.2);
tl.set('#scene-finished', {{ opacity: 1 }}, 34.22);
tl.fromTo('#finished-caption .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out' }}, 34.5);

tl.to('#scene-finished', {{ opacity: 0, duration: 0.45 }}, 38.2);

// 38.6  BARS WIPE into location
barsWipe(38.6);
tl.set('#scene-location', {{ opacity: 1 }}, 38.62);

tl.to('#corner-logo', {{ opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }}, 38.62);
tl.to('#corner-mark', {{ opacity: 1, duration: 0.4, ease: 'power2.out' }}, 38.62);
tl.to('#location-card', {{ opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }}, 38.75);
tl.fromTo('#location-name .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.06, ease: 'power3.out' }}, 38.85);

tl.to('#scene-location', {{ opacity: 0, duration: 0.45 }}, 41.8);
tl.to('#corner-logo', {{ opacity: 0, duration: 0.3 }}, 41.8);
tl.to('#corner-mark', {{ opacity: 0, duration: 0.3 }}, 41.8);

// 42.2  CLAY WIPE into CTA
clayWipe(42.2);
tl.set('#scene-cta', {{ opacity: 1 }}, 42.21);

tl.fromTo('#cta-logo-wrap', {{ scale: 0.75, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }}, 42.35);
['ctaring1', 'ctaring2', 'ctaring3'].forEach((id, i) => {{
  gsap.set('#' + id, {{ opacity: 0 }});
  tl.to('#' + id, {{ opacity: 1, duration: 0.35 }}, 42.35);
  tl.to('#' + id, {{ scale: 1.03, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }}, 42.48 + i * 0.07);
}});
tl.fromTo('#cta-headline .word', {{ opacity: 0, y: 28, filter: 'blur(8px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.08, ease: 'power3.out' }}, 43.0);
dust(43.45, 0.22);
gsap.set('#cta-qr-wrap', {{ scale: 0.7, rotation: -6 }});
tl.to('#cta-qr-wrap', {{ opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }}, 43.45);
tl.to('#cta-qr-label', {{ opacity: 1, duration: 0.4 }}, 44.0);
tl.to('#cta-url', {{ opacity: 1, y: -4, duration: 0.45 }}, 44.15);

// 48.2 — fade out, loop
tl.to('#scene-cta', {{ opacity: 0, duration: 0.45 }}, 48.2);
tl.to('#blackout', {{ opacity: 1, duration: 0.9, ease: 'power2.in' }}, 48.35);

// reset for next loop
tl.call(() => {{
  gsap.set('#logo-wrap-intro', {{ opacity: 0, y: 16, scale: 0.92 }});
  gsap.set('#intro-hairline', {{ width: '0px' }});
  gsap.set('#tagline', {{ opacity: 0 }});
  gsap.set('#sub-tagline', {{ opacity: 0 }});
  gsap.set('#corner-logo', {{ opacity: 0 }});
  gsap.set('#corner-mark', {{ opacity: 0 }});
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
  gsap.set('#craft-caption .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }});
  gsap.set('#finished-caption .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }});
  gsap.set('#location-name .word', {{ opacity: 0, y: 20, filter: 'blur(6px)' }});
  gsap.set('#location-card', {{ opacity: 0, y: 20 }});
  gsap.set(['#ctaring1', '#ctaring2', '#ctaring3'], {{ opacity: 0 }});
  gsap.set('#cta-logo-wrap', {{ opacity: 0, scale: 0.75 }});
  gsap.set('#cta-headline .word', {{ opacity: 0 }});
  gsap.set('#cta-qr-wrap', {{ opacity: 0, scale: 0.7, rotation: -6 }});
  gsap.set('#cta-qr-label', {{ opacity: 0 }});
  gsap.set('#cta-url', {{ opacity: 0 }});
}}, [], 49.2);

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
