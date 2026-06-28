// Proof: run the extractor against real teck.com HTML + CSS saved to scratchpad.
import { readFileSync } from "node:fs";
import { extractBrandIntelligence } from "./brand-intelligence";

const DIR = "/tmp/claude-0/-home-user-nettside/3e7e9d3a-d0e2-5e4e-aef1-76c0bc135897/scratchpad";
const html = readFileSync(`${DIR}/teck.html`, "utf8");
const css = readFileSync(`${DIR}/teck-base.css`, "utf8");

const bi = extractBrandIntelligence(html, "https://www.teck.com/", css);

console.log("businessName :", bi.businessName);
console.log("category     :", bi.category);
console.log("cta          :", bi.cta || "(none)");
console.log("colors       :", bi.assetInventory.colors.join("  "));
console.log("logos        :", bi.assetInventory.logos.length);
bi.assetInventory.logos.forEach((l) => console.log("   ◦", l));
console.log("heroImages   :", bi.assetInventory.heroImages.length);
bi.assetInventory.heroImages.slice(0, 4).forEach((l) => console.log("   ◦", l));
console.log("productImages:", bi.assetInventory.productImages.length);
console.log("peopleImages :", bi.assetInventory.peopleImages.length);
console.log("description  :", bi.description.slice(0, 140));
console.log("facts        :", bi.sourceFacts.length);
bi.sourceFacts.slice(0, 6).forEach((f) => console.log("   •", f));
