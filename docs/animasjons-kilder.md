# NorLeads — Animasjons-kilder (arsenal)

Faste kilder vi henter fra til videoene. **Regel:** bruk kun lisensene
**MIT · Apache-2.0 · OFL · CC0 · ISC** = utvilsomt gratis for kommersiell bruk.
Unngå alt merket «non-commercial», «personal use» eller uten tydelig lisens.

> Arbeidsflyt: statisk kode (CSS/JS/SVG/GitHub-raw) hentes og inlines direkte i
> HTML-en. JS-tunge galleri leses via GitHub-repoet — vi lager vår egen versjon
> og bytter deres farger til NorLeads-paletten (lime/pink/cyan/orange/violet).
> Lottie/Rive-filer: **sjekk lisens per fil** før bruk.

---

## 1. Animasjons-motorer (inlines i fila)
| Verktøy | Lisens | Bruk |
|---|---|---|
| **GSAP** (gsap.com) | Gratis, også kommersielt (alle plugins) | Tidslinjer, easing, stagger — hovedmotoren vår |
| **Motion** (motion.dev) | MIT | Spring/fysikk, deklarativ animasjon |
| **anime.js** | MIT | Lett, liten, enkel keyframing |

## 2. Komponent-galleri (kopier kode → omfarg)
| Kilde | Lisens | Hva vi henter |
|---|---|---|
| **Magic UI** (magicui.design) | MIT | Border-beam, shimmer, marquee, animated number, blur-in |
| **Aceternity UI** (ui.aceternity.com) | Gratis copy-paste | Aurora, spotlight, 3D-kort, bakgrunner |
| **Cult UI** (cult-ui.com) | MIT | Dynamic island, texture, morph, text-animate |
| **shadcn/ui** (ui.shadcn.com) | MIT | Base-komponenter |
| **HyperUI** (hyperui.dev) | MIT | Tailwind-komponenter |

## 3. Ferdige bevegelses-filer (hent + omfarg)
| Kilde | Lisens | Merknad |
|---|---|---|
| **LottieFiles** | `lottie-web` = MIT; **per-fil varierer** | JSON kan omfarges; sjekk hver animasjons lisens |
| **Rive** community | Runtime gratis; **per-fil varierer** | Interaktive state-machines |

## 4. Ikoner / SVG (alle omfargbare)
| Kilde | Lisens |
|---|---|
| **Lucide** | ISC |
| **Tabler Icons** | MIT |
| **Phosphor Icons** | MIT |
| **Heroicons** | MIT |

## 5. Bakgrunner / gradienter / tokens
| Kilde | Lisens | Bruk |
|---|---|---|
| **Haikei** (haikei.app) | Gratis-eksport | SVG blobs, bølger, mesh-gradienter |
| **Hero Patterns** | CC0/MIT | Sømløse SVG-mønstre |
| **Open Props** | MIT | Ferdige design-tokens (easing, skygger, farger) |
| **Radix Colors / Tailwind-palett** | MIT | Fargesystemer |

## 6. Font, farge & matematikk (allerede i bruk)
| Kilde | Lisens | Status |
|---|---|---|
| **Google Fonts** | OFL / Apache-2.0 | Inter, Space Grotesk, Big Shoulders — inlinet |
| **easings.net** (Penner) | Public domain | Easing-likninger |
| **IBM Carbon** motion/spacing | Apache-2.0 | I `brand/motion-tokens.css` |
| **Material Design** motion | Apache-2.0 | I `brand/motion-tokens.css` |

---

## Sjekkliste før vi tar inn noe nytt
- [ ] Lisensen er MIT / Apache-2.0 / OFL / CC0 / ISC (ikke «non-commercial»).
- [ ] Noter kilde + lisens i commit-meldingen.
- [ ] Bytt deres farger til NorLeads-paletten (`brand/motion-tokens.css`).
- [ ] Inline koden (selvstendig HTML) — ingen eksterne nettverkskall under opptak.
- [ ] Lottie/Rive: lagre lisensbevis for den spesifikke fila.

*Oppdater denne lista når vi finner nye, godkjente kilder.*
