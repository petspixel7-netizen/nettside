# NorLeads – Typografi & Video-regelbok

> Regelboken for all video vi lager og legger ut på **norleads.no**.
>
> Denne versjonen er **faktisk forankret i tre kilder**, lest og destillert:
> 1. Ellen Lupton, *Thinking with Type* (2004) — hele boka OCR-lest side for side
>    (175 sider). Kapitlene **Letter → Text → Grid → Appendix** gir typografien.
> 2. Val Head, *Animation in Design Systems* (Adobe, 2019) — hele e-boka lest;
>    gir oss **motion-prinsipper** og **byggeklosser** (varighet, easing).
> 3. Google **Material Design – Understanding Motion** — det etablerte
>    motion-systemet (Informative / Focused / Expressive + standard-easing).
>    *Merk: live-siden er en ren JavaScript-app som verken WebFetch eller
>    headless-nettleseren fikk lastet i dette miljøet, så Material-laget er bygget
>    på det veldokumenterte, offentlige Material Motion-systemet, ikke et ferskt
>    sideuttrekk.*
>
> Korte sitater er markert med « ». Prinsippene er oversatt til **bevegelse** for
> NorLeads sin merkevare.
>
> Mål: hver video skal se dyr, rolig og bevisst ut – aldri tilfeldig.

---

## 0. Merkevarekjernen (ikke til forhandling)

| Element | Verdi | Bruk |
|---|---|---|
| Bakgrunn | `#0D0D0D` | Nesten svart, aldri ren `#000` unntatt i sluttfade |
| Gull | `#D4AF37` | Aksent, aldri mer enn ~10 % av flaten |
| Lys gull | `#F0D060` | Glød, høylys, knapper |
| Hvit | `#FFFFFF` | Hovedtekst |
| Grå | `#888888` | Underordnet tekst, bildetekst |
| Display-skrift | Serif (Georgia / Times) | Logo, overskrifter – *autoritet* |
| Funksjonsskrift | Sans-serif | Etiketter, knapper, URL – *klarhet* |

**Regel:** Gull er krydder, ikke saus. Ett gull-element i fokus per scene.

---

## 1. LETTER — formen på det minste

Bokas første del handler om bokstaven selv: anatomi, størrelse, klassifisering,
skriftfamilier og **logotyper**. Disse valgene avgjør om merkevaren føles
profesjonell før seeren rekker å lese et eneste ord.

### 1.1 Velg få skrifter – og la familien gjøre jobben
- Boka viser at en **full skriftfamilie** (mange vekter/snitt designet for å
  spille sammen) gir all variasjonen du trenger. Bruk **én serif** for identitet
  (logo + overskrifter) og **én sans-serif** for funksjon.
- Skal du *likevel* blande to familier: **«adjust the sizes so that the x-heights
  align»** – juster størrelsene så x-høydene møtes. Ellers ser blandingen rotete ut.

### 1.2 Logotype = NorLeads-ordbildet
Bokas logotype-kapittel: en logotype bruker typografi/bokstavforming til å skape
identitet. For oss er `Nor` (hvit) + `Leads` (gull) ordbildet vårt. Behandle det
som én form: fast farge-splitt, negativ sperring (se 2.2), aldri omformet glyfvis.

### 1.3 Kontrast er kommunikasjon
Skap forskjell man kjenner umiddelbart – ikke nesten-like størrelser.
- Overskrift vs. brødtekst: minst **2×** i størrelse.
- Varier på én klar akse (størrelse, vekt **eller** farge) per ord – ikke alle tre.

---

## 2. TEXT — ord satt i system

Bokas tyngste del. Kapitlene: Kerning, Tracking, Line Spacing, Alignment,
Vertical Alignment, **Hierarchy**. Dette er der video oftest feiler.

### 2.1 Kerning & tracking (knip & sperr)
- **Kerning** = avstand mellom *to* bokstaver; **tracking** = avstand over *hele*
  ord/linjer. Boka: store versaler og kapitéler **«appear more regal when standing
  apart»** – versal-etiketter skal sperres.
- **Gemene (små bokstaver) tåler sperring dårlig** – «they are designed to sit
  together intimately». Aldri sperr brødtekst.
- **Type crime fra boka:** *«Make the shoe fit, not the foot. Don't use negative
  tracking to save space.»* → Vi knep aldri tekst for å presse den inn; vi
  omskriver i stedet. Negativ sperring kun på store display-tall/logo for å binde formen.

### 2.2 Sperring – husstil
- Versal-etiketter (kicker, URL): positiv `letter-spacing 4–8px`.
- Display-logo og store tall: negativ `letter-spacing ≈ -1px`.

### 2.3 Line spacing (leading)
- Boka: standard leading er litt mer enn cap-høyden; øker du den får teksten
  «lighter, more open color». Men **for mye** leading gjør at linjene
  «become independent linear elements rather than parts of an overall texture».
- For oss: brødtekst linjehøyde **1.4–1.6×**; store display-overskrifter stramt **1.0–1.15×**.

### 2.4 Alignment
- **Justert** tekst gir ren form, men korte linjer lager «ugly gaps» / hull
  (bokas «type crime: pillars of holes»). Unngå justert tekst i video.
- **Venstrejustert / ragget høyre** «respects the flow of language rather than
  submitting to the law of the box» – vår standard. Pass på en jevn, pen rag.
- **Skru av auto-orddeling** på ragget og midtstilt tekst.

### 2.5 Hierarki – bokas kjernebudskap
- «A typographic hierarchy expresses an organizational system for content,
  emphasizing some data and diminishing others.» Hver scene har **én** førstefiolin.
- **Økonomi av signaler:** boka anbefaler **«no more than three cues for each
  level»**. For oss: maks tre virkemidler (størrelse + farge + plassering) per nivå.
- **Emphasis trenger bare ETT signal.** Italic er standard; alternativ er
  halvfet, KAPITÉLER eller fargeskift. **Aldri stable** fet + kursiv + understrek
  + caps – det er bokas «too many signals».
- Rangér alltid: 1) hovedbudskap, 2) støttetekst, 3) etikett/URL.

### 2.6 Skjerm-/web-bevissthet
Boka har egne kapitler om **Screen Fonts**, **Web Hierarchy** og **Web
Accessibility**. For video betyr det: nok kontrast, stor nok skrift til mobil,
og at budskapet bæres av typografien – **leselig uten lyd**.

---

## 3. GRID — orden i rommet (og i tiden)

Bokas tredje del: Golden Section, Single-Column, Multi-Column, **Modular Grid**,
Data Tables. Rutenettet er det usynlige skjelettet. I video har vi **to**: rom og tid.

### 3.1 Romlig rutenett
- Jobb i **1920×1080** (16:9) for nett/TV og **1080×1920** (9:16) for Reels/TikTok.
- Fast ytre marg: aldri tekst nærmere kant enn **~6 %** av bredden (≈120 px på 1920).
- Flere kolonner = mer fleksibelt; bruk dem til å lage **soner** for ulikt innhold.
- **Datum:** boka beskriver en horisontal referanselinje som elementer
  «gravitate towards». Det er nettopp det den gylne `DrawLine`-delelinjen vår skal
  være – en struktur å henge tekst på, ikke pynt.
- **«Not all the space has to be filled.»** Hvitrom er ikke tomrom; luft rundt
  logoen = opplevd verdi.

### 3.2 Tidsrutenett (rytme i bevegelse)
- **30 fps** standard. Tenk i beats, ikke enkeltframes.
- Noe skal *alltid* være i mild bevegelse (bakgrunn), men kun **én** ting i aktiv
  animasjon om gangen.
- Stagger inn elementer **3–6 frames** fra hverandre – samtidig innslag føles billig.
- **Inn raskt, ut rolig:** entré `easeOutExpo/Back` (~0.5–0.6 s), exit
  `easeInOutCubic` (~0.6–0.8 s).
- Hold hvert hovedbudskap **lesbart i minst 1,5–2 s** etter ferdig animert inn.

---

## 4. APPENDIX — tegnsetting på skjerm (små feil som ødelegger)

Bokas appendiks lister «type crimes» i tegnsetting. På store skjerm-titler
er disse feilene brutalt synlige. Reglene:

- **Em-dash (—)** for sterke grammatiske brudd. Aldri to bindestreker (`--`).
- **En-dash (–)** binder tall/intervall: «11–14», «2024–2025». Ikke bindestrek.
- **Bindestrek (-)** kun for sammensatte ord/orddeling.
- **Ekte anførselstegn** «...» / "..." (smart quotes) – **aldri** rette hatch-
  /primtegn (`"` `'`), som boka kaller «dumb quotes». Primtegn kun for tommer/fot.
- **Apostrof** er en lukkende enkel-quote (’), ikke et primtegn.
- **Ellipse** er ett tegn (…), ikke tre løse punktum.
- **Ett mellomrom** etter punktum, aldri to.

---

## 5. MOTION-SYSTEM — bevegelse som merkevare (Adobe + Material + boka)

Val Head sier det rett ut: bevegelse er merkevarekommunikasjon, *«just like
typography and color»*. Derfor får den et **system**, ikke tilfeldige innfall.
Material og boka enige: bevegelse skal **styre oppmerksomhet og uttrykke hierarki**.

### 5.1 NorLeads sine motion-prinsipper
Val Head: et godt motion-prinsipp skal være **objektivt** og «easy to say the
opposite of». Tre ord som styrer all NorLeads-bevegelse:

| Prinsipp | Betyr | Det motsatte (som vi unngår) |
|---|---|---|
| **Målrettet** | Hver bevegelse leder blikket til ett budskap. | Pynt-animasjon uten hensikt. |
| **Rolig-premium** | Glatt, kontrollert, dyrt – aldri stressende. | Sprett, blink, kaos. |
| **Sammenhengende** | Elementer henger sammen i tid og rom (logo-reisen, datum-linjen). | Kutt og hopp uten kontinuitet. |

Brukes som dommer: hvis en idé bryter med disse, redesign den eller dropp den.

### 5.2 Easing — tre kurver + én for emphasis
Val Head: bygg dine **egne** kurver (ikke CSS-default) for å skape «motion
equity». Tre kjernekurver – nøyaktig de vi allerede har i `src/utils/easing.ts`:

| Rolle | Kurve i koden | Når | Kilde-logikk |
|---|---|---|---|
| **Bring inn** (decelerate) | `easeOutExpo` | Elementer som kommer **inn** i bildet | Adobe «ease-out … natural way to bring objects into view» = Material deceleration |
| **Send ut** (accelerate) | `easeInOutCubic` (ut-halvdel) | Elementer som forlater bildet / fade til svart | Adobe «ease-in … reads well for moving an object out of view» = Material acceleration |
| **Punkt-til-punkt** | `easeInOutCubic` | Flytte noe fra A til B | Adobe «ease-in-out … best for moving elements from point to point» = Material standard curve |
| **Emphasis** (dramatisk) | `easeOutBack` | Logo-innslag, knapp, ett nøkkel-element | Adobe «easing hierarchy … one that is more dramatic» — *«just like with type»* |

Regel: **én emphasis-kurve per scene**, akkurat som ett emphasis-signal i tekst (§2.5).

### 5.3 Varighet — tokens (30 fps)
Adobe/Material: kort for smått/enkelt, langt for stort/komplekst. Som frames:

| Token | ms | frames @30 | Bruk |
|---|---|---|---|
| `dur-quick` | ~200 ms | 6 | Fade, fargeskift, små UI-detaljer |
| `dur-base` | ~300 ms | 9 | Standard inn-/ut-bevegelse (Material-standard) |
| `dur-entrance` | ~500–600 ms | 15–18 | Tekst/logo blur-inn, kort-glidning |
| `dur-exit` | ~600–800 ms | 18–24 | Rolig ut + sluttfade |
| `dur-count` | ~2,5 s | ~75 | Statistikk som teller opp |

Material-logikk vi følger: **inn er litt raskere enn man tror, ut er roligere**;
større flate/forflytning = lengre varighet; mindre skjerm (9:16 mobil) = stram inn.

### 5.4 Hva animerer vi (animatable properties)
Hold deg til billige, glatte egenskaper: `opacity`, `transform` (translate/scale),
`filter: blur`, og SVG `stroke-dasharray` (ringer/linjer som tegner seg). Unngå å
animere `width/height/top/left` på store elementer – det hakker.

### 5.5 Material-laget: hva bevegelsen skal *si*
- **Informative:** bevegelse viser relasjoner – hvor noe kom fra og hvor det går
  (logoen krymper *til* hjørnet, ikke bare forsvinner).
- **Focused:** led oppmerksomheten til én ting; ikke konkurrerende bevegelse.
- **Expressive:** her er merkevaren – glød, shimmer, puls – men dosert.

### 5.6 Matematikken — eksakte kurver og tokens (IBM Carbon, Apache-2.0)
Bevegelse skal være drevet av **tall**, ikke gjetning. Vi bruker Carbon sine
åpne (Apache-2.0) motion-tokens, løst med en ekte cubic-bézier-løser
(Newton–Raphson) i koden – ikke generiske CSS-defaults.

**Easing-kurver (cubic-bézier):**

| Rolle | Expressive (merkevare-øyeblikk) | Productive (UI/nytte) |
|---|---|---|
| Entré (decelerate) | `(0, 0, 0.3, 1)` | `(0, 0, 0.38, 0.9)` |
| Standard / flytt | `(0.4, 0.14, 0.3, 1)` | `(0.2, 0, 0.38, 0.9)` |
| Exit (accelerate) | `(0.4, 0.14, 1, 1)` | `(0.2, 0, 1, 0.9)` |

NorLeads-film = **expressive**. Entré = expressive-entrance, ut = expressive-exit,
flytt/hold = expressive-standard.

**Varighet-tokens (ms):** `fast-01` 70 · `fast-02` 110 · `moderate-01` 150 ·
`moderate-02` 240 · `slow-01` 400 · `slow-02` 700. Regel: **varighet skaler med
avstand/størrelse** – små UI-detaljer korte tokens, store hero-bevegelser ≈
`slow-02` × 1.5. Mindre skjerm (9:16) = stram inn ett steg.

**Spring (fjær-fysikk):** dempet harmonisk – `1 − e^(−d·p)·cos(f·π·p)` (d=demping,
f=frekvens). Brukes dosert på taktile pop (CTA-knapp, spark), aldri på brødtekst.

**Spacing-skala (8px-basis):** 2 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 ·
96 · 160 px. Alle marger/mellomrom skal være et token herfra.

**2x-rutenett:** 16 kolonner, 32 px (2rem) gutter. Layout legges på dette.

**Interpolasjon:** `lerp(a,b,t)=a+(b−a)·t`; map et område til et annet med
`(v−inMin)/(inMax−inMin)` før lerp. Baner med `sin/cos`, organisk drift med støy.

---

## 6. Bevegelse-spesifikke regler (NorLeads-husstil)

1. **Blur-inn:** tekst fra `blur(8px) → 0` + opacity + liten `translateY`. Aldri hard pop.
2. **Gull gløder, hvit ikke:** kun gull-elementer får glød/`text-shadow`. Hvit tekst får maks en myk mørk skygge for lesbarhet.
3. **Logo-reisen:** stor logo i intro → krymper til topp-venstre hjørne mellom seksjoner → returnerer stor i CTA. Logoen er den røde tråden.
4. **Tall teller opp:** statistikk animeres `0 → verdi` med `easeInOutCubic` over ~2,5 s, med en ring som tegner seg parallelt.
5. **Knapp lever:** CTA-knappen har et vandrende «shimmer»-høylys og en svak puls – aldri blink.
6. **Slutt rolig:** alltid `easeInOutCubic`-fade til `#000` siste ~1 s. Ikke kutt hardt.

---

## 7. Sjekkliste før vi publiserer

**Typografi**
- [ ] Maks to skriftfamilier (eller én familie med flere vekter); x-høyder i linje hvis blandet.
- [ ] Tydelig hierarki – én ting vinner, maks tre cues per nivå, kun **ett** emphasis-signal.
- [ ] Gull under ~10 % av flaten, ett fokus-gull per scene.
- [ ] Ingen tekst nærmere kant enn 6 %; elementer henger på en datum-linje.
- [ ] Versaler sperret, display-tall/logo knepet, brødtekst aldri sperret.
- [ ] Venstrejustert (ikke justert); auto-orddeling av.
- [ ] Riktige tegn: em/en-dash, smart quotes, ekte ellipse.

**Bevegelse**
- [ ] Hver bevegelse består «motstest» mot prinsippene (målrettet, rolig-premium, sammenhengende).
- [ ] Riktig easing-rolle: `easeOutExpo` inn, `easeInOutCubic` ut/punkt-til-punkt, `easeOutBack` kun emphasis.
- [ ] Én emphasis-bevegelse per scene; varighet fra token-tabellen (§5.3).
- [ ] Kun `opacity/transform/blur/stroke` animeres (ikke layout-egenskaper).
- [ ] Hvert hovedbudskap lesbart ≥1,5 s; kun én aktiv animasjon om gangen.
- [ ] Entré rask, exit rolig, slutt fader til svart.

**Generelt**
- [ ] Leselig uten lyd; fungerer i både 16:9 og 9:16.

---

*Kilder, alle lest og destillert:
Ellen Lupton, «Thinking with Type» (2004, OCR-lest i sin helhet);
Val Head, «Animation in Design Systems» (Adobe, 2019);
Google «Material Design – Understanding Motion».
Regelbok v3 — grunnlag for `.claude/skills/norleads-video`. Oppdater her, så følger skillen med.*
