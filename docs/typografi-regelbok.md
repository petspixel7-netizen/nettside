# NorLeads – Typografi & Video-regelbok

> Regelboken for all video vi lager og legger ut på **norleads.no**.
> Prinsippene under er bygget på klassisk typografisk håndverk (inspirert av
> Ellen Luptons *Thinking with Type* sin inndeling **Bokstav → Tekst → Rutenett**),
> oversatt til **bevegelse** og tilpasset NorLeads sin merkevare.
>
> Formålet er enkelt: hver video skal se dyr, rolig og bevisst ut – aldri tilfeldig.

---

## 0. Merkevarekjernen (ikke til forhandling)

| Element | Verdi | Bruk |
|---|---|---|
| Bakgrunn | `#0D0D0D` | Nesten svart, aldri ren svart `#000` unntatt i sluttfade |
| Gull | `#D4AF37` | Aksent, aldri mer enn ~10 % av flaten |
| Lys gull | `#F0D060` | Glød, høylys, knapper |
| Hvit | `#FFFFFF` | Hovedtekst |
| Grå | `#888888` | Underordnet tekst, bildetekst |
| Display-skrift | Serif (Georgia / Times) | Logo, overskrifter – *autoritet* |
| Funksjonsskrift | Sans-serif | Etiketter, knapper, URL – *klarhet* |

**Regel:** Gull er krydder, ikke saus. Ett gull-element i fokus per scene.

---

## 1. BOKSTAV — formen på det minste

Typografi starter på bokstavnivå. Disse valgene avgjør om merkevaren føles
profesjonell før seeren rekker å lese et eneste ord.

### 1.1 Velg to skrifter, ikke fem
- **Én serif** for stemme/identitet (logo + overskrifter).
- **Én sans-serif** for funksjon (etiketter, knapp, URL, tall i UI).
- To er nok. Hver ekstra skrift må *fortjene* plassen sin.

### 1.2 Kontrast er kommunikasjon
Skap forskjell man kjenner umiddelbart – ikke nesten-like størrelser.
- Overskrift vs. brødtekst: minst **2×** i størrelse.
- Bruk én klar akse å variere på (størrelse, vekt **eller** farge), ikke alle tre samtidig på samme ord.

### 1.3 Vekt med vilje
- Logo og nøkkelord: tung vekt (700–900).
- Undertekst: lett til medium (300–500).
- Aldri fet brødtekst over flere linjer – det roper uten å si noe.

### 1.4 Versaler kun for korte etiketter
- STORE BOKSTAVER mister leselighet etter ~3 ord. Bruk dem til kicker/etikett
  (`ANIMASJONSVIDEOER SOM SELGER`), aldri til hele setninger.
- Versaler **trenger** sperring (se 2.3), ellers klistrer de seg sammen.

---

## 2. TEKST — ord satt i system

Når bokstavene blir til ord og linjer, handler det om rytme og lesbarhet.

### 2.1 Linjelengde (measure)
- Sikt på **45–75 tegn per linje** for brødtekst.
- I video betyr det: bryt lange setninger manuelt. En linje skal kunne leses i ett blikk.

### 2.2 Linjeavstand (leading)
- Brødtekst: linjehøyde **1.4–1.6×** skriftstørrelsen.
- Store display-overskrifter: stram inn til **1.0–1.15×** – luft mellom store linjer ser hullete ut.

### 2.3 Knip og sperr (kerning & tracking)
- Store display-tall og logo: **negativ** sperring (`letter-spacing: -1px`) for å binde formen sammen.
- Små versal-etiketter: **positiv** sperring (`letter-spacing: 4–8px`) for å puste.
- Aldri sperring på små gemene (vanlig brødtekst) – det ødelegger ordbildet.

### 2.4 Hierarki: én ting skal vinne
Hver scene har **én** førstefiolin. Rangér alt:
1. Hovedbudskap (størst, sterkest farge)
2. Støttetekst (mindre, hvit/grå)
3. Etikett / URL (minst, sperret, dempet)

Hvis seeren ikke vet hvor blikket skal hvile på 0,5 sekund – fjern eller demp noe.

### 2.5 Tekst-«forbrytelser» vi aldri begår
- Ingen kunstig strekk/klem av glyfer (`scaleX` på tekst).
- Ingen falsk fet/kursiv – bruk ekte skriftvekt/-snitt.
- Ingen midtstilte avsnitt på mer enn 2 linjer.
- Ingen tekst rett på et urolig bilde uten plate/skygge bak.
- Ingen «enker» (ett ensomt ord på siste linje) i en overskrift.

---

## 3. RUTENETT — orden i rommet (og i tiden)

Rutenettet er det usynlige skjelettet. I video har vi **to** rutenett: rom og tid.

### 3.1 Romlig rutenett
- Jobb i **1920×1080** (16:9) for nett/TV og **1080×1920** (9:16) for Reels/TikTok.
- Fast ytre marg: aldri tekst nærmere kanten enn **~6 %** av bredden (≈120 px på 1920).
- Plasser elementer på en optisk akse – venstrejustert kolonne eller ekte senter, ikke «cirka midten».
- Bruk en delelinje/regel (den gylne `DrawLine`) til å skille soner, ikke til pynt.

### 3.2 Hvitrom er ikke tomrom
- Luft rundt logoen = opplevd verdi. Ikke fyll hvert hjørne.
- Én tydelig figur mot rolig bakgrunn slår fem konkurrerende elementer hver gang.

### 3.3 Tidsrutenett (rytme i bevegelse)
- **30 fps** standard. Tenk i beats, ikke enkeltframes.
- Sceneanslag: noe skal *alltid* være i mild bevegelse (bakgrunn), men kun **én** ting i aktiv animasjon om gangen.
- Stagger inn elementer **3–6 frames** fra hverandre – samtidig innslag føles billig.
- **Inn raskt, ut rolig:** entré `easeOutExpo/Back` (~0.5–0.6 s), exit `easeInOutCubic` (~0.6–0.8 s).
- Hold hvert hovedbudskap **lesbart i minst 1,5–2 s** etter at det er ferdig animert inn.

---

## 4. Bevegelse-spesifikke regler (NorLeads-husstil)

1. **Blur-inn:** tekst kommer fra `blur(8px) → 0` samtidig som opacity og en liten `translateY`. Aldri hard «pop».
2. **Gull gløder, hvit ikke:** kun gull-elementer får `text-shadow`/glød. Hvit tekst får maks en myk mørk skygge for lesbarhet.
3. **Logo-reisen:** stor logo i intro → krymper til topp-venstre hjørne mellom seksjoner → returnerer stor i CTA. Logoen er den røde tråden.
4. **Tall teller opp:** statistikk animeres `0 → verdi` med `easeInOutCubic` over ~2,5 s, med en ring som tegner seg parallelt.
5. **Knapp lever:** CTA-knappen har et vandrende «shimmer»-høylys og en svak puls – men aldri blink.
6. **Slutt rolig:** alltid en `easeInOutCubic`-fade til `#000` de siste ~1 s. Ikke kutt hardt.

---

## 5. Sjekkliste før vi publiserer en video

- [ ] Maks to skriftfamilier i hele videoen.
- [ ] Tydelig hierarki i hver scene – én ting vinner.
- [ ] Gull utgjør under ~10 % av flaten, ett fokus-gull per scene.
- [ ] Ingen tekst nærmere kant enn 6 %.
- [ ] Versaler er sperret, display-tall er knepet.
- [ ] Hvert hovedbudskap er lesbart i ≥1,5 s.
- [ ] Kun én ting animerer aktivt om gangen (utenom bakgrunn).
- [ ] Entré rask, exit rolig, slutt fader til svart.
- [ ] Leselig også uten lyd (teksting/typografi bærer budskapet).
- [ ] Fungerer i både 16:9 og 9:16 (test marger).

---

*Regelbok v1 — grunnlag for `.claude/skills/norleads-video`. Oppdater her, så følger skillen med.*
