/* ── PLAYER ENGINE ───────────────────────────────────────────
   Leser config fra localStorage 'studio:config' (eller URL #hash)
   Bygger en GSAP-master-timeline med alle scenene i sekvens.
   Looper automatisk — perfekt for screen recording.
   ──────────────────────────────────────────────────────────── */

function loadConfig() {
  // 1) URL hash overstyrer (deling)
  if (location.hash.startsWith('#cfg=')) {
    try { return JSON.parse(decodeURIComponent(atob(location.hash.slice(5)))); }
    catch(e) { console.warn('hash decode failed', e); }
  }
  // 2) localStorage
  try {
    const raw = localStorage.getItem('studio:config');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  // 3) fallback demo
  return {
    brand: { name: 'EksempelAS', url: 'eksempel.no', phone: '12345', brand: '#E5263A' },
    scenes: window.DEFAULT_SCENE_FLOW.map(id => ({ id, cfg: {} }))
  };
}

function build(config) {
  const film = document.getElementById('film');
  // chrome
  film.querySelector('.brand-chip').textContent = config.brand.name;
  film.querySelector('.brand-chip').style.color = config.brand.brand;
  film.querySelector('.meta-chip').textContent = config.brand.url;
  film.querySelector('.meta-chip').style.color = config.brand.brand;
  film.querySelector('.progress i').style.background = config.brand.brand;

  // total duration
  let total = 0;
  const sceneNodes = [];

  config.scenes.forEach((s, i) => {
    const def = window.SCENES[s.id];
    if (!def) return;
    const cfg = Object.assign({}, def.defaults, s.cfg || {});
    const sec = document.createElement('section');
    sec.className = `scene scene-${s.id}`;
    sec.dataset.duration = def.duration;
    sec.innerHTML = def.render(cfg, config.brand);
    film.appendChild(sec);
    sceneNodes.push({ el: sec, def, cfg, start: total });
    total += def.duration;
  });

  // GSAP master timeline
  gsap.defaults({ ease: 'power2.out' });
  gsap.set('.scene', { opacity: 0 });

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

  tl.fromTo('.progress i', { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'none' }, 0);

  sceneNodes.forEach((sn, i) => {
    const t0 = sn.start;
    const fadeIn = 0.5;
    const fadeOut = 0.45;
    tl.set(sn.el, { visibility: 'visible' }, t0);
    tl.fromTo(sn.el, { opacity: 0 }, { opacity: 1, duration: fadeIn }, t0);

    // scene-specific animation
    sn.def.animate(tl, sn.el, sn.cfg, config.brand, t0);

    // fade out
    const tEnd = t0 + sn.def.duration - fadeOut;
    tl.to(sn.el, { opacity: 0, duration: fadeOut, ease: 'power2.in' }, tEnd);
    tl.set(sn.el, { visibility: 'hidden' }, t0 + sn.def.duration);
  });

  // reset progress on loop
  tl.set('.progress i', { scaleX: 0 }, total);
  return total;
}

/* ── INNEBYGD OPPTAKER ───────────────────────────────────
   Bruker getDisplayMedia + MediaRecorder.
   Brukeren velger fanen/vinduet, vi tar opp én full loop og laster ned.
   ──────────────────────────────────────────────────────── */
let TOTAL_DURATION = 0;

async function startRecording() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    alert('Nettleseren støtter ikke skjermopptak. Bruk Chrome/Edge/Firefox.');
    return;
  }
  const bar = document.getElementById('recbar');
  const msg = document.getElementById('rec-msg');
  const startBtn = document.getElementById('rec-start');
  try {
    msg.textContent = 'Velg denne fanen i dialogen…';
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 60 },
      audio: false,
      preferCurrentTab: true
    });
    bar.classList.add('recording');
    startBtn.textContent = '■ Stopp';
    startBtn.onclick = () => stream.getTracks().forEach(t => t.stop());

    const mimeCandidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const mime = mimeCandidates.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

    const done = new Promise(resolve => { rec.onstop = resolve; });
    stream.getVideoTracks()[0].onended = () => { if (rec.state !== 'inactive') rec.stop(); };

    rec.start(100);
    msg.textContent = `Tar opp ${TOTAL_DURATION.toFixed(1)}s + 0.4s buffer…`;

    // Auto-stopp etter én full loop + litt buffer
    const ms = (TOTAL_DURATION + 0.4) * 1000;
    setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); stream.getTracks().forEach(t => t.stop()); }, ms);

    await done;
    const blob = new Blob(chunks, { type: mime });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (loadConfig().brand?.name || 'reklame').replace(/\W+/g, '-').toLowerCase();
    a.download = `${name}-${Date.now()}.webm`;
    a.click();

    bar.classList.remove('recording');
    startBtn.textContent = '● Ta opp & last ned';
    msg.textContent = 'Ferdig — sjekk Last ned.';
    startBtn.onclick = startRecording;
  } catch (e) {
    bar.classList.remove('recording');
    startBtn.textContent = '● Ta opp & last ned';
    msg.textContent = 'Avbrutt eller feilet.';
    startBtn.onclick = startRecording;
    console.error(e);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const cfg = loadConfig();
  document.documentElement.style.setProperty('--brand', cfg.brand.brand);
  TOTAL_DURATION = build(cfg);

  // hook opp REC-bar
  const bar = document.getElementById('recbar');
  document.getElementById('rec-start').onclick = startRecording;
  document.getElementById('rec-hide').onclick = () => bar.classList.add('hide');

  // skjul REC-bar når musen er stille (rene shoots)
  let hideT;
  document.addEventListener('mousemove', () => {
    bar.classList.remove('hide');
    clearTimeout(hideT);
    hideT = setTimeout(() => { if (!bar.classList.contains('recording')) bar.classList.add('hide'); }, 2500);
  });
});
