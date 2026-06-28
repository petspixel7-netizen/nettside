# studio-engine

Oppgradert NorLeads ad-generator — drop-in for Lovable-prosjektets `src/lib/reel/`.

**Vil du bare gi det til Lovable?** → åpne [`LOVABLE-UPGRADE.md`](./LOVABLE-UPGRADE.md)
og lim hele inn i Lovable. Alt er der.

## Hva er dette

En ferdig, kjørende og skjermbilde-verifisert versjon av generator-motoren som løser
de tre problemene: tekst som sprenger boksen, «samme video hver gang», og manglende
kontroll. Se `LOVABLE-UPGRADE.md` seksjon 2 for detaljer.

```
reel/
  fit-text.ts            ← auto-fit tekst-motor (kjernefiksen)
  direction-router.ts    ← kategori + seed routing (ikke bare hash)
  quality-gates.ts       ← blokkerer floskler / repetisjon / manglende assets
  index.ts               ← composeReel: film-modus, ingen start-gate
  helpers.ts
  directions/
    types.ts             ← kontrakt: imageTreatment, Brand, seed
    index.ts             ← ekte registry, ingen falske fallback-slots
    swiss.ts             ← type-ledet (lys grid)
    cinematic.ts         ← bilde-ledet (full-bleed, Ken Burns, letterbox)
    editorial.ts         ← bilde-ledet (magasin, serif, krem papir)
  vendor/gsap.ts         ← GSAP 3.12.5 inline (Lovable har sin egen)
preview/                 ← LOKALT verktøy (ikke kopier til Lovable)
  fixtures.ts            ← 3 test-brands med innebygde bilder
  render.ts              ← rendrer filmer til out/
  shoot.ts              ← skjermbilder via Chromium
  build-handoff.mjs      ← bygger LOVABLE-UPGRADE.md
out/                     ← rendrede filmer (.html, F11-klare) + shots/
```

## Kjøre lokalt

```bash
# render alle fixtures til selvstendige HTML-filmer + quality-rapport
npx esbuild studio-engine/preview/render.ts --bundle --platform=node --format=esm \
  --outfile=studio-engine/out/_render.mjs && node studio-engine/out/_render.mjs

# skjermbilder av hver film i Chromium
npx esbuild studio-engine/preview/shoot.ts --bundle --platform=node --format=esm \
  --external:playwright-core --outfile=studio-engine/out/_shoot.mjs && node studio-engine/out/_shoot.mjs

# bygg Lovable-dokumentet på nytt
node studio-engine/preview/build-handoff.mjs
```

Åpne `out/*.html` direkte i nettleser og trykk F11 for å skjermopptak-eksportere
(eller bruk den medfølgende ffmpeg-veien senere for ekte MP4).
