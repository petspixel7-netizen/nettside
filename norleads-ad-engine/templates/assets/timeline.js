/* timeline.js — builds ONE continuous GSAP timeline from window.SCENE_PLAN.
 *
 * Principles (enforce skills/gsap-animation-rules.md):
 *  - One master timeline, scenes overlap with shared-element transitions.
 *  - No hard slides. Crossfade + scale continuity = continuous camera feel.
 *  - Ken-burns on every image so nothing is ever static.
 *  - Headlines reveal line-by-line via clip masks (kinetic typography).
 *  - window.timeline exposed for debugging; ?seek=<t>&still=1 freezes a frame.
 *
 * Requires GSAP (loaded from CDN in base.html.j2).
 */
(function () {
  const PLAN = window.SCENE_PLAN;
  const VISUAL = window.VISUAL || {};
  const params = new URLSearchParams(location.search);
  const STILL = params.get("still") === "1";
  const SEEK = parseFloat(params.get("seek") || "0");

  // ---- responsive scaling: fit fixed canvas into viewport, keep aspect ----
  const stage = document.getElementById("stage");
  const cw = PLAN._canvas_w || parseInt(getComputedStyle(stage).getPropertyValue("--cw")) || 1080;
  const ch = PLAN._canvas_h || parseInt(getComputedStyle(stage).getPropertyValue("--ch")) || 1920;
  function fit() {
    const s = Math.min(window.innerWidth / cw, window.innerHeight / ch);
    stage.style.transform = `scale(${s})`;
  }
  window.addEventListener("resize", fit);
  fit();

  // ---- apply palette ----
  const c = PLAN.palette || {};
  const root = document.documentElement.style;
  if (c.ink) root.setProperty("--ink", c.ink);
  if (c.paper) root.setProperty("--paper", c.paper);
  if (c.primary) root.setProperty("--primary", c.primary);
  if (c.accent) root.setProperty("--accent", c.accent);

  const sceneEls = Array.from(document.querySelectorAll(".scene"));

  // Split each headline into clip-masked lines for kinetic reveal.
  sceneEls.forEach((el) => {
    const h = el.querySelector(".headline");
    if (!h) return;
    const words = h.textContent.trim();
    h.innerHTML = `<span class="line"><span>${words}</span></span>`;
  });

  if (STILL) {
    buildAndSeek();
  } else {
    // Preload images, then play.
    const imgs = Array.from(document.images);
    let left = imgs.length;
    if (!left) start();
    imgs.forEach((im) => {
      if (im.complete) tick();
      else { im.onload = tick; im.onerror = tick; }
    });
    function tick() { if (--left <= 0) start(); }
  }

  function start() {
    const tl = build();
    window.timeline = tl;
    tl.play(0);
  }

  function buildAndSeek() {
    const tl = build();
    window.timeline = tl;
    tl.pause();
    tl.seek(SEEK);
    document.body.classList.add("still");
  }

  function build() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
    const OVERLAP = 0.5; // seconds of shared-element crossfade between scenes

    PLAN.scenes.forEach((sc, i) => {
      const el = sceneEls[i];
      const at = Math.max(0, sc.start - (i ? OVERLAP : 0));
      const dur = sc.seconds + (i ? OVERLAP : 0);
      const img = el.querySelector(".scene__img");
      const kicker = el.querySelector(".kicker");
      const lineInner = el.querySelector(".headline .line > span");
      const sub = el.querySelector(".sub");
      const logo = el.querySelector(".logo");

      // Scene container crossfade (continuous, not a hard cut).
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6 }, at);
      if (i < PLAN.scenes.length - 1) {
        tl.to(el, { opacity: 0, duration: 0.6 }, sc.end - 0.1);
      }

      // Ken-burns: continuous slow scale, never resets to static.
      if (img) {
        const from = 1.04 + (i % 2) * 0.04;
        const to = from + 0.10;
        tl.fromTo(img, { scale: from, xPercent: i % 2 ? -2 : 2 },
          { scale: to, xPercent: 0, duration: dur + 0.8, ease: "none" }, at);
      }

      // Kinetic type: clip-reveal line up, kicker fade-rise, sub fade.
      if (kicker && kicker.textContent.trim())
        tl.fromTo(kicker, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, at + 0.25);
      if (lineInner)
        tl.fromTo(lineInner, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, at + 0.35);
      if (sub && sub.textContent.trim())
        tl.fromTo(sub, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, at + 0.6);

      // Logo reveal on hook + cta.
      if (logo)
        tl.fromTo(logo, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, at + 0.2);
    });

    // Final hold so last frame lingers.
    tl.to({}, { duration: 0.4 });
    return tl;
  }

  // expose duration verifier
  window.verifyDuration = function () {
    return { planned: PLAN.duration, timeline: window.timeline && window.timeline.duration() };
  };
})();
