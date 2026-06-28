# NorLeads-generator — oppgradering til Lovable

Dette dokumentet inneholder **alt** Lovable trenger for å oppgradere ad-generatoren
som allerede ligger i prosjektet. Koden under er **ferdig skrevet og verifisert** —
den er rendret i ekte Chromium på tre brands (hotell, finans, interiør) i to formater,
og bekreftet med skjermbilder: teksten passer i boksen i alle scener, ekte bilder
plasseres riktig, og de tre retningene ser materielt forskjellige ut.

Lim hele dette dokumentet inn i Lovable.

---

## 1. Lim dette inn i Lovable (instruksjon)

> Oppgrader NorLeads ad-generatoren med koden i dette dokumentet. Behold den
> isolerte direction-arkitekturen, men fullfør den ordentlig. Erstatt/legg til
> filene under nøyaktig som de står — de er ferdig testet.
>
> **Erstatt disse filene** med innholdet i seksjon 4:
> - `src/lib/reel/directions/types.ts` (utvidet kontrakt: `imageTreatment`, `Brand`, `seed`)
> - `src/lib/reel/helpers.ts`
> - `src/lib/reel/directions/index.ts` (ekte registry — **ingen falske fallback-slots**)
> - `src/lib/reel/index.ts` (`composeReel` i film-modus, uten start-gate)
>
> **Legg til disse nye filene** fra seksjon 4:
> - `src/lib/brand-intelligence.server.ts` ← **fikser «ingen bilder funnet»** (se seksjon 2.5)
> - `src/lib/reel/fit-text.ts` ← auto-fit-motor (kjernefiksen)
> - `src/lib/reel/direction-router.ts` ← kategori + seed-routing
> - `src/lib/reel/quality-gates.ts` ← kvalitetssjekk
> - `src/lib/reel/directions/cinematic.ts` ← ny bilde-ledet retning
> - `src/lib/reel/directions/editorial.ts` ← ny bilde-ledet retning
> - (oppgrader `src/lib/reel/directions/swiss.ts` med versjonen i seksjon 4)
>
> **Slett / fjern:**
> - `DIRECTION_SLOTS` med de 9 falske aliasene (erstattet av `direction-router.ts`)
> - `#start-gate`-overlayet og «Spill av»-knappen i den endelige filmen
> - `src/lib/reel/variation.ts` sin rolle som direction-velger (routeren overtar)
>
> **Behold uendret:** `src/lib/reel/vendor/gsap.ts` (din eksisterende GSAP-inline)
> og `src/lib/reel/scene-preview.ts` (men la den importere `routeDirection` i
> stedet for `pickDirection`).
>
> Etterpå: oppdater `auto-storyboard.functions.ts` til å bruke director-prompten
> i seksjon 3, og kjør quality-gaten (seksjon 4) før lagring.

---

## 2. Hva dette fikser (de tre klagene)

| Klage | Årsak i dagens kode | Fiks |
|---|---|---|
| **«Tekst er feilplassert / sprenger boksen»** | Faste gigant-fontstørrelser i `cqw` (swiss h1 `11cqw`, big `48cqw`) uten måling. | **`fit-text.ts`** måler hver `[data-fit]`-blokk og binær-søker største fontstørrelse som passer i begge akser. Kjører på boot, etter at web-fonter lastes, og ved resize. |
| **«Samme video hver gang»** | `pickDirection()` hashet kun `navn+farge` → samme brand fikk alltid samme look, og bare 3 ekte retninger fantes (9 slots var aliaser). | **`direction-router.ts`** velger på kategori + ekte assets + en **seed** som kan re-rolles. Registry har kun ekte retninger. Tre nye, ulike retninger lagt til. |
| **«Vil ha mer kontroll + se ut som studio»** | `style_overrides` ble ignorert; brukeren mistet alle knapper. | Routeren tar `forceDirectionId` og `seed` → studio kan la brukeren velge retning og «reroll». Film-modus er ren (F11-klar); studio beholder redigering. |

Pluss: bilder brukes nå **alltid** når de finnes (scene 1 = logo/hero, midt-scener =
miljø/produkt, CTA = logo-lockup), via `imageTreatment` per retning.

---

## 2.5. «Ingen bilder funnet fra nettsiden» — den egentlige rotårsaken

Testet mot **teck.com**: dagens skraper rapporterte «ingen bilder», men siden
leverer faktisk en `og:image`-logo + **62 `<img>`** (13 jpg / 7 webp foto) og
merkefarger i CSS-en. Bildene finnes — **ekstraksjonen** feiler. Ingen render-motor
kan redde en film som aldri får assets; en tom film ser verre ut enn før.

`brand-intelligence.server.ts` (seksjon 4) fikser dette. Den er ren string-parsing
(ingen DOM-lib, ingen nettverk) og er kjørt mot ekte teck.com-HTML med dette
resultatet:

```
businessName : Teck Resources Limited
category     : mining
colors       : #4b166d  #377283  #599dee     (gråtoner filtrert bort)
logos        : 4   (og:image + /media/logo-teck-…svg)
heroImages   : 10  (Qb2-2024-hero.png, 2025-Sustainability-Report.jpg, …)
cta          : Go to Investors
facts        : 14  (fra meta-description + h1/h2)
```

**Slik kobler du den inn:** behold din `scrape.server.ts` som henter rå HTML
(og gjerne teksten til hoved-CSS-bundlen). Send begge til
`extractBrandIntelligence(html, baseUrl, cssText)`. Map resultatet til `Brand`
som retningene bruker:

```ts
const bi = extractBrandIntelligence(html, url, cssText);
const brand: Brand = {
  siteName: bi.businessName.split(" ")[0],
  title: bi.businessName,
  category: bi.category,                       // → routeren velger retning
  colors: bi.assetInventory.colors,            // ekte merkefarger
  logo: bi.assetInventory.logos[0] ?? null,
  images: [                                    // ekte foto (ikke logo/ikoner)
    ...bi.assetInventory.heroImages,
    ...bi.assetInventory.productImages,
    ...bi.assetInventory.peopleImages,
  ],
};
```

Kjør deretter `bi.assetInventory`-URL-ene gjennom din eksisterende
`image-inline.ts` så filmen blir selvstendig. Viktig: hvis `images[]` er tom,
faller routeren automatisk tilbake til en typografi-ledet retning (swiss) —
aldri en tom foto-film.

> Hvis teck.com fortsatt gir 0 bilder etter dette, er det fordi den gamle
> skraperen kjører headless og time-er ut på en tung side. Et rått
> `fetch(url)` + `extractBrandIntelligence` er mer robust enn headless for de
> fleste markedssider.

---

## 3. Director-prompt for `auto-storyboard.functions.ts`

Bytt ut `buildSystemPrompt(...)` med denne (krever konkret brand-grunning, ikke floskler):

```text
Du er en senior reklamefilm-regissør og motion designer. Du lager korte
HTML-baserte reklamefilmer basert på ekte nettsidefunn. Svar KUN med gyldig JSON.

Du skal ikke lage generisk reklamespråk. Hver scene må bygge på konkrete fakta,
tilbud, tjenester, sted, bilder eller proof points fra brand-briefen.

Du får en tvungen arketype-rekkefølge. Bruk den, men gi hver scene en tydelig rolle.

For hver scene returner:
- archetype   (logo|hook|kinetic|manifesto|chaos|pipeline|grid|rings|big-num|zones|trust|cta|signal|mono-draw)
- title       (maks 55 tegn)
- body        (maks 130 tegn)
- intent      (kort: hva scenen skal oppnå)
- image_role  (logo|hero|product|environment|people|none)
- image_index (0-indeksert peker til brand.images[], utelat hvis ingen passer)
- layout_hint (kort frihint, retningen bestemmer det visuelle)
- motion_hint (kort frihint)
- duration_ms

Regler:
- ikke bruk floskler som «Neste nivå», «Din partner», «Kvalitet i fokus»
- bruk samme språk som merkevaren
- minst 70 % av scenene skal referere konkrete brand-fakta
- bruk image_index når et bilde styrker scenen
- CTA må matche nettsidens faktiske CTA hvis den finnes
```

`title`/`body` kan trygt være lengre enn før — **auto-fit skalerer dem ned** så de
alltid passer. Men hold dem korte for best slagkraft.
