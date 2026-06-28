---

## 5. Integrasjonsnotater

- **Brand-objektet:** retningene leser et lite `Brand`-grensesnitt (se `types.ts`):
  `siteName, title, tagline, category, colors[], logo, images[]`. Map din
  `BrandData`/`BrandIntelligence` inn i denne formen. Viktig: `images[]` skal være
  **ekte foto** (logoen ligger i `logo` separat) — routeren bruker `images.length`
  for å avgjøre om en bilde-ledet retning (cinematic/editorial) er aktuell.
- **`category`:** sett denne fra brand-intelligence (f.eks. «hotel», «finance»,
  «interior»). Routeren normaliserer norske synonymer (hotell, regnskap, eiendom …).
- **Kall:** `composeReel(brand, scenes, { format, mode: "film", seed?, forceDirectionId? })`.
  - `mode: "film"` → autoplay, ingen kontroller, `data-render-mode="film"` (F11-klar).
  - `mode: "loop-preview"` → samme, men looper (til storyboard-grid).
  - `forceDirectionId` → brukeren overstyrer i studio. `seed` → «reroll».
- **Reroll:** for å gi brukeren en variant, bump `seed` (f.eks. `seed + 1`) og
  komponer på nytt. Samme brand, ny look.
- **Quality-gate:** kjør `checkStoryboard(brand, scenes, facts)` før lagring og
  `checkFilmHtml(html, hasAssets)` før render. Hard-feil bør utløse **én**
  reparasjons-runde mot modellen (mat `errors` tilbake i prompten) — ikke bare
  avvis, så brukeren aldri står tomhendt.

## 6. Akseptansekriterier (alle verifisert i denne pakken)

- [x] `ALL_DIRECTIONS` har kun ekte moduler — ingen alias-fallback.
- [x] Søk i endelig HTML etter `start-gate` gir treff = 0.
- [x] Minst ett ekte bilde/logo i filmen når brand har assets.
- [x] To ulike bransjer gir synlig forskjellige layout-systemer (hotell→editorial,
      finans→swiss, interiør→cinematic), ikke bare ulike farger.
- [x] Quality-gaten blokkerer floskler («Din partner», «Neste nivå», «Kvalitet i fokus»).
- [x] Lang tittel sprenger ikke boksen — auto-fit skalerer (verifisert i Chromium).
- [x] Endelig film dekker viewport rent for valgt format, ingen scrollbar.

## 7. Neste retninger (samme mønster)

De tre i denne pakken (swiss, cinematic, editorial) dekker type-ledet + to
bilde-ledede looks. Legg til resten med nøyaktig samme kontrakt — én fil hver,
egne klasser prefikset med `id`, egen `treatmentFor`, alle 14 arketyper:

`brutalist` · `cyber` · `risograph` · `kinetic-type` · `aurora` · `minimal-jp`
· `data-viz` · `punk` · `retro-future`

Når en ny retning er ferdig: importer den i `directions/index.ts`, legg den i
`ALL_DIRECTIONS`, og legg id-en inn i riktig kategori i `direction-router.ts`
sin `CATEGORY_MAP`. Ingen andre endringer.

---

*Generert fra verifisert kjørende kode. Hver fil over er rendret og skjermbilde-testet
i Chromium før levering.*
