# Motion-Graphics Reklame — Full Spesifikasjon

Dette dokumentet beskriver **alt** som brukes for å gå fra "her er en lenke til en nettside" til en ferdig, polert motion-graphic reklamefilm — verktøy, designsystem, dramaturgi og kode-arketyper. Gi dette til hvem som skal bygge eller vurdere kvaliteten på denne typen video.

---

## 1. Stack (hva det er bygget med)

| Lag | Verktøy | Hvorfor |
|---|---|---|
| Markup/styling | Rent HTML + CSS (ingen rammeverk) | Null buildsteg, fungerer i alle nettlesere, lett å redigere direkte |
| Animasjon | **GSAP 3** (GreenSock) — `gsap.timeline()` | Industristandard for motion på web. Presis kontroll på millisekund-nivå, `stagger`, `ease`-kurver, og `fromTo`/`from`/`to`-mønsteret som gjør koreografi lesbar |
| Enheter | `vmin`/`vw`/`vh` for alt — aldri faste px | Garanterer at design skalerer perfekt på alle skjermoppløsninger og når man eksporterer i ulike størrelser (1:1, 9:16, 16:9) |
| Skrift | Google Fonts, **Inter** (300–900) | Variabel vekt gir kontrast mellom tynn brødtekst og ekstra-bold overskrifter uten å laste flere fonter |
| Opptak | Nettleserens **MediaRecorder API** + `getDisplayMedia` | Tar opp skjermen direkte i browseren til WebM — null avhengighet til OBS/Quicktime |
| Canvas-format | Kvadratisk `min(100vw,100vh)` med `aspect-ratio:1/1` | Universalt format som funker på Instagram/TikTok/LinkedIn uten beskjæring |

**Ingen build-pipeline, ingen npm-pakker i selve filmen.** Filmen er én selvstendig HTML-fil (eller en liten samling: html+css+js) som kjører offline i nettleseren.

---

## 2. Designsystemet (CSS-variabler)

Alltid definert som `:root`-variabler så hele filmen kan re-temaes ved å bytte ut 3-4 verdier:

```css
:root{
  --white:#FFFFFF;
  --paper:#FAFAF7;       /* bakgrunn, varmere enn rent hvitt */
  --ink:#0E0E10;         /* primær tekst, ikke ren svart */
  --brand:#E5263A;       /* kundens merkefarge */
  --brand-deep:#B91E2F;  /* mørkere variant for hover/depth */
  --accent:#FFD65B;      /* sekundærfarge for ikoner/detaljer */
  --cream:#FFF6DE;       /* lys aksent-bakgrunn for ikon-sirkler etc. */
  --dim:rgba(14,14,16,.58);    /* sekundær tekst */
  --softer:rgba(14,14,16,.42); /* tertiær/label-tekst */
  --rule:rgba(14,14,16,.10);   /* border-farge, alltid transparent ink */
  --shadow:0 18px 50px rgba(229,38,58,.10), 0 6px 14px rgba(14,14,16,.05);
}
```

**Regel:** Bruk ALDRI rent svart (`#000`) eller rent hvitt (`#FFF`) for tekst/bakgrunn — alltid `--ink` og `--paper`. Det gir et varmere, mer "designet" inntrykk enn defaultverdier.

**Typografi-regler:**
- `letter-spacing:-.04em` på store overskrifter (tett, premium-følelse)
- `letter-spacing:.2-.3em` + `text-transform:uppercase` på eyebrows/labels (luftig, redaksjonell kontrast)
- `font-weight:900` + `font-style:italic` på wordmark/logo (signatur-bevegelse, skiller seg fra resten)
- `text-wrap:balance` på alle headlines (unngår rare linjebrekk)

---

## 3. Dramaturgi — scene-rekkefølgen som alltid funker

Hver reklamefilm følger samme **6-akts struktur** (justerbar lengde, men ikke rekkefølge):

```
1. LOGO INTRO     (~3s)   →  bygg gjenkjennelse umiddelbart
2. HOOK           (~3.5s) →  ett spørsmål/påstand som skaper spenning
3. BEVIS-GRID     (~5.5s) →  4 konkrete fakta/priser i kortform
4. STORT TALL     (~4s)   →  ett dramatisk tall (24/7, 15+, 98%) som statement
5. TRUST          (~5s)   →  sertifiseringer/anmeldelser/år i bransjen
6. CTA            (~6s)   →  telefonnummer/URL, digit-by-digit reveal
```

Total: 25-32 sekunder. **Aldri lenger enn 35s** — det er grensen for at folk ser hele filmen på sosiale medier uten å scrolle forbi.

**Hvorfor denne rekkefølgen:** Den følger en klassisk reklame-logikk: *identitet → spenning → bevis → confidence → trygghet → handling*. Det er ikke vilkårlig — det er strukturen i Taxi4Moss- og Norleads-referansefilmene som faktisk fungerte.

---

## 4. Animasjons-prinsipper (GSAP-koreografi)

### 4.1 Inn/ut-mønster for hver scene
```js
tl.set(scene, {visibility:'visible'}, t0);
tl.fromTo(scene, {opacity:0}, {opacity:1, duration:.5}, t0);
// ... scene-spesifikk animasjon ...
tl.to(scene, {opacity:0, duration:.45, ease:'power2.in'}, tEnd);
tl.set(scene, {visibility:'hidden'}, t0 + duration);
```
`visibility` + `opacity` brukes sammen — `opacity:0` alene lar elementet fortsatt ta layout-plass og kan trigge usynlige reflows.

### 4.2 Tekst-reveal — alltid clip + slide, ikke bare fade
```css
.reveal{display:inline-block; overflow:hidden; vertical-align:bottom;}
.reveal > span{display:inline-block;}
```
```js
tl.from('.reveal > span', {y:'110%', opacity:0, duration:1, stagger:.4, ease:'power3.out'});
```
Teksten "kommer opp fra under" linjen i stedet for å bare tone inn — det er en mye sterkere, redaksjonell bevegelse (samme trikset som store nyhetsmagasiner bruker i intro-sekvenser).

### 4.3 Kort/grid — 3D rotasjon, ikke bare scale
```js
tl.from('.price-card', {
  rotationY:-75, opacity:0, y:30, z:-100,
  duration:.7, stagger:.14, ease:'back.out(1.4)',
  transformOrigin:'center center -40px'
});
```
`perspective` settes på parent-container (`perspective:1200px`), og kortene roterer inn i 3D-rom i stedet for å bare flyte opp. `back.out()` gir et lite "overshoot" som gjør bevegelsen organisk i stedet for robotisk.

### 4.4 Signaturtrikk: sekvensiell fargesveip
Brukt i feature-grid: hvert kort blir kort merkefarget ("highlightet") i tur og orden, så går tilbake til neutral — som en presentatør som peker på hvert punkt etter tur:
```js
cards.forEach((card, i) => {
  const on = base + i*0.28, off = base + 1.5 + i*0.16;
  tl.to(card, {backgroundColor: brand, ...}, on);
  tl.to(card, {backgroundColor: neutral, ...}, off);
});
```

### 4.5 Stort-tall-scene — asymmetrisk inn fra hver side
Tallet før skilletegnet kommer fra venstre, skilletegnet roterer inn ovenfra, tallet etter kommer fra høyre. Gir en "slå sammen"-følelse som føles dramatisk uten å være kostbar å bygge.

### 4.6 CTA — digit-by-digit slot machine
```js
tl.from('.cta-phone .d', {
  y:-90, opacity:0, scale:.4,
  duration:.55, stagger:.14, ease:'back.out(2.2)'
});
```
Hvert siffer i telefonnummeret kommer separat med overshoot — øynene følger nummeret naturlig og det blir mer memorerbart enn om hele nummeret bare faded inn.

### 4.7 Easing-vokabular
- `power2.out` / `power3.out` — standard "myk landing", brukes til 80% av alt
- `back.out(1.4–2.2)` — for ting som skal kjennes "fjæraktig"/legende (kort, tall, knapper)
- `power2.in` — kun for ting som forsvinner (utganger skal kjennes raskere/skarpere enn innganger)
- `elastic.out` — sparsomt, kun for enkelt-element "knock"-effekter (bauhaus-bokstaver, stempler)
- **Aldri** `linear` på noe annet enn progress-barer

---

## 5. Layout-arketyper (komponenter)

| Komponent | Bruk | Nøkkeldetalj |
|---|---|---|
| `.eyebrow` | Liten label over hovedoverskrift | uppercase, brand-farge, letter-spacing .3em |
| `.reveal` tekst | Alle hovedoverskrifter | clip-reveal, ikke fade |
| `.price-grid` (4 kort) | Priser, features, åpningstider | 3D flip-in + sekvensiell highlight |
| `.big-num` | Ett dramatisk tall/statement | 34vmin font-size, side-inn animasjon |
| `.trust-row` (3 kort) | Sertifiseringer, år, rating | 3D rotationX flip fra under |
| `.cta-phone` | Telefonnummer i finalen | digit-by-digit, tabular-nums |
| `.zone-chip` | Pills/badges (soner, tags) | border-radius:999px, outline → solid variant |

---

## 6. Bakgrunn/kontrast-varianter (poster-stil, fra Norleads-referansen)

For mer eksperimentelle/kreative kunder (byråer, motedesign, events) brukes i stedet **fullbleed fargeflater** som "limes" inn over hverandre (paste-transition), ikke fade-cuts:

```js
function paste(toSel, page){
  tl.fromTo(toSel,
    {y:'112%', rotate:gsap.utils.random(-2.5,2.5)},
    {y:'0%', rotate:0, duration:.95, ease:'power4.inOut'});
}
```
Bakgrunnsfarger roterer mellom: sort (`#0c0c0d`), syre-grønn (`#d8ff3e`), støvrosa (`#f2c7c2`), beige (`#eae6dc`) — alltid **monokrom tekst på flat farge**, ingen gradient-bakgrunner. Typografi: `Big Shoulders Display` (900-vekt, kondensert, lavercase med tilfeldige UPPERCASE-bokstaver for bauhaus-disrupsjon).

Dette er en **alternativ stil**, ikke standarden — brukes når kunden signalerer "kreativt byrå" snarere enn "lokal tjenestebedrift".

---

## 7. Workflow: fra lenke til ferdig film

```
1. INPUT
   → Kunde gir URL (f.eks. taxi4moss.no)

2. EKSTRAHER BRAND
   → Bedriftsnavn (fra domene/title-tag)
   → Brand-farge (fra logo/CSS hvis synlig, ellers spør kunde)
   → Telefonnummer, kjernebudskap (fra forsiden)
   → 3-5 konkrete fakta å bruke i bevis-gridet (priser, åpningstider, antall år)

3. VELG SCENE-FLOW
   → Standard: logo-intro → hook → feature-grid → big-number → trust → cta
   → Tjenestebedrift (taxi, rørlegger, frisør) → standard-flow
   → Kreativt/digitalt produkt → poster-stil med paste-transitions

4. SKRIV TEKST FOR HVER SCENE
   → Hook skal være ETT spørsmål eller ETT skarpt utsagn, aldri en hel setning
   → Bevis-grid: korte tall + ett ord (ikke fulle setninger i kortene)
   → CTA: telefonnummer + URL, alltid synlig samtidig

5. BYGG HTML/CSS/JS
   → Bruk scenebiblioteket (se scenes.js i dette repoet) som utgangspunkt
   → Sett brand-farger i :root
   → Juster scene-tekster

6. KVALITETSSJEKK (kritisk — aldri skip)
   → Åpne i nettleser, se hele loopen 2x
   → Sjekk: er noe tekst klippet/overlapper?
   → Sjekk: er timingen rolig nok til å lese, men ikke seig?
   → Sjekk: kommer CTA-informasjonen tydelig og lenge nok?

7. EKSPORTER
   → Bruk innebygd MediaRecorder-opptak (REC-knapp i player.html)
   → Eller: screen-record manuelt om man vil ha kontroll på format/codec
   → Output: WebM (konverter til MP4 med ffmpeg om nødvendig for visse plattformer)
```

---

## 8. Kvalitetskriterier — hva skiller "amatør" fra dette nivået

| Amatør-tegn | Dette systemet gjør i stedet |
|---|---|
| Ren fade in/out på alt | Clip-reveals, 3D-rotasjon, retningsbestemt inn/ut |
| Faste pixel-størrelser | `vmin`-baserte, skalerer perfekt på alle skjermer |
| Rene svart/hvit-farger | Varme off-black/off-white (`--ink`/`--paper`) |
| All tekst kommer inn samtidig | Staggered, sekvensiell, med egen rytme per element |
| Statisk layout gjennom hele filmen | Hver scene har egen koreografi, ikke gjenbrukt template |
| Telefonnummer bare "der" | Digit-by-digit reveal + pulse for å trekke blikket |
| Tilfeldig easing | Konsekvent easing-vokabular (se 4.7) |
| Ingen tydelig dramaturgi | 6-akts struktur med spenningskurve |
| For lang (45s+) | Hardt kappet til 25-32s |

---

## 9. Filstruktur i dette repoet

```
studio/
├── index.html         ← Editor: sett brand-info, rediger scener
├── player.html         ← Spiller: kjører filmen, har REC-knapp
├── start.bat / .sh     ← Ett-klikks lokal server
└── assets/
    ├── theme.css        ← CSS-variabler (designsystemet, §2)
    ├── scenes.js         ← Scene-biblioteket (§5) — render() + animate() per scene
    ├── player.css/.js    ← Spiller-logikk + GSAP-timeline-bygger
    ├── studio.css/.js    ← Editor-UI-logikk
    └── gsap.min.js       ← Lokalt bundlet animasjonsbibliotek
```

`scenes.js` er kjernen — hver scene-arketype er definert som:
```js
'scene-id': {
  label: 'Visningsnavn i editor',
  duration: 4.0,                       // sekunder
  defaults: { /* redigerbare tekstfelter */ },
  render: (cfg, brand) => `<html...>`,  // returnerer markup
  animate: (timeline, rootEl, cfg, brand, startTime) => { /* GSAP-tweens */ }
}
```

---

## 10. Hva Lovable (eller andre byggere) bør matche

Hvis du gir denne specen til et annet verktøy/team for å bygge en lignende generator, er minimumskravet for **samme kvalitetsnivå**:

1. GSAP eller tilsvarende timeline-bibliotek (ikke CSS-only @keyframes for komplekse sekvenser — for vanskelig å koreografere presist)
2. Eget designsystem med CSS-variabler, ikke hardkodede farger per element
3. Minst 3 distinkte "inn"-bevegelser (clip-reveal, 3D-flip, side-slide) — ikke bare fade
4. Eksplisitt dramaturgisk struktur (ikke bare "scener i rekkefølge" uten tenkt spenningskurve)
5. Innebygd eksport/opptak — ikke avhengig av at brukeren installerer tredjeparts skjermopptak
6. `vmin`-basert skalering for plattform-uavhengighet
7. Total varighet 25-35s, hard cap

Alt under dette nivået vil se synlig "billigere" ut enn referansene (Taxi4Moss, Norleads) som hele dette systemet er bygget for å reprodusere kvaliteten av.
