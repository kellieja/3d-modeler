// Flattens the rendered canvases into Adobe Express-friendly HTML.
// The Express importer does not resolve CSS custom properties or flex/grid
// layout reliably, so each slide is measured in Chromium and re-emitted as
// absolutely positioned boxes and text blocks with literal values.
//   node src/build-express.mjs   (run build-posts.mjs first)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "./browser.mjs";
import { SIZES } from "./templates.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "exports/canvas");
const out = join(root, "exports/express");
const ADOBE_FONTS = "https://use.typekit.net/hbp4vjr.css"; // Bricolage Grotesque, Figtree, IBM Plex Mono

const browser = await launch();
const page = await browser.newPage();

for (const size of Object.keys(SIZES)) {
  const { w, h } = SIZES[size];
  await page.setViewportSize({ width: w + 80, height: h + 80 });
  await page.goto("file://" + join(src, `karmacard-posts-${size}-${w}x${h}.html`));
  await page.evaluate(() => document.fonts.ready);

  const slides = await page.evaluate(() => {
    const FAMILY = (f) =>
      /Bricolage/i.test(f) ? "bricolage-grotesque" : /Plex/i.test(f) ? "ibm-plex-mono" : "figtree";
    const px = (v) => Math.round(parseFloat(v) * 100) / 100 + "px";
    const visible = (c) => c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c);
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

    const isTextLeaf = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "inline") return false;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    };
    // Re-creates the browser's line breaks (including text-wrap: balance) as
    // explicit <br>s, so Express can't re-wrap headlines differently.
    const lineHtml = (el, upper) => {
      const out = [];
      let lastTop = null;
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        const owner = n.parentElement;
        if (owner.closest(".kc-strike-line")) continue;
        const style = owner === el ? "" : `color:${getComputedStyle(owner).color};font-weight:${getComputedStyle(owner).fontWeight}`;
        let i = 0;
        for (const part of n.textContent.split(/(\s+)/)) {
          const start = i; i += part.length;
          if (!part) continue;
          if (/^\s+$/.test(part)) { out.push({ space: true }); continue; }
          const rg = document.createRange(); rg.setStart(n, start); rg.setEnd(n, i);
          const top = rg.getClientRects()[0]?.top ?? lastTop;
          const lh = parseFloat(getComputedStyle(el).fontSize) * 0.5;
          if (lastTop !== null && top - lastTop > lh) out.push({ br: true });
          lastTop = top;
          out.push({ text: esc(upper ? part.toUpperCase() : part), style });
        }
      }
      let html = "";
      out.forEach((t, k) => {
        if (t.br) { html = html.replace(/ $/, "") + "<br>"; return; }
        if (t.space) { if (html && !html.endsWith("<br>") && !(out[k + 1] && out[k + 1].br)) html += " "; return; }
        html += t.style ? `<span style="${t.style}">${t.text}</span>` : t.text;
      });
      return html;
    };

    return [...document.querySelectorAll(".slide")].map((slide) => {
      const o = slide.getBoundingClientRect();
      const items = [];
      const box = (r) => `left:${px(r.left - o.left)};top:${px(r.top - o.top)};width:${px(r.width)};height:${px(r.height)}`;
      const walk = (el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const bw = parseFloat(cs.borderTopWidth) || 0;
        const bg = cs.backgroundColor;
        const grad = cs.backgroundImage !== "none";
        if (el !== slide && (visible(bg) || grad || (bw && cs.borderTopStyle !== "none"))) {
          // A rotated element's bounding box is inflated; keep its real size around the same centre
          const fr = cs.transform === "none" ? r : (() => {
            const ww = el.offsetWidth, hh = el.offsetHeight;
            return { left: r.left + (r.width - ww) / 2, top: r.top + (r.height - hh) / 2, width: ww, height: hh };
          })();
          let style = `position:absolute;${box(fr)};border-radius:${cs.borderTopLeftRadius};opacity:${cs.opacity}`;
          if (visible(bg)) style += `;background:${bg}`;
          else if (grad && el.classList.contains("kc-photo")) style += ";background:#1B2D63";
          if (bw) style += `;border:${px(bw)} ${cs.borderTopStyle} ${cs.borderTopColor}`;
          if (cs.transform !== "none") style += `;transform:${cs.transform}`;
          if (!el.classList.contains("kc-hl")) items.push(`<div style="${style}"></div>`);
        }
        // Dashed rule under the receipt strip
        if (parseFloat(cs.borderBottomWidth) && !bw) {
          items.push(`<div style="position:absolute;left:${px(r.left - o.left)};top:${px(r.bottom - o.top - parseFloat(cs.borderBottomWidth))};width:${px(r.width)};height:0;border-top:${cs.borderBottomWidth} dashed ${cs.borderBottomColor}"></div>`);
        }
        if (isTextLeaf(el)) {
          // Marker highlight on Paper headlines: one band per line box
          el.querySelectorAll(".kc-hl").forEach((hl) => {
            if (getComputedStyle(hl).backgroundImage === "none") return;
            for (const lr of hl.getClientRects()) {
              items.push(`<div style="position:absolute;left:${px(lr.left - o.left)};top:${px(lr.top - o.top + lr.height * 0.58)};width:${px(lr.width)};height:${px(lr.height * 0.34)};background:rgba(232,180,74,.7)"></div>`);
            }
          });
          const upper = cs.textTransform === "uppercase";
          const pl = parseFloat(cs.paddingLeft), pt = parseFloat(cs.paddingTop);
          const pr = parseFloat(cs.paddingRight), pb = parseFloat(cs.paddingBottom);
          // Text box = content box, so pills keep their padding
          const tr = { left: r.left + pl + bw, top: r.top + pt + bw, width: r.width - pl - pr - 2 * bw + 6, height: r.height - pt - pb - 2 * bw };
          // In flex rows the text node sits after inline children (dot, rule); measure the text itself
          const range = document.createRange();
          const textNodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
          const blockKids = [...el.children].filter((c) => getComputedStyle(c).display !== "inline");
          if (blockKids.length && textNodes.length) {
            range.setStart(textNodes[0], 0);
            const last = textNodes[textNodes.length - 1];
            range.setEnd(last, last.length);
            const rr = range.getBoundingClientRect();
            Object.assign(tr, { left: rr.left, top: rr.top, width: rr.width + 6, height: rr.height });
          }
          const lh = cs.lineHeight === "normal" ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
          const html = blockKids.length ? textNodes.map((n) => esc(upper ? n.textContent.toUpperCase() : n.textContent)).join(" ").trim() : lineHtml(el, upper).trim();
          items.push(`<p style="position:absolute;margin:0;${box(tr)};font-family:${FAMILY(cs.fontFamily)};font-weight:${cs.fontWeight};font-size:${cs.fontSize};line-height:${px(lh)};letter-spacing:${cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing};color:${cs.color};text-align:${cs.textAlign === "start" ? "left" : cs.textAlign};white-space:nowrap;opacity:${cs.opacity}">${html}</p>`);
          for (const c of blockKids) walk(c);
          el.querySelectorAll(".kc-strike-line").forEach((ln) => walk(ln)); // drawn over the word
          return;
        }
        for (const c of el.children) walk(c);
      };
      walk(slide);
      const bg = getComputedStyle(slide).backgroundColor;
      return { bg, items };
    });
  });

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="hz:slide-selector" content=".slide">
<meta name="hz:canvas-width" content="${w}">
<meta name="hz:canvas-height" content="${h}">
<title>Karma Card Social Kit · ${SIZES[size].name}</title>
<link rel="stylesheet" href="${ADOBE_FONTS}">
<style>*{box-sizing:border-box}html,body{margin:0}.slide{position:relative;overflow:hidden;width:${w}px;height:${h}px}</style>
</head><body>
${slides.map((s) => `<section class="slide" data-canvas-width="${w}" data-canvas-height="${h}" style="background:${s.bg}">\n${s.items.join("\n")}\n</section>`).join("\n")}
</body></html>`;
  writeFileSync(join(out, `express-${size}-${w}x${h}.html`), html);
  console.log(size, slides.length, "slides,", html.length, "bytes");
}
await browser.close();
