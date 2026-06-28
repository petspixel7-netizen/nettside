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
