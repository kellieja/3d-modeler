// Builds one self-contained HTML file per size (the Adobe Express import
// source) and renders every canvas to PNG.
//   node src/build-posts.mjs            -> HTML + PNGs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "./browser.mjs";
import { SIZES, ORDER, render } from "./templates.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "src/kit.css"), "utf8");
export const FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600&family=Figtree:wght@400;500;600;700&display=swap";

const outHtml = join(root, "exports/canvas");
const outPng = join(root, "exports/png");
mkdirSync(outHtml, { recursive: true });
mkdirSync(outPng, { recursive: true });

const page = (size, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="hz:slide-selector" content=".slide">
<meta name="hz:canvas-width" content="${SIZES[size].w}">
<meta name="hz:canvas-height" content="${SIZES[size].h}">
<title>Karma Card Social Kit · ${SIZES[size].name}</title>
<link rel="stylesheet" href="${FONTS}">
<style>${css}
html,body{margin:0;background:#0b1430}
body{display:flex;flex-direction:column;align-items:flex-start;gap:40px;padding:40px}
</style></head><body>
${body}
</body></html>`;

for (const size of Object.keys(SIZES)) {
  const body = ORDER.map(([tpl]) => render(tpl, size)).join("\n");
  writeFileSync(join(outHtml, `karmacard-posts-${size}-${SIZES[size].w}x${SIZES[size].h}.html`), page(size, body));
}

// ---- PNG renders --------------------------------------------------------
const browser = await launch();
const ctx = await browser.newContext({ ignoreHTTPSErrors: false });
const pg = await ctx.newPage();
for (const size of Object.keys(SIZES)) {
  const { w, h } = SIZES[size];
  await pg.setViewportSize({ width: w + 80, height: h + 80 });
  await pg.goto("file://" + join(outHtml, `karmacard-posts-${size}-${w}x${h}.html`));
  await pg.evaluate(() => document.fonts.ready);
  const els = await pg.$$(".slide");
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: join(outPng, `${String(i + 1).padStart(2, "0")}-${ORDER[i][0]}-${size}.png`) });
  }
}
await browser.close();
console.log("built posts + PNGs");
