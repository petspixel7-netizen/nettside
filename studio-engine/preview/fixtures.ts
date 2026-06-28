// Sample brands + storyboards for local rendering. Images are inline data-URIs
// (SVG) so the harness renders fully offline — no network needed to verify that
// text fits, images place correctly, and directions look different.

import type { Brand } from "../reel/directions/types";
import type { SceneRow } from "../reel/index";

function svg(a: string, b: string, label: string): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>
<rect width='1200' height='1200' fill='url(#g)'/>
<g fill='rgba(255,255,255,.10)'><circle cx='300' cy='340' r='220'/><circle cx='950' cy='820' r='300'/></g>
<text x='60' y='1140' font-family='sans-serif' font-size='44' fill='rgba(255,255,255,.55)'>${label}</text>
</svg>`;
  return "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
}
function logo(text: string, color: string): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='220'>
<rect width='600' height='220' fill='none'/>
<text x='300' y='130' text-anchor='middle' font-family='Georgia,serif' font-size='86' fill='${color}'>${text}</text>
<rect x='180' y='160' width='240' height='6' fill='${color}'/></svg>`;
  return "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
}

export interface Fixture {
  name: string;
  brand: Brand;
  scenes: SceneRow[];
  format: "16_9" | "9_16" | "1_1";
}

export const FIXTURES: Fixture[] = [
  {
    name: "fjordfin-hotel",
    format: "16_9",
    brand: {
      siteName: "Fjordfin",
      title: "Fjordfin Hotel & Spa",
      tagline: "Ro ved vannkanten",
      category: "hotel",
      colors: ["#c9a96a", "#11212b"],
      logo: logo("Fjordfin", "#c9a96a"),
      images: [
        svg("#2a4a5a", "#0c1a22", "Lobby"),
        svg("#6a5a3a", "#1a1208", "Suite med fjordutsikt"),
        svg("#3a5a4a", "#0c1a12", "Spa og basseng"),
        svg("#5a3a3a", "#1a0c0c", "Restaurant"),
      ],
    },
    scenes: [
      { title: "Fjordfin Hotel & Spa", body: "Ro ved vannkanten i hjertet av Vestlandet", animation_style: "logo", duration_ms: 3200 },
      { title: "Våkn opp til stillhet og fjord", body: "42 rom med panoramautsikt over fjorden, hvert med privat balkong.", animation_style: "hook", duration_ms: 3600, image_url: null },
      { title: "Spa, basseng, fjordsauna", body: "", animation_style: "grid", duration_ms: 3200 },
      { title: "4,8 av 5", body: "snitt fra 1 240 gjester", animation_style: "big-num", duration_ms: 2800 },
      { title: "Michelin-anbefalt kjøkken", body: "Råvarer fra egne leverandører, 12 minutter unna.", animation_style: "manifesto", duration_ms: 3400 },
      { title: "Book opphold på fjordfin.no", body: "Reserver nå", animation_style: "cta", duration_ms: 3000 },
    ],
  },
  {
    name: "nordlys-regnskap",
    format: "16_9",
    brand: {
      siteName: "Nordlys Regnskap",
      title: "Nordlys Regnskap AS",
      tagline: "Tall du kan stole på",
      category: "finance",
      colors: ["#2f6df0", "#0b1020"],
      logo: logo("Nordlys", "#2f6df0"),
      images: [],
    },
    scenes: [
      { title: "Nordlys Regnskap", body: "Autorisert regnskapsfører for små bedrifter", animation_style: "logo", duration_ms: 3000 },
      { title: "Slutt å bruke kvelder på bilag", body: "Vi tar regnskap, lønn og MVA — du driver firmaet.", animation_style: "hook", duration_ms: 3600 },
      { title: "Regnskap, Lønn, MVA, Årsoppgjør", body: "", animation_style: "zones", duration_ms: 3200 },
      { title: "320 bedrifter", body: "stoler på oss i Trøndelag", animation_style: "signal", duration_ms: 2800 },
      { title: "Fastpris fra 1 490 kr i måneden", body: "Ingen bindingstid, ingen overraskelser.", animation_style: "manifesto", duration_ms: 3400 },
      { title: "Få et tilbud i dag", body: "Bestill møte", animation_style: "cta", duration_ms: 3000 },
    ],
  },
  {
    name: "atelier-vo",
    format: "9_16",
    brand: {
      siteName: "Atelier V–Ø",
      title: "Atelier V–Ø Interiør",
      tagline: "Rom med karakter",
      category: "interior",
      colors: ["#9a3b2e", "#16110d"],
      logo: logo("V–Ø", "#9a3b2e"),
      images: [
        svg("#b8a890", "#5a4a38", "Stue i eik og lin"),
        svg("#8a7a6a", "#3a2e22", "Kjøkken på mål"),
        svg("#a89888", "#4a3e30", "Soverom"),
      ],
    },
    scenes: [
      { title: "Atelier V–Ø", body: "Interiørarkitektur fra Oslo", animation_style: "logo", duration_ms: 3000 },
      { title: "Rom som forteller din historie", body: "Vi tegner helheten — fra planløsning til siste detalj.", animation_style: "hook", duration_ms: 3600 },
      { title: "Eik, lin, naturstein", body: "", animation_style: "grid", duration_ms: 3000 },
      { title: "120 prosjekter", body: "fullført siden 2014", animation_style: "big-num", duration_ms: 2800 },
      { title: "Hvert rom skreddersys for lyset", body: "Vi tegner for hvordan du faktisk lever.", animation_style: "manifesto", duration_ms: 3400 },
      { title: "Se porteføljen på ateliervo.no", body: "Book befaring", animation_style: "cta", duration_ms: 3000 },
    ],
  },
];
