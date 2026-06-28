// AUTO-FIT TEXT ENGINE
// ---------------------------------------------------------------------------
// Root fix for "text is not positioned correctly / overflows the box".
//
// The old directions hard-coded giant font sizes in `cqw` (e.g. 11cqw / 48cqw)
// with no measurement, so any title longer than a few words spilled outside the
// frame. This runtime measures every `[data-fit]` element against its safe box
// and binary-searches the largest font-size that still fits — in BOTH axes.
//
// Markup contract (directions emit this):
//   <div data-fit-box>                      ← the safe area to fit inside
//     <h1 data-fit data-fit-max="14cqw" data-fit-min="3cqw">Headline</h1>
//   </div>
//
//   data-fit         → measure + scale this element
//   data-fit-box     → nearest ancestor that defines the available area
//   data-fit-max     → upper bound for font-size (cqw|px|vw). default: box height
//   data-fit-min     → lower bound (cqw|px|vw). default: 8px
//   data-fit-nowrap  → keep on one line (e.g. big numbers, logos)
//
// Runs once at boot (scenes are visibility:hidden but still have layout, so they
// measure fine), again after web-fonts settle, and on resize. Sets an inline
// font-size that overrides the direction CSS, so directions can ship sane
// defaults and let the fitter own the final size.

export const FIT_TEXT_RUNTIME = `
(function(){
  function resolveLen(v, base){
    if(v==null) return null;
    var s=String(v).trim();
    if(s.slice(-3)==='cqw') return parseFloat(s)/100*base;
    if(s.slice(-2)==='px')  return parseFloat(s);
    if(s.slice(-2)==='vw')  return parseFloat(s)/100*window.innerWidth;
    var n=parseFloat(s); return isNaN(n)?null:n;
  }
  function boxOf(el){
    return el.closest('[data-fit-box]') || el.parentElement || el;
  }
  function avail(box){
    var cs=getComputedStyle(box);
    var w=box.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h=box.clientHeight - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom);
    return { w: Math.max(0,w), h: Math.max(0,h) };
  }
  function fits(el, w, h){
    return el.scrollWidth <= Math.ceil(w)+1 && el.scrollHeight <= Math.ceil(h)+1;
  }
  function fitOne(el, filmW){
    var box=boxOf(el);
    var a=avail(box);
    if(a.w<=2 || a.h<=2) return;
    var nowrap = el.getAttribute('data-fit-nowrap')!=null;
    el.style.whiteSpace = nowrap ? 'nowrap' : '';
    var max = resolveLen(el.getAttribute('data-fit-max'), filmW);
    var min = resolveLen(el.getAttribute('data-fit-min'), filmW);
    if(max==null) max = a.h;
    if(min==null) min = 8;
    var lo=Math.min(min,max), hi=Math.max(min,max), best=lo;
    for(var i=0;i<24;i++){
      var mid=(lo+hi)/2;
      el.style.fontSize=mid+'px';
      if(fits(el, a.w, a.h)){ best=mid; lo=mid; } else { hi=mid; }
      if(hi-lo<0.4) break;
    }
    el.style.fontSize=best+'px';
  }
  function fitAll(){
    var film=document.getElementById('film');
    var filmW=film?film.clientWidth:window.innerWidth;
    var els=document.querySelectorAll('[data-fit]');
    for(var i=0;i<els.length;i++){ try{ fitOne(els[i], filmW); }catch(e){} }
  }
  window.__fitAll=fitAll;
  var t=null;
  window.addEventListener('resize', function(){ clearTimeout(t); t=setTimeout(fitAll,80); });
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(fitAll).catch(function(){}); }
  fitAll();
})();
`;
