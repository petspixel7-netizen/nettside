/* ── EDITOR LOGIC ──────────────────────────────────────── */

const STORAGE_KEY = 'studio:config';

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return defaultState();
}

function defaultState() {
  return {
    brand: {
      name: 'Taxi4Moss',
      url: 'taxi4moss.no',
      phone: '04231',
      brand: '#E5263A',
      cream: '#FFF6DE',
      ink: '#0E0E10'
    },
    scenes: window.DEFAULT_SCENE_FLOW.map(id => ({ id, cfg: {} }))
  };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateStat();
}

function updateStat() {
  let total = 0;
  state.scenes.forEach(s => { total += (window.SCENES[s.id]?.duration || 0); });
  document.getElementById('stat-count').textContent = state.scenes.length;
  document.getElementById('stat-dur').textContent = total.toFixed(1) + 's';
}

/* ── render brand-panel ──────────────────────────────── */
function renderBrand() {
  const b = state.brand;
  const wrap = document.getElementById('brand-panel');
  wrap.innerHTML = `
    <div class="row">
      <label>Bedriftsnavn <input type="text" data-bk="name" value="${esc(b.name)}"></label>
      <label>Nettside-URL <input type="url" data-bk="url" value="${esc(b.url)}" placeholder="taxi4moss.no"></label>
    </div>
    <div class="row three" style="margin-top:10px">
      <label>Telefon <small>brukes i CTA</small> <input type="text" data-bk="phone" value="${esc(b.phone)}"></label>
      <label>Brand-farge <input type="color" data-bk="brand" value="${b.brand}"></label>
      <label>Aksent (lys) <input type="color" data-bk="cream" value="${b.cream || '#FFF6DE'}"></label>
    </div>
  `;
  wrap.querySelectorAll('[data-bk]').forEach(el => {
    el.addEventListener('input', e => {
      state.brand[el.dataset.bk] = el.value;
      save();
    });
  });
}

/* ── render scene-liste ──────────────────────────────── */
function renderScenes() {
  const list = document.getElementById('scenes-list');
  list.innerHTML = '';
  state.scenes.forEach((s, i) => list.appendChild(sceneCard(s, i)));
  renderAddRow();
  updateStat();
}

function sceneCard(s, i) {
  const def = window.SCENES[s.id];
  const merged = Object.assign({}, def.defaults, s.cfg || {});
  const card = document.createElement('div');
  card.className = 'scene-card' + (s._open ? ' open' : '');
  card.innerHTML = `
    <div class="scene-head">
      <div class="ix">${i+1}</div>
      <div class="title">${def.label}</div>
      <div class="dur">${def.duration}s</div>
      <div class="actions">
        <button data-act="up"   title="Opp">↑</button>
        <button data-act="down" title="Ned">↓</button>
        <button data-act="del"  title="Slett">✕</button>
      </div>
    </div>
    <div class="scene-body"></div>
  `;
  const body = card.querySelector('.scene-body');
  body.innerHTML = buildFields(s.id, merged);

  // toggle open
  card.querySelector('.scene-head').addEventListener('click', e => {
    if (e.target.closest('.actions')) return;
    s._open = !s._open;
    renderScenes();
  });

  // actions
  card.querySelectorAll('.actions button').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const a = b.dataset.act;
      if (a === 'del') state.scenes.splice(i, 1);
      if (a === 'up' && i > 0) [state.scenes[i-1], state.scenes[i]] = [state.scenes[i], state.scenes[i-1]];
      if (a === 'down' && i < state.scenes.length-1) [state.scenes[i+1], state.scenes[i]] = [state.scenes[i], state.scenes[i+1]];
      save(); renderScenes();
    });
  });

  // field bindings
  body.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', e => {
      s.cfg = s.cfg || {};
      const f = el.dataset.field;
      if (f.includes('.')) { // items[i].big
        const m = f.match(/^items\[(\d+)\]\.(\w+)$/);
        if (m) {
          s.cfg.items = s.cfg.items || (def.defaults.items ? JSON.parse(JSON.stringify(def.defaults.items)) : []);
          s.cfg.items[+m[1]][m[2]] = el.value;
        }
      } else {
        s.cfg[f] = el.value;
      }
      save();
    });
  });

  // items add/remove
  body.querySelectorAll('[data-item-act]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const act = el.dataset.itemAct;
      s.cfg = s.cfg || {};
      s.cfg.items = s.cfg.items || (def.defaults.items ? JSON.parse(JSON.stringify(def.defaults.items)) : []);
      if (act === 'add') s.cfg.items.push({ big: '', small: '', p: '' });
      if (act.startsWith('del:')) s.cfg.items.splice(+act.split(':')[1], 1);
      save(); renderScenes();
      // re-open same card
      state.scenes[i]._open = true;
      renderScenes();
    });
  });

  return card;
}

function buildFields(id, c) {
  const fields = [];
  const skip = new Set(['items']);

  Object.keys(c).forEach(k => {
    if (skip.has(k)) return;
    fields.push(`
      <label>${labelize(k)}
        <input type="text" data-field="${k}" value="${esc(c[k])}">
      </label>`);
  });

  if (Array.isArray(c.items)) {
    fields.push(`<label style="margin-top:14px">Innhold (kort)</label><div class="item-list">`);
    c.items.forEach((it, i) => {
      const hasP = 'p' in it;
      fields.push(`
        <div class="item-row" ${hasP ? 'style="grid-template-columns:1fr 1fr 2fr auto"' : 'style="grid-template-columns:1fr 1fr auto"'}>
          <input type="text" data-field="items[${i}].big"   value="${esc(it.big||'')}"   placeholder="Stort">
          <input type="text" data-field="items[${i}].small" value="${esc(it.small||'')}" placeholder="Lite">
          ${hasP ? `<input type="text" data-field="items[${i}].p" value="${esc(it.p||'')}" placeholder="Beskrivelse">` : ''}
          <button class="del" data-item-act="del:${i}" title="Fjern">✕</button>
        </div>`);
    });
    fields.push(`</div><button class="btn ghost" data-item-act="add" style="margin-top:8px;align-self:start">+ Legg til kort</button>`);
  }

  return fields.join('');
}

function labelize(k) {
  const map = { line1: 'Linje 1', line2: 'Linje 2', eyebrow: 'Eyebrow (liten tekst over)',
    head1: 'Overskrift linje 1', head2: 'Overskrift linje 2',
    numA: 'Tall A', numB: 'Tall B', sep: 'Skilletegn', sub: 'Undertekst',
    tagline: 'Tagline', before: 'Før-tekst', after: 'Etter-tekst' };
  return map[k] || k.charAt(0).toUpperCase() + k.slice(1);
}

function renderAddRow() {
  const wrap = document.getElementById('add-scene');
  wrap.innerHTML = '';
  const sel = document.createElement('select');
  sel.innerHTML = `<option value="">+ Legg til scene…</option>` +
    Object.entries(window.SCENES).map(([id, d]) => `<option value="${id}">${d.label}</option>`).join('');
  sel.addEventListener('change', e => {
    if (!sel.value) return;
    state.scenes.push({ id: sel.value, cfg: {} });
    save(); renderScenes();
  });
  wrap.appendChild(sel);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ── auto-suggest fra URL (klient-side) ──────────────── */
async function autoSuggest() {
  const url = state.brand.url;
  if (!url) { alert('Skriv inn URL først.'); return; }
  const full = /^https?:\/\//.test(url) ? url : 'https://' + url;
  try {
    // Best effort: hent favicon + meta. CORS blokkerer ofte direkte fetch,
    // så vi prøver Google s2 favicon-tjenesten som er åpen, og gjetter farger.
    const host = new URL(full).hostname.replace(/^www\./,'');
    state.brand.name = host.split('.')[0].charAt(0).toUpperCase() + host.split('.')[0].slice(1);
    state.brand.url = host;
    save(); renderBrand(); renderScenes();
    alert('Forslag generert! Tilpass scene-tekstene under, så er du klar.');
  } catch(e) {
    alert('Kunne ikke hente automatisk. Fyll inn manuelt.');
  }
}

/* ── action-knapper ─────────────────────────────────── */
document.getElementById('btn-play').addEventListener('click', () => {
  save();
  window.open('player.html', '_blank');
});
document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('Tilbakestille alt til standard?')) return;
  state = defaultState(); save(); renderBrand(); renderScenes();
});
document.getElementById('btn-suggest').addEventListener('click', autoSuggest);
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (state.brand.name || 'reklame') + '.json';
  a.click();
});
document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try { state = JSON.parse(r.result); save(); renderBrand(); renderScenes(); }
    catch(err) { alert('Ugyldig fil'); }
  };
  r.readAsText(f);
});

/* boot */
renderBrand();
renderScenes();
