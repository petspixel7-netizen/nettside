---
name: norleads-video
description: Lag NorLeads-merkevarevideoer (Remotion eller selvstendig HTML) som følger NorLeads sin typografi- og bevegelsesregelbok. Bruk denne når noen ber om å lage, redigere eller eksportere en reklame-/merkevarevideo for norleads.no, en HTML-videoforhåndsvisning, eller spør om NorLeads sin video-/typografi-husstil.
---

# NorLeads Video-skill (skillbok)

Du lager videoer for **NorLeads**, et norsk videoproduksjonsselskap. Videoene
legges ut på norleads.no og må se dyre, rolige og bevisste ut. Den fulle
regelboken ligger i `docs/typografi-regelbok.md` — les den ved tvil. Den er
destillert fra tre kilder: Ellen Lupton *Thinking with Type* (typografi),
Val Head *Animation in Design Systems* (Adobe) og Material *Understanding Motion*
(bevegelse). Under er det operative sammendraget.

## Når skal denne skillen brukes
- «Lag en (reklame)video for NorLeads / norleads.no»
- «Lag en HTML-versjon / forhåndsvisning av videoen» (ikke render mp4)
- «Endre fonten / fargen / teksten i NorLeads-videoen»
- Spørsmål om NorLeads sin video- eller typografi-husstil

## Merkevare-token (kopier eksakt)
```
bg        #0D0D0D   (aldri ren #000 før sluttfade)
gold      #D4AF37   (aksent, < 10 % av flaten, ett fokus per scene)
goldLight #F0D060   (glød / knapp)
white     #FFFFFF   (hovedtekst)
gray      #888888   (underordnet tekst)
display-font:  Georgia / serif   → logo + overskrifter
funksjons-font: sans-serif       → etiketter, knapp, URL
```

## De 10 reglene (følg alltid)
1. **Maks to skriftfamilier:** én serif (identitet), én sans-serif (funksjon).
2. **Hierarki:** én ting vinner per scene. Overskrift ≥ 2× brødtekst.
3. **Gull er krydder:** ett glødende gull-fokus per scene, under ~10 % flate.
4. **Sperring:** versal-etiketter `letter-spacing 4–8px`; display-tall/logo negativ (`-1px`).
5. **Leading:** brødtekst 1.4–1.6×; store overskrifter stramt 1.0–1.15×.
6. **Marger:** ingen tekst nærmere kant enn ~6 % (≈120 px på 1920).
7. **Blur-inn:** tekst fra `blur(8px)+translateY → 0`, aldri hard pop.
8. **Bevegelse:** kun én ting animerer aktivt om gangen (bakgrunn unntatt); stagger 3–6 frames; inn raskt (`easeOutExpo/Back`), ut rolig (`easeInOutCubic`).
9. **Lesetid:** hvert hovedbudskap lesbart ≥ 1,5–2 s ferdig animert.
10. **Slutt:** alltid myk `easeInOutCubic`-fade til `#000` siste ~1 s.

Unngå: strekk/klem av glyfer, falsk fet/kursiv, sperret brødtekst, midtstilt tekst > 2 linjer, tekst rett på urolig bilde uten plate, blinkende elementer, feil tegn (bruk em/en-dash, smart quotes, ekte ellipse …).

## Motion-system (Adobe + Material)
**Prinsipper (motstest):** Målrettet · Rolig-premium · Sammenhengende. Bryter en idé med disse → redesign eller dropp.

**Easing-roller** (kurvene finnes i `src/utils/easing.ts`):
- `easeOutExpo` → bring elementer **inn** (decelerate)
- `easeInOutCubic` → **ut** av bildet + punkt-til-punkt + sluttfade
- `easeOutBack` → **emphasis**, kun ett element per scene (logo/knapp)

**Varighet-tokens @30fps:** quick ~6f (fade) · base ~9f (standard inn/ut) · entrance ~15–18f (blur-inn) · exit ~18–24f (rolig ut) · count ~75f (tall teller opp). Inn litt raskere enn ut; mindre skjerm = stram inn.

**Animer kun** `opacity / transform / blur / stroke-dasharray` — aldri layout (width/top/left) på store elementer.

**Bevegelsen skal si noe (Material):** Informative (vis hvor noe kom fra/går), Focused (én ting om gangen), Expressive (gull-glød/shimmer/puls, dosert).

## Logo-reisen (den røde tråden)
Stor sentrert logo i intro → krymper til topp-venstre hjørne mellom seksjoner →
returnerer stor i CTA. `Nor` i hvitt, `Leads` i gull.

## Standard videostruktur (~16 s)
1. **Intro** – logo bygges bokstav-for-bokstav, delelinje tegnes, kicker blur-inn.
2. **Tjenester** – overskrift + tjenestekort som glir inn fra høyre, stagger.
3. **Statistikk** – tall teller opp i gull-ringer (`easeInOutCubic`, ~2,5 s).
4. **CTA** – logo returnerer, spørsmål i gull, levende knapp, `norleads.no`.
5. **Fade** til svart.

## To leveranseformer

### A) Remotion (rendret video i repoet)
- Komponenter ligger i `src/`. Tema i `src/theme.ts`, easing i `src/utils/easing.ts`.
- Registrer nye komposisjoner i `src/Root.tsx`. Eksempel: `NorLeadsAd.tsx`.
- 1920×1080 @ 30 fps for nett/TV; 1080×1920 for Reels/TikTok.
- Render kun når brukeren ber om det: `npx remotion render <Id> out/<navn>.mp4`.

### B) Selvstendig HTML-video (forhåndsvisning / «html link»)
Når brukeren vil ha en HTML-lenke og **ikke** vil rendre noe:
- Lag én selvstendig `.html`-fil i `videos/` med ren CSS-keyframe-animasjon (ingen byggesteg, ingen eksterne avhengigheter).
- Bruk en fast 16:9 (eller 9:16) `.stage` som skaleres responsivt; `loop` animasjonen så den spiller automatisk.
- Speil de samme tokenene, hierarkiet og bevegelsesreglene som over.
- Lever filen til brukeren (åpnes i nettleser). Ikke kjør Remotion-render.

## Sjekkliste før levering
- [ ] ≤ 2 skriftfamilier · tydelig hierarki · gull < 10 %
- [ ] Marger ≥ 6 % · versaler sperret · display-tall knepet
- [ ] Hvert budskap lesbart ≥ 1,5 s · kun én aktiv animasjon
- [ ] Inn raskt / ut rolig · fade til svart til slutt
- [ ] Leselig uten lyd · fungerer i 16:9 og 9:16
