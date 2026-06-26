/* ────────────────────────────────────────────────────────────
   SCENE-BIBLIOTEK — Norleads/Taxi4Moss-stil
   Hver scene har:
     id, label, defaults (redigerbare felter),
     render(cfg, brand)  → returnerer HTML-string
     animate(tl, root, cfg, brand, t0) → legger inn GSAP-tweens
   ──────────────────────────────────────────────────────────── */

window.SCENES = {

  /* ── 1. LOGO INTRO ─────────────────────────────────────── */
  'logo-intro': {
    label: 'Logo intro',
    duration: 3.4,
    defaults: { tagline: 'Rimelig på pris. Best på kundeservice.' },
    render: (c, b) => `
      <div class="center hero-mark">
        <div class="logo-wordmark" style="color:${b.brand}">${b.name}</div>
        <div class="rule" style="background:${b.brand}"></div>
        <div class="tag">${c.tagline}</div>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.fromTo(r.querySelector('.logo-wordmark'),
        { y: 40, opacity: 0, scale: .85, filter: 'blur(8px)' },
        { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' }, t0 + .2);
      tl.fromTo(r.querySelector('.rule'),
        { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'power3.out', transformOrigin: 'left' }, t0 + .9);
      tl.fromTo(r.querySelector('.tag'),
        { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power2.out' }, t0 + 1.15);
    }
  },

  /* ── 2. HOOK ──────────────────────────────────────────── */
  'hook': {
    label: 'Hook / hovedutsagn',
    duration: 3.6,
    defaults: { eyebrow: 'Et spørsmål', line1: 'Hvor mye taper du', line2: 'hver dag?' },
    render: (c, b) => `
      <div class="center">
        <div class="eyebrow" style="color:${b.brand}">${c.eyebrow}</div>
        <h1 class="hook-head">
          <span class="reveal"><span>${c.line1}</span></span><br>
          <span class="reveal"><span class="red-word" style="color:${b.brand}">${c.line2}</span></span>
        </h1>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.eyebrow'), { y: '110%', opacity: 0, duration: .8, ease: 'power2.out' }, t0 + .2);
      tl.from(r.querySelectorAll('.reveal > span'),
        { y: '110%', opacity: 0, duration: 1.0, stagger: .4, ease: 'power3.out' }, t0 + .5);
    }
  },

  /* ── 3. FEATURE GRID (4 kort) ─────────────────────────── */
  'feature-grid': {
    label: '4-kort: priser / features',
    duration: 5.8,
    defaults: {
      eyebrow: 'Forutsigbart',
      head1: 'Du vet alltid',
      head2: 'prisen.',
      items: [
        { big: '06–17', small: 'Dag' },
        { big: '17–21', small: 'Kveld' },
        { big: '21–06', small: 'Natt' },
        { big: '12–00', small: 'Helg' }
      ]
    },
    render: (c, b) => `
      <div class="center">
        <div class="eyebrow" style="color:${b.brand}">${c.eyebrow}</div>
        <h2 class="grid-head">
          <span class="reveal"><span>${c.head1}</span></span><br>
          <span class="reveal"><span class="red-word" style="color:${b.brand}">${c.head2}</span></span>
        </h2>
        <div class="price-grid">
          ${c.items.map(it => `
            <div class="price-card">
              <div class="iconwrap" style="background:${b.cream||'#FFF6DE'}"></div>
              <b>${it.big}</b><span>${it.small}</span>
            </div>`).join('')}
        </div>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.eyebrow'), { y: '110%', opacity: 0, duration: .8 }, t0 + .2);
      tl.from(r.querySelectorAll('.reveal > span'),
        { y: '110%', opacity: 0, duration: .9, stagger: .35, ease: 'power3.out' }, t0 + .4);
      tl.from(r.querySelectorAll('.price-card'),
        { rotationY: -75, opacity: 0, y: 30, z: -100, duration: .7, stagger: .14, ease: 'back.out(1.4)',
          transformOrigin: 'center center -40px' }, t0 + 1.6);

      // Sequential red sweep — signature Taxi4Moss-greia
      const cards = r.querySelectorAll('.price-card');
      cards.forEach((card, i) => {
        const on  = t0 + 2.7 + i * 0.28;
        const off = t0 + 4.2 + i * 0.16;
        tl.to(card, { backgroundColor: b.brand, borderColor: b.brand,
          boxShadow: `0 18px 46px ${hexA(b.brand, .4)}`, duration: .3 }, on);
        tl.to(card.querySelector('b'),    { color: '#fff', duration: .3 }, on);
        tl.to(card.querySelector('span'), { color: 'rgba(255,255,255,.85)', duration: .3 }, on);
        tl.to(card, { backgroundColor: '#FAFAF7', borderColor: 'rgba(14,14,16,.10)',
          boxShadow: '0 10px 28px rgba(14,14,16,.04)', duration: .4 }, off);
        tl.to(card.querySelector('b'),    { color: '#0E0E10', duration: .4 }, off);
        tl.to(card.querySelector('span'), { color: 'rgba(14,14,16,.42)', duration: .4 }, off);
      });
    }
  },

  /* ── 4. BIG NUMBER (24/7-stil) ────────────────────────── */
  'big-number': {
    label: 'Stort tall / statement',
    duration: 4.0,
    defaults: { eyebrow: 'Vi er åpne', numA: '24', sep: '/', numB: '7', sub: 'Døgnåpent. Hver dag i året.' },
    render: (c, b) => `
      <div class="center">
        <div class="eyebrow" style="color:${b.brand}">${c.eyebrow}</div>
        <div class="big-num" style="color:${b.brand}">
          <span class="bn-a">${c.numA}</span><em>${c.sep}</em><span class="bn-b">${c.numB}</span>
        </div>
        <h3 class="big-sub">${c.sub}</h3>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.eyebrow'), { y: '110%', opacity: 0, duration: .8 }, t0 + .2);
      tl.fromTo(r.querySelector('.bn-a'),
        { x: -350, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: .75, ease: 'power3.out' }, t0 + .5);
      tl.fromTo(r.querySelector('.big-num em'),
        { y: -220, rotation: -90, opacity: 0 },
        { y: 0, rotation: 0, opacity: 1, duration: .6, ease: 'back.out(2)' }, t0 + .75);
      tl.fromTo(r.querySelector('.bn-b'),
        { x: 350, opacity: 0, filter: 'blur(10px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: .75, ease: 'power3.out' }, t0 + .9);
      tl.to(r.querySelector('.big-num'), { scale: 1.06, duration: .2 }, t0 + 1.7);
      tl.to(r.querySelector('.big-num'), { scale: 1, duration: .36 }, t0 + 1.9);
      tl.from(r.querySelector('.big-sub'), { y: 18, opacity: 0, duration: .7 }, t0 + 2.0);
    }
  },

  /* ── 5. TRUST BADGES (3 kort) ─────────────────────────── */
  'trust': {
    label: '3-kort: trust / bevis',
    duration: 5.2,
    defaults: {
      eyebrow: 'Trygt valg',
      head1: 'På din side,',
      head2: 'hele veien.',
      items: [
        { big: '15+', small: 'År erfaring', p: 'Lokalkjent siden 2009.' },
        { big: 'ISO', small: '9001 · Kvalitet', p: 'Sertifisert kvalitet.' },
        { big: '5★',  small: 'Kundetilfredshet', p: 'Hver tur, hver gang.' }
      ]
    },
    render: (c, b) => `
      <div class="center">
        <div class="eyebrow" style="color:${b.brand}">${c.eyebrow}</div>
        <h2 class="grid-head">
          <span class="reveal"><span>${c.head1}</span></span><br>
          <span class="reveal"><span class="red-word" style="color:${b.brand}">${c.head2}</span></span>
        </h2>
        <div class="trust-row">
          ${c.items.map(it => `
            <div class="trust-card">
              <b style="color:${b.brand}">${it.big}</b>
              <span>${it.small}</span>
              <p>${it.p}</p>
            </div>`).join('')}
        </div>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.eyebrow'), { y: '110%', opacity: 0, duration: .8 }, t0 + .2);
      tl.from(r.querySelectorAll('.reveal > span'),
        { y: '110%', opacity: 0, duration: .9, stagger: .35, ease: 'power3.out' }, t0 + .4);
      tl.from(r.querySelectorAll('.trust-card'),
        { rotationX: 60, y: 60, opacity: 0, z: -200, duration: .8, stagger: .18,
          ease: 'back.out(1.5)', transformOrigin: 'center bottom' }, t0 + 1.6);
      tl.from(r.querySelectorAll('.trust-card b'),
        { scale: 0, opacity: 0, duration: .45, stagger: .18, ease: 'back.out(2.2)' }, t0 + 2.0);
    }
  },

  /* ── 6. TEXT SWAP (Norleads "scrollet forbi" → "stoppet") ── */
  'text-swap': {
    label: 'Tekst-swap (før/etter)',
    duration: 4.6,
    defaults: { line1: 'Din annonse blir', before: 'scrollet forbi.', after: 'stoppet. sett.' },
    render: (c, b) => `
      <div class="center">
        <h1 class="swap-head">
          <span class="swap-line1">${c.line1}</span><br>
          <span class="swap-zone">
            <span class="sw sw-1">${c.before}</span>
            <span class="sw sw-2"><span class="paint-bg" style="background:${b.ink||'#0E0E10'}"></span><span class="paint-txt" style="color:${b.brand}">${c.after}</span></span>
          </span>
        </h1>
      </div>`,
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.swap-line1'), { y: 30, opacity: 0, duration: .8 }, t0 + .2);
      tl.from(r.querySelector('.sw-1'), { y: 30, opacity: 0, duration: .8 }, t0 + .6);
      tl.to(r.querySelector('.sw-1'), { y: '-130%', opacity: 0, filter: 'blur(6px)', duration: .5, ease: 'power3.in' }, t0 + 2.2);
      tl.set(r.querySelector('.sw-2'), { opacity: 1 }, t0 + 2.6);
      tl.fromTo(r.querySelector('.paint-bg'),
        { scaleX: 0 }, { scaleX: 1, duration: .55, ease: 'power4.inOut', transformOrigin: 'left' }, t0 + 2.6);
      tl.from(r.querySelector('.paint-txt'), { y: 30, opacity: 0, duration: .65 }, t0 + 2.85);
    }
  },

  /* ── 7. CTA — telefon/URL ─────────────────────────────── */
  'cta': {
    label: 'CTA (telefon + URL)',
    duration: 6.0,
    defaults: { eyebrow: 'Ring oss · Døgnåpent', sub: 'Eller bestill på nettsiden' },
    render: (c, b) => {
      const digits = (b.phone || '00000').split('').map(d => `<span class="d">${d}</span>`).join('');
      return `
      <div class="center cta-stack">
        <div class="logo-wordmark cta-logo" style="color:${b.brand}">${b.name}</div>
        <div class="eyebrow" style="color:${b.brand}">${c.eyebrow}</div>
        <div class="cta-phone" style="color:${b.brand}">${digits}</div>
        <div class="cta-sub">${c.sub}</div>
        <div class="cta-url" style="background:${b.brand}">${b.url}</div>
      </div>`;
    },
    animate: (tl, r, c, b, t0) => {
      tl.from(r.querySelector('.cta-logo'),  { y: 30, scale: .85, opacity: 0, duration: .9, ease: 'back.out(1.6)' }, t0 + .2);
      tl.from(r.querySelector('.eyebrow'),   { y: 14, opacity: 0, duration: .6 }, t0 + .9);
      tl.from(r.querySelectorAll('.cta-phone .d'),
        { y: -90, opacity: 0, scale: .4, duration: .55, stagger: .14, ease: 'back.out(2.2)' }, t0 + 1.2);
      tl.to(r.querySelector('.cta-phone'), { scale: 1.05, duration: .22 }, t0 + 2.4);
      tl.to(r.querySelector('.cta-phone'), { scale: 1, duration: .4 }, t0 + 2.62);
      tl.from(r.querySelector('.cta-sub'), { y: 14, opacity: 0, duration: .6 }, t0 + 3.0);
      tl.from(r.querySelector('.cta-url'), { y: 20, scale: .9, opacity: 0, duration: .6, ease: 'back.out(1.7)' }, t0 + 3.3);
      tl.to(r.querySelector('.cta-phone'), { scale: 1.02, duration: .6, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t0 + 4.2);
    }
  }
};

/* utility: legg alpha på hex */
function hexA(hex, a) {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16),
        g = parseInt(h.substring(2,4),16),
        b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}
window.hexA = hexA;

/* default scene-rekkefølge for en ny reklame */
window.DEFAULT_SCENE_FLOW = [
  'logo-intro', 'hook', 'feature-grid', 'big-number', 'trust', 'cta'
];
