// Open each rendered film in Chromium and capture frames at several timestamps,
// so we can visually verify text fits its box, images place correctly, and the
// three directions look materially different. Output: studio-engine/out/shots/.

import { chromium } from "playwright-core";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out");
const shotDir = join(outDir, "shots");
mkdirSync(shotDir, { recursive: true });

const VIEWPORT: Record<string, { width: number; height: number }> = {
  "fjordfin-hotel": { width: 1280, height: 720 },
  "nordlys-regnskap": { width: 1280, height: 720 },
  "atelier-vo": { width: 720, height: 1280 },
};
const TIMES = [1500, 5200, 8800, 12200, 15600, 18600]; // ms into the timeline

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });
  const files = readdirSync(outDir).filter((f) => f.endsWith(".html") && f !== "index.html");
  for (const f of files) {
    const name = f.replace(/\.html$/, "");
    const vp = VIEWPORT[name] || { width: 1280, height: 720 };
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(join(outDir, f)).href, { waitUntil: "load", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(400); // let fit + fonts settle
    const start = Date.now();
    for (let i = 0; i < TIMES.length; i++) {
      const target = TIMES[i];
      const wait = target - (Date.now() - start);
      if (wait > 0) await page.waitForTimeout(wait);
      await page.screenshot({ path: join(shotDir, `${name}_${String(i + 1).padStart(2, "0")}.png`) });
    }
    await page.close();
    console.log(`shot ${name} (${TIMES.length} frames)`);
  }
  await browser.close();
  console.log(`\nWrote frames to studio-engine/out/shots/`);
}
main().catch((e) => { console.error(e); process.exit(1); });
