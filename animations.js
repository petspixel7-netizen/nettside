/* DentalEstetic 70s — animations */
(function () {
  window.__timelines = window.__timelines || {};
  var tl = gsap.timeline({ paused: true });

  // ============================================================
  // Scene windows (70s total)
  //   s1 0-6.5     s2 6.5-13    s3 13-20    s4 20-27    s5 27-33.5
  //   s6 33.5-40.5 s7 40.5-47.5 s8 47.5-53  s9 53-60    s10 60-70
  // Anchors: s6, s7, s8, s9 — 3 shader transitions
  // ============================================================

  // non-anchor visibility
  tl.set("#s1",  { autoAlpha: 0 }, 6.5);
  tl.set("#s2",  { autoAlpha: 1 }, 6.5);
  tl.set("#s2",  { autoAlpha: 0 }, 13);
  tl.set("#s3",  { autoAlpha: 1 }, 13);
  tl.set("#s3",  { autoAlpha: 0 }, 20);
  tl.set("#s4",  { autoAlpha: 1 }, 20);
  tl.set("#s4",  { autoAlpha: 0 }, 27);
  tl.set("#s5",  { autoAlpha: 1 }, 27);
  tl.set("#s5",  { autoAlpha: 0 }, 33.5);
  tl.set("#s6",  { opacity: 1 }, 33.5);
  tl.set("#s10", { autoAlpha: 1 }, 60);

  function softEnter(sel, start) {
    tl.from(sel, { filter: "blur(8px)", autoAlpha: 0, duration: 0.5, ease: "power2.out" }, start);
  }

  // ============================================================
  // S1 HERO (0-6.5s) — cinematic title card
  // ============================================================
  tl.from("#s1-photo", { scale: 1.18, x: -24, duration: 6.5, ease: "none" }, 0);
  tl.to(  "#s1-photo", { x: 18,              duration: 6.5, ease: "none" }, 0);
  tl.fromTo("#s1-streak", { left: -350, autoAlpha: 0 }, { left: 2050, autoAlpha: 1, duration: 5.6, ease: "power1.inOut" }, 0.5);
  tl.from("#s1-bloom",       { autoAlpha: 0, scaleY: 0.5, duration: 1.8, ease: "power2.out" }, 0.3);
  tl.from("#s1-bloom-inner", { autoAlpha: 0, scale: 0.5,  duration: 1.4, ease: "power2.out" }, 0.6);
  tl.fromTo("#s1-flash", { opacity: 0.95 }, { opacity: 0, duration: 0.55, ease: "expo.out" }, 0);
  tl.fromTo("#s1-flare",   { autoAlpha: 0, scale: 0.55 }, { autoAlpha: 0.85, scale: 1.0, duration: 1.5, ease: "power2.out" }, 0.2);
  tl.fromTo("#s1-flare-2", { autoAlpha: 0, scale: 0.55 }, { autoAlpha: 0.7,  scale: 1.0, duration: 1.6, ease: "power2.out" }, 0.5);
  tl.to("#s1-flare",   { x: -120, y: 80, duration: 6.0, ease: "sine.inOut" }, 0.5);
  tl.to("#s1-flare-2", { x: 110, y: -80, duration: 6.0, ease: "sine.inOut" }, 0.8);
  tl.from("#s1-dot", { scale: 0, duration: 0.5, ease: "back.out(1.8)" }, 0.5);
  tl.from("#s1-eyebrow-text", { y: -10, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.6);
  tl.from("#s1-logo-img", { autoAlpha: 0, scale: 0.85, y: 30, duration: 1.2, ease: "power3.out" }, 1.1);
  tl.to(  "#s1-logo-img", { y: -8, duration: 4.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.6);
  tl.to("#s1-rule", { width: 440, duration: 1.1, ease: "expo.out" }, 2.2);
  tl.from("#s1-sub", { y: 18, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 2.5);
  tl.to("#s1-dot", { opacity: 0.4, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 3 }, 2.0);
  // ambient extended into hold time
  tl.to("#s1-bloom",       { opacity: 0.55, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.8);
  tl.to("#s1-bloom-inner", { opacity: 0.55, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3.0);
  tl.to("#s1-flare",   { scale: 1.12, opacity: 0.6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3.2);

  // ============================================================
  // S2 TAGLINE (6.5-13s)
  // ============================================================
  tl.fromTo("#s2-flash", { opacity: 0.85 }, { opacity: 0, duration: 0.4, ease: "expo.out" }, 6.5);
  softEnter("#s2 .sc", 6.5);
  tl.from("#s2-eyebrow-text", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 6.85);
  tl.from("#s2-title .char", {
    y: 120, autoAlpha: 0, duration: 0.75, ease: "power4.out",
    stagger: { each: 0.04, from: "start" },
  }, 7.0);
  tl.from("#s2-sub", { y: 30, autoAlpha: 0, duration: 0.75, ease: "power2.out" }, 8.8);
  tl.to("#s2-rule", { width: 360, duration: 1.0, ease: "expo.out" }, 9.3);
  tl.to("#s2-rule-end", { autoAlpha: 0.95, duration: 0.5, ease: "power2.out" }, 9.9);
  // long breathing through extra hold time
  tl.to("#s2-title", { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 8.5);
  tl.to("#s2-glow-a", { opacity: 0.5, duration: 3.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 9.5);
  tl.to("#s2-glow-b", { opacity: 0.5, duration: 3.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 9.8);

  // ============================================================
  // S3 MANIFESTO (13-20s)
  // ============================================================
  tl.fromTo("#s3-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.4, ease: "expo.out" }, 13);
  softEnter("#s3 .sc", 13);
  tl.fromTo("#s3-streak", { left: -350, autoAlpha: 0 }, { left: 2050, autoAlpha: 0.85, duration: 5.4, ease: "power1.inOut" }, 13.2);
  tl.fromTo("#s3-wave-1", { width: 200, height: 200, autoAlpha: 0.5 }, { width: 2000, height: 2000, autoAlpha: 0, duration: 4.0, ease: "power2.out" }, 13.5);
  tl.fromTo("#s3-wave-2", { width: 200, height: 200, autoAlpha: 0.5 }, { width: 2000, height: 2000, autoAlpha: 0, duration: 4.0, ease: "power2.out" }, 15.5);
  tl.from("#s3-eyebrow-text", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 13.35);
  tl.from(".s3-word", {
    y: 90, autoAlpha: 0, duration: 0.85, ease: "power4.out",
    stagger: { each: 0.1, from: "start" },
  }, 13.5);
  tl.from("#s3-sub", { y: 24, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 15.1);
  tl.from(".s3-row .pip", { scale: 0, duration: 0.45, ease: "back.out(1.8)" }, 15.8);
  tl.from(".s3-row .label", { x: -10, autoAlpha: 0, duration: 0.55, ease: "power2.out" }, 15.9);
  tl.to(".s3-row .pip", { opacity: 0.4, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 2 }, 16.5);
  // ambient hold
  tl.to(".s3-headline", { y: -8, duration: 3.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 16.5);

  // ============================================================
  // S4 ESTETISKE (20-27s)
  // ============================================================
  tl.fromTo("#s4-flash", { opacity: 0.85 }, { opacity: 0, duration: 0.4, ease: "expo.out" }, 20);
  softEnter("#s4 .sc", 20);
  tl.fromTo("#s4-streak", { left: -350, autoAlpha: 0 }, { left: 2050, autoAlpha: 0.9, duration: 5.6, ease: "power1.inOut" }, 20.2);
  tl.from("#s4-eyebrow-text", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 20.35);
  tl.from("#s4-title", { y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 20.55);
  tl.from("#s4-count", { y: 22, autoAlpha: 0, duration: 0.65, ease: "power2.out" }, 20.75);
  tl.from(".s4-row", {
    x: -38, autoAlpha: 0, duration: 0.6, ease: "expo.out",
    stagger: { each: 0.08, from: "start" },
  }, 21.1);
  // ambient
  tl.to("#s4-title", { y: -8, duration: 3.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 23.5);

  // ============================================================
  // S5 TANNBEHANDLINGER (27-33.5s)
  // ============================================================
  tl.fromTo("#s5-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.4, ease: "expo.out" }, 27);
  softEnter("#s5 .sc", 27);
  tl.fromTo("#s5-streak", { left: -350, autoAlpha: 0 }, { left: 2050, autoAlpha: 0.85, duration: 5.2, ease: "power1.inOut" }, 27.2);
  tl.from("#s5-eyebrow-text", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 27.35);
  tl.from("#s5-title", { y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 27.55);
  tl.from("#s5-count", { y: 22, autoAlpha: 0, duration: 0.65, ease: "power2.out" }, 27.75);
  tl.from(".s5-row", {
    x: -38, autoAlpha: 0, duration: 0.6, ease: "expo.out",
    stagger: { each: 0.08, from: "start" },
  }, 28.1);
  tl.to("#s5-title", { y: -8, duration: 3.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 30.5);

  // ============================================================
  // S6 RESULTATER (33.5-40.5s) SHADER ANCHOR
  // ============================================================
  tl.from("#s6-eyebrow", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 33.7);
  tl.from("#s6-title",   { x: 32,  autoAlpha: 0, duration: 0.65, ease: "power3.out" }, 33.85);
  tl.from("#s6-c1",      { y: 90, autoAlpha: 0, scale: 0.94, duration: 0.85, ease: "expo.out" }, 34.1);
  tl.from("#s6-c2",      { y: 90, autoAlpha: 0, scale: 0.94, duration: 0.85, ease: "expo.out" }, 34.3);
  tl.from("#s6-c3",      { y: 90, autoAlpha: 0, scale: 0.94, duration: 0.85, ease: "expo.out" }, 34.5);
  tl.fromTo("#s6-c1 .s6-photo", { scale: 1.0 }, { scale: 1.1, duration: 6.4, ease: "none" }, 34.1);
  tl.fromTo("#s6-c2 .s6-photo", { scale: 1.0 }, { scale: 1.1, duration: 6.4, ease: "none" }, 34.3);
  tl.fromTo("#s6-c3 .s6-photo", { scale: 1.0 }, { scale: 1.1, duration: 6.4, ease: "none" }, 34.5);
  tl.to("#s6-c1", { y: -10, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 36.0);
  tl.to("#s6-c2", { y: -10, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 36.2);
  tl.to("#s6-c3", { y: -10, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 36.4);

  // ============================================================
  // S7 BIG MESSAGE (40.5-47.5s) SHADER ANCHOR
  // ============================================================
  tl.fromTo("#s7-photo", { scale: 1.18 }, { scale: 1.4, duration: 7.0, ease: "none" }, 40.5);
  tl.fromTo("#s7-wave-1", { width: 220, height: 220, autoAlpha: 0.45 }, { width: 2400, height: 2400, autoAlpha: 0, duration: 5.0, ease: "power2.out" }, 40.7);
  tl.fromTo("#s7-wave-2", { width: 220, height: 220, autoAlpha: 0.45 }, { width: 2400, height: 2400, autoAlpha: 0, duration: 5.0, ease: "power2.out" }, 43.0);
  tl.from("#s7-glow-a",  { autoAlpha: 0, scale: 0.5, duration: 1.5, ease: "power2.out" }, 40.8);
  tl.from("#s7-glow-b",  { autoAlpha: 0, scale: 0.5, duration: 1.7, ease: "power2.out" }, 41.0);
  tl.from("#s7-flare",   { autoAlpha: 0, scale: 0.4, duration: 1.3, ease: "power2.out" }, 41.2);
  tl.from(".s7-eyebrow", { y: -12, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 40.9);
  tl.from("#s7-w1", { y: 110, autoAlpha: 0, duration: 0.85, ease: "power4.out" }, 41.1);
  tl.from("#s7-w2", { y: 110, autoAlpha: 0, duration: 0.85, ease: "power4.out" }, 41.25);
  tl.from("#s7-w3", { y: 120, scale: 0.92, autoAlpha: 0, duration: 1.05, ease: "back.out(1.4)" }, 41.55);
  tl.from("#s7-sub", { y: 30, autoAlpha: 0, duration: 0.75, ease: "power2.out" }, 42.5);
  tl.to("#s7-glow-a", { opacity: 0.6, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 42.8);
  tl.to("#s7-title",  { y: -14, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, 42.6);
  tl.to("#s7-flare",  { scale: 1.18, opacity: 0.75, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 42.8);

  // ============================================================
  // S8 RATING (47.5-53s) SHADER ANCHOR
  // ============================================================
  tl.from(".s8-eyebrow", { y: -12, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 47.8);
  tl.from("#s8-halo",    { autoAlpha: 0, scale: 0.4, duration: 1.3, ease: "power2.out" }, 47.7);
  tl.from("#s8-halo-2",  { autoAlpha: 0, scale: 0.3, duration: 1.1, ease: "power2.out" }, 47.8);
  tl.from("#s8-big",     { scale: 0.82, autoAlpha: 0, duration: 0.7, ease: "back.out(1.4)" }, 47.95);
  var ratingObj = { v: 0 };
  tl.to(ratingObj, {
    v: 5.0, duration: 1.25, ease: "power2.out",
    onUpdate: function () { document.getElementById("s8-big").textContent = ratingObj.v.toFixed(1); }
  }, 48.15);
  tl.from(".s8-star", {
    y: 30, autoAlpha: 0, scale: 0.4, duration: 0.5, ease: "back.out(1.8)",
    stagger: { each: 0.09, from: "start" },
  }, 48.9);
  tl.from("#s8-meta",   { y: 22, autoAlpha: 0, duration: 0.65, ease: "power2.out" }, 49.6);
  tl.from("#s8-google", { y: 14, autoAlpha: 0, duration: 0.55, ease: "power2.out" }, 49.9);
  var countObj = { v: 0 };
  tl.to(countObj, {
    v: 95, duration: 0.95, ease: "power2.out",
    onUpdate: function () { document.getElementById("s8-count").textContent = Math.round(countObj.v); }
  }, 49.75);
  tl.to("#s8-big",   { scale: 1.04, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 50.7);
  tl.to("#s8-halo",  { opacity: 0.55, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, 50.4);

  // ============================================================
  // S9 CONTACT (53-60s) SHADER ANCHOR
  // ============================================================
  tl.from(".s9-eyebrow", { x: -22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, 53.2);
  tl.from("#s9-map", { autoAlpha: 0, x: 80, duration: 1.4, ease: "power2.out" }, 53.4);
  tl.to("#s9-map",   { x: -40, y: -15, duration: 6.0, ease: "sine.inOut" }, 54.0);
  tl.from("#s9-headline",{ y: 42, autoAlpha: 0, duration: 0.85, ease: "power3.out" }, 53.4);
  tl.from("#s9-sub",     { y: 22, autoAlpha: 0, duration: 0.7,  ease: "power2.out" }, 53.9);
  tl.from("#s9-card-glow",{ autoAlpha: 0, scale: 0.6, duration: 1.1, ease: "power2.out" }, 53.5);
  tl.from("#s9-card",    { x: 64, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 53.65);
  tl.from(".s9-row", {
    y: 24, autoAlpha: 0, duration: 0.55, ease: "power2.out",
    stagger: { each: 0.14, from: "start" },
  }, 54.0);
  tl.to("#s9-phone", { scale: 1.05, duration: 2.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 55.5);

  // ============================================================
  // S10 CLOSE (60-70s) — final scene, BIG hold
  // ============================================================
  tl.fromTo("#s10-flash", { opacity: 0.7 }, { opacity: 0, duration: 0.45, ease: "expo.out" }, 60);
  softEnter("#s10 .sc", 60);
  // corner ornaments swing in (subtle frame around brand moment)
  tl.from("#s10-orn-tl", { autoAlpha: 0, x: -20, y: -20, duration: 0.9, ease: "power3.out" }, 60.3);
  tl.from("#s10-orn-tr", { autoAlpha: 0, x: 20, y: -20, duration: 0.9, ease: "power3.out" }, 60.4);
  tl.from("#s10-orn-bl", { autoAlpha: 0, x: -20, y: 20, duration: 0.9, ease: "power3.out" }, 60.5);
  tl.from("#s10-orn-br", { autoAlpha: 0, x: 20, y: 20, duration: 0.9, ease: "power3.out" }, 60.6);
  tl.to("#s10-orn-tl", { opacity: 0.45, duration: 1.4, ease: "power2.out" }, 61.2);
  tl.to("#s10-orn-tr", { opacity: 0.45, duration: 1.4, ease: "power2.out" }, 61.3);
  tl.to("#s10-orn-bl", { opacity: 0.45, duration: 1.4, ease: "power2.out" }, 61.4);
  tl.to("#s10-orn-br", { opacity: 0.45, duration: 1.4, ease: "power2.out" }, 61.5);
  tl.from("#s10-bg-glow", { autoAlpha: 0, scale: 0.65, duration: 2.4, ease: "power2.out" }, 60);
  tl.from("#s10-logo-glow", { autoAlpha: 0, scaleX: 0.4, duration: 1.6, ease: "power2.out" }, 60.3);
  // typographic wordmark — char stagger reveal (sharp, no upscale blur)
  tl.from("#s10-wordmark-type .char", {
    y: 90, autoAlpha: 0, duration: 0.85, ease: "power4.out",
    stagger: { each: 0.05, from: "start" },
  }, 60.5);
  tl.to("#s10-wordmark-type", { y: -8, duration: 4.0, ease: "sine.inOut", yoyo: true, repeat: 1 }, 62.5);
  tl.to("#s10-rule-l", { width: 240, duration: 1.0, ease: "expo.out" }, 62.5);
  tl.to("#s10-rule-r", { width: 240, duration: 1.0, ease: "expo.out" }, 62.5);
  tl.to("#s10-dot",    { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 62.9);
  tl.from("#s10-tag",  { y: 40, autoAlpha: 0, duration: 0.95, ease: "power3.out" }, 62.8);
  tl.from("#s10-sub",  { y: 22, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 63.4);
  tl.from("#s10-url",  { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 63.8);
  // long ambient hold (60-70 = 10s scene)
  tl.to("#s10-bg-glow",   { opacity: 0.78, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 64.0);
  tl.to("#s10-dot",       { scale: 1.6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 2 }, 64.5);
  tl.to("#s10-logo-glow", { opacity: 0.65, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 63.8);
  tl.to("#s10-tag",       { letterSpacing: "0.04em", duration: 3.0, ease: "sine.inOut" }, 65.0);
  tl.to("#s10-wordmark-type", { letterSpacing: "0.1em", duration: 3.2, ease: "sine.inOut" }, 65.5);

  // ============================================================
  // Shader transitions
  // ============================================================
  window.HyperShader.init({
    bgColor:
      getComputedStyle(document.documentElement).getPropertyValue("--bg-dark").trim()
      || "#100B07",
    scenes: ["s6", "s7", "s8", "s9"],
    timeline: tl,
    transitions: [
      { time: 40.25, shader: "cinematic-zoom",  duration: 0.5 },
      { time: 47.25, shader: "light-leak",      duration: 0.5 },
      { time: 52.75, shader: "chromatic-split", duration: 0.5 },
    ],
  });

  window.__timelines["main"] = tl;
})();
