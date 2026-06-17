# Animasjons-verktøykasse (lokal)

Alle bibliotekene her er **gratis / open-source** og lastet ned lokalt, så prosjekter
fungerer uten CDN/nett. Inkluder dem med vanlig `<script src="vendor/anim/...">`.

## Innhold

### GSAP 3.13 (kjernen — bruk denne til 95% av alt)
GSAP er bransjestandarden for tidslinje-styrt motion. Siden Webflow kjøpte GreenSock
er **ALLE plugins gratis** (var tidligere betalt "Club GreenSock").

| Fil | Hva den gjør | Når du bruker den |
|-----|--------------|-------------------|
| `gsap.min.js` | Kjernen: `gsap.to/from/timeline/set`, easing, stagger | Alltid |
| `DrawSVGPlugin.min.js` | Tegner SVG-streker (mye enklere enn manuell dashoffset) | Logo-tegning, linjer |
| `MorphSVGPlugin.min.js` | Morfer én SVG-form til en annen | Form A → form B, logo-transformasjon |
| `MotionPathPlugin.min.js` | Beveger element langs en SVG-bane | Objekt følger kurve |
| `SplitText.min.js` | Splitter tekst i tegn/ord/linjer for animasjon | Kinetisk typografi |
| `ScrollTrigger.min.js` | Animasjon koblet til scroll | Nettsider (ikke promo-loop) |
| `Flip.min.js` | Animerer mellom to layout-tilstander automatisk | Galleri/grid-overganger |
| `Physics2DPlugin.min.js` | Hastighet/gravitasjon/friksjon på elementer | Partikkel-sprut, konfetti |
| `TextPlugin.min.js` | "Skriver ut" tekst tegn for tegn | Terminal/typewriter-effekt |

### Andre biblioteker
| Fil | Hva | Lisens |
|-----|-----|--------|
| `anime.min.js` | Lett alternativ til GSAP, fin syntaks | MIT |
| `motion.min.js` | Motion One — bruker native Web Animations API, veldig liten | MIT |
| `lottie.min.js` | Spiller av After Effects-animasjoner eksportert som JSON | MIT |
| `three.min.js` | 3D / WebGL — 3D-logoer, shaders, partikkelfelt i rommet | MIT |
| `pixi.min.js` | Rask 2D WebGL-rendering — tusenvis av partikler, filtre | MIT |
| `matter.min.js` | 2D fysikk-motor — kollisjon, tyngdekraft, kjeder | MIT |
| `tsparticles.*.min.js` | Moderne partikkel-nettverk (konstellasjon-effekt) | MIT |
| `splitting.min.js` | Tekst/grid-splitting for CSS-drevne tekst-effekter | MIT |
| `confetti.browser.js` | Konfetti på én linje | ISC |

## Leveringsformater til kunde
- **HTML (denne tilnærmingen):** knivskarpt, lite, redigerbart live. Best for nett/skjerm.
- **Lottie JSON:** lag i After Effects + Bodymovin, spill av med `lottie.min.js`. Liten fil, vektor, brukes i apper.
- **MP4 / WebM:** render HTML-en med Playwright/ffmpeg når kunden trenger video (e-post, sosiale medier, der HTML ikke kjører).
- **Animert SVG/GIF:** kun for enkle ting; GIF er stor og lavkvalitet — unngå for premium.

## "Dyre vs amatør" — det viktigste prinsippet
Det som skiller proff motion fra amatør er **timing og easing**, ikke effekter:
- Aldri lineær bevegelse (unntatt konstant rotasjon/flyt). Bruk `power2/power3.inOut`.
- **Overlapp og stagger:** ting starter før det forrige er ferdig (`-=0.3` i tidslinje, eller `stagger`).
- **Anticipation + follow-through:** liten motbevegelse før, lite oversving etter (`back.out`).
- **Færre, sammenhengende bevegelser** slår mange tilfeldige effekter. Hver bevegelse skal ha en grunn.
- **Hold-frames:** la sluttbildet puste i 1–2 sek før loop/fade.
- Konsistent fargepalett + korn/grain-overlay + vignett = filmatisk dybde.
