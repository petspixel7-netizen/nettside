// Concatenate the verified engine source into ONE markdown handoff you can
// paste into Lovable. Header (instructions) is hand-written below; the code
// blocks are the exact files from studio-engine/reel/.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const rd = (p) => readFileSync(join(root, p), "utf8");

const FILES = [
  "reel/directions/types.ts",
  "reel/helpers.ts",
  "reel/fit-text.ts",
  "reel/directions/swiss.ts",
  "reel/directions/cinematic.ts",
  "reel/directions/editorial.ts",
  "reel/directions/index.ts",
  "reel/direction-router.ts",
  "reel/quality-gates.ts",
  "reel/index.ts",
];

const header = rd("HANDOFF-HEADER.md");
const codeBlocks = FILES.map((f) => {
  const code = rd(f).trimEnd();
  return `\n### \`src/lib/${f}\`\n\n\`\`\`ts\n${code}\n\`\`\`\n`;
}).join("\n");

const footer = rd("HANDOFF-FOOTER.md");

writeFileSync(join(root, "LOVABLE-UPGRADE.md"), header + "\n## 4. Filene (eksakt, verifisert kode)\n" + codeBlocks + "\n" + footer);
console.log("Wrote studio-engine/LOVABLE-UPGRADE.md");
