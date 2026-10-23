// Builds the style guide (index.html), its published-artifact variant, and
// the PDF spec.   node src/build-guide.mjs [artifactOutPath]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "./browser.mjs";
import { SIZES, render } from "./templates.mjs";
import { FONTS_URL, GUIDE_CSS } from "./guide-style.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kitCss = readFileSync(join(root, "src/kit.css"), "utf8");

// ---- Content ------------------------------------------------------------
const palette = [
  ["Vault", "#12204A", "--kc-vault", "Primary ink. Dark backgrounds for carousels, announcements, promotions.", "light"],
  ["Paper", "#F2F4F8", "--kc-paper", "Light backgrounds for tips, carousel steps and testimonials.", "dark"],
  ["Karma Gold", "#E8B44A", "--kc-gold", "The Karma Ring, highlights, CTAs on Vault, quote backgrounds.", "dark"],
  ["Settle Teal", "#12806F", "--kc-teal", "Labels and accents on Paper only. Never on Vault.", "light"],
  ["Slate", "#56618A", "--kc-slate", "Secondary text on Paper.", "light"],
  ["Mist", "#AFB8D6", "--kc-mist", "Secondary text on Vault.", "dark"],
  ["Decline Coral", "#D9583F", "--kc-coral", "Strike-through on the word “declined” and sample tags. Nothing else.", "light"],
];

const typeRows = [
  ["Display", "Bricolage Grotesque 800", "70", "112", "124", "0.96", "−3.5%", "One per post. The hook."],
  ["H1", "Bricolage Grotesque 700", "56", "84", "92", "1.0", "−3%", "Headline when Display isn't used"],
  ["H2", "Bricolage Grotesque 700", "36", "54", "58", "1.06", "−2%", "Testimonial quote, sub-heads"],
  ["Body", "Figtree 500", "23", "34", "38", "1.38", "0", "Max 2–3 lines, 19em measure"],
  ["Label", "IBM Plex Mono 600 caps", "16", "22", "24", "1.2", "+14%", "Receipt strip, eyebrows, meta"],
  ["Micro", "Figtree 500", "13", "18", "20", "1.35", "0", "Legal & disclaimers only"],
];

const gridRows = [
  ["L · 1200×630", "56", "40 / 36", "22", "Keep text in the left 60%. FB crops nothing, but IG shows it at 1.91:1 small."],
  ["P · 1080×1350", "80", "64 / 56", "32", "IG grid previews the centre 1080×1080: keep the hook between y 135–1215."],
  ["S · 1080×1920", "88", "220 / 300", "36", "Top 220 px and bottom 300 px sit under Story UI. Nothing readable there."],
];

const templates = [
  {
    key: "tip", name: "Educational tip", pillar: "Tips", mode: "Paper",
    when: "Weekly how-to nuggets: chargebacks, descriptors, PCI, reserves, documentation.",
    hierarchy: ["Receipt strip: TIP · ### + “Merchant tip” chip", "Tip number in Display size, Settle Teal", "Eyebrow (topic, mono caps)", "H1 headline with one gold highlight", "Body: one or two sentences", "Footer: “Save this for later ↓”"],
    limits: "Headline ≤ 55 characters · body ≤ 140 · one highlight per headline",
    image: "No photo. The number is the visual.",
  },
  {
    key: "cover", name: "Carousel cover", pillar: "Tutorials", mode: "Vault",
    when: "Opens every multi-slide tutorial or checklist. Always followed by step slides and a closing CTA.",
    hierarchy: ["Strip: GUIDE · ### + “N steps” chip", "Content bottom-aligned (thumb-stopping weight sits low)", "Eyebrow → Display headline (gold highlight on the promise)", "One-line body, then “Swipe to start →”", "Progress dots in footer: first dot is the long gold pill"],
    limits: "Headline ≤ 45 characters · 3–8 steps · 1080×1350 for IG carousels",
    image: "No photo. Optional: swap the ring for a product screenshot cropped at the same corner.",
  },
  {
    key: "step", name: "Carousel step", pillar: "Tutorials", mode: "Paper",
    when: "One idea per slide. Repeat the layout; only the number, headline, body and checklist change.",
    hierarchy: ["Strip chip: “Step N of N”", "Big step number (Display, Vault) + mono “STEP” label", "H1 action headline (starts with a verb)", "Body: why it matters", "Checklist: up to 4 ✓ items", "Dots: current step highlighted in teal"],
    limits: "Headline ≤ 40 characters · ≤ 4 checklist items, ≤ 32 characters each · no Karma Ring (keeps slides calm)",
    image: "None. Use a screenshot only when the step is about a form or dashboard.",
  },
  {
    key: "cta", name: "Carousel closing CTA", pillar: "Tutorials", mode: "Vault",
    when: "Last slide of every carousel. The only carousel slide with a button.",
    hierarchy: ["Strip chip: “Next step”", "Eyebrow → Display headline", "Body with the response-time promise", "Gold pill CTA with URL", "Dots: last dot active"],
    limits: "One CTA only · button text ≤ 32 characters",
    image: "None.",
  },
  {
    key: "quote", name: "Quote", pillar: "Quotes", mode: "Gold",
    when: "Brand point of view, founder notes, industry insight. Max one in every six posts so gold stays special.",
    hierarchy: ["Strip: NOTE · ### + chip (“From our team”)", "Oversized white quote mark", "H1 quote text, Vault", "Attribution with rule, mono caps", "White Karma Ring"],
    limits: "Quote ≤ 90 characters · attribute only real people who approved the wording, otherwise “The Karma Card team”",
    image: "No photo. Optional 1:1 headshot can replace the quote mark.",
  },
  {
    key: "announce", name: "Announcement", pillar: "Promotions / news", mode: "Vault",
    when: "New industry pages, new payment methods, office hours, events, partner news.",
    hierarchy: ["Strip chip: status (“Now onboarding”, “New”, “Event”)", "Eyebrow → Display headline", "Body: what it means for the merchant", "Meta row: up to 3 gold facts", "Photo panel (right on L, below on P/S)"],
    limits: "Headline ≤ 50 characters · 3 meta facts, ≤ 20 characters each",
    image: "Photo slot: L 5:6 right half · P full width, flexible height · S 560 px tall. Duotone Vault overlay 20–35%.",
  },
  {
    key: "testimonial", name: "Testimonial", pillar: "Social proof", mode: "Paper",
    when: "Merchant reviews and case results, only with written permission from the merchant.",
    hierarchy: ["Strip: REVIEW · ### + “Merchant story” chip", "Five gold stars only if the review gave five stars", "H2 quote in quotation marks", "Round 1:1 photo + name + industry/city"],
    limits: "Quote ≤ 120 characters · first name + last initial · never invent or edit a review's meaning",
    image: "Round 1:1 headshot or storefront. Real customer photos only, no stock faces.",
  },
  {
    key: "promo", name: "Promotion", pillar: "Promotions", mode: "Vault",
    when: "Fee offers, switch-over campaigns, seasonal pushes.",
    hierarchy: ["Strip chip: urgency (“Limited time”, “This month”)", "Eyebrow → Display headline (the Declined strike is the signature move)", "Gold CTA pill", "Offer coupon: dashed gold border, big gold figure", "Legal line above footer (required)"],
    limits: "Offer figure ≤ 10 characters · legal line always present · end dates stated in caption",
    image: "No photo. The coupon is the visual.",
  },
];

const pillars = [
  ["Tips", "Educational tip", "Paper", "2× / week", "Build trust: show you know underwriting better than anyone."],
  ["Tutorials", "Carousel (cover → steps → CTA)", "Vault + Paper", "1× / week", "Saves and shares. The highest-value post type."],
  ["Quotes", "Quote", "Gold", "1× / week", "Point of view. Reassure merchants who've been declined."],
  ["Promotions", "Promotion, Announcement", "Vault", "2× / month", "Drive applications. Always carries the legal line."],
  ["Social proof", "Testimonial", "Paper", "2× / month", "Real merchants, real permission."],
];

// ---- Helpers ------------------------------------------------------------
const frame = (tpl, size) =>
  `<figure class="g-frame g-${size}"><div class="g-canvas">${render(tpl, size)}</div><figcaption>${size} · ${SIZES[size].w}×${SIZES[size].h}</figcaption></figure>`;

const section = (id, kicker, title, body) =>
  `<section class="g-sec" id="${id}"><div class="g-head"><p class="g-kicker">${kicker}</p><h2>${title}</h2></div>${body}</section>`;

// ---- Page ---------------------------------------------------------------
const body = `
<header class="g-hero">
  <div class="g-wrap">
    <p class="g-kicker">Karma Card Payments · Social design kit · v1.0</p>
    <h1>Every post reads like a <span>receipt.</span></h1>
    <p class="g-lede">A repeatable system for Facebook and Instagram, written for high-risk merchants who've heard “no” before. Eight layouts, three sizes each, one set of rules. Swap the copy, keep the structure.</p>
    <nav class="g-toc" aria-label="Sections">
      <a href="#foundations">Foundations</a><a href="#grid">Grid &amp; sizes</a><a href="#elements">Brand elements</a><a href="#pillars">Content pillars</a><a href="#templates">Templates</a><a href="#imagery">Imagery</a><a href="#compliance">Compliance</a><a href="#checklist">Checklist</a>
    </nav>
  </div>
</header>
<main class="g-wrap">
${section("foundations", "01 · Foundations", "Colour and type", `
  <p class="g-note">The site couldn't be read from this build environment, so these colours and fonts are a proposed system. Every value is a token in <code>src/kit.css</code>; change it there and all 24 canvases update.</p>
  <div class="g-swatches">${palette.map(([n, hex, tok, role, ink]) => `
    <div class="g-sw"><div class="g-chip ink-${ink}" style="background:${hex}"><span>${hex}</span></div>
    <div class="g-swtext"><strong>${n}</strong><code>${tok}</code><p>${role}</p></div></div>`).join("")}
  </div>
  <h3>Colour modes</h3>
  <div class="g-modes">
    <div class="g-mode" style="background:#F2F4F8;color:#12204A"><strong>Paper</strong><span>Tips · Steps · Testimonials</span><em style="color:#12806F">Accent: Settle Teal</em></div>
    <div class="g-mode" style="background:#12204A;color:#fff"><strong>Vault</strong><span>Covers · CTAs · Announcements · Promos</span><em style="color:#E8B44A">Accent: Karma Gold</em></div>
    <div class="g-mode" style="background:#E8B44A;color:#12204A"><strong>Gold</strong><span>Quotes only</span><em>Accent: White ring</em></div>
  </div>
  <p class="g-note">Feed rhythm: never post two Gold posts in a row; alternate Paper and Vault so the grid reads as a checkerboard.</p>
  <h3>Type scale</h3>
  <div class="g-table"><table>
    <thead><tr><th>Role</th><th>Face</th><th class="n">L px</th><th class="n">P px</th><th class="n">S px</th><th class="n">Leading</th><th class="n">Tracking</th><th>Use</th></tr></thead>
    <tbody>${typeRows.map((r) => `<tr>${r.map((c, i) => `<td class="${i >= 2 && i <= 6 ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>
  <div class="g-specimen">
    <p style="font-family:var(--kc-display);font-weight:800;font-size:clamp(40px,7vw,72px);letter-spacing:-.035em;line-height:.95;margin:0">Declined before?</p>
    <p style="font-family:var(--kc-body);font-weight:500;font-size:20px;margin:0;color:var(--g-sub)">Figtree carries the explanation: plain, calm, readable at phone size.</p>
    <p style="font-family:var(--kc-mono);font-weight:600;font-size:14px;letter-spacing:.14em;text-transform:uppercase;margin:0;color:var(--g-accent)">IBM Plex Mono · receipt labels · TIP · 014</p>
  </div>
`)}
${section("grid", "02 · Grid & sizes", "Three canvases, one structure", `
  <p>Every canvas stacks the same four zones: <strong>receipt strip</strong>, <strong>message</strong>, <strong>legal line</strong> (promotions only), <strong>settlement footer</strong>. Landscape puts the message in two columns; portrait and story stack it.</p>
  <div class="g-table"><table>
    <thead><tr><th>Size</th><th class="n">Side margin</th><th class="n">Top / bottom</th><th class="n">Gap unit</th><th>Safe-zone rule</th></tr></thead>
    <tbody>${gridRows.map((r) => `<tr>${r.map((c, i) => `<td class="${i >= 1 && i <= 3 ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>
  <div class="g-zones">
    ${["L", "P", "S"].map((s) => {
      const { w, h } = SIZES[s];
      const z = { L: [40, 36, 56], P: [64, 56, 80], S: [220, 300, 88] }[s];
      return `<figure class="g-zone" style="aspect-ratio:${w}/${h}">
        <div class="z-top" style="height:${(z[0] / h) * 100}%"></div>
        <div class="z-bot" style="height:${(z[1] / h) * 100}%"></div>
        <div class="z-safe" style="top:${(z[0] / h) * 100}%;bottom:${(z[1] / h) * 100}%;left:${(z[2] / w) * 100}%;right:${(z[2] / w) * 100}%"><span>Live area</span></div>
        <figcaption>${s} · ${w}×${h}</figcaption></figure>`;
    }).join("")}
  </div>
  <p class="g-note">Spacing uses one gap unit per size (22 / 32 / 36 px). Elements inside the message zone are separated by 1 gap; the strip's dashed rule sits 0.6 gap below its labels; checklists use 0.5 gap.</p>
`)}
${section("elements", "03 · Brand elements", "Four things on every post", `
  <div class="g-els">
    <div class="g-el"><h3>Receipt strip</h3><p>Top of every canvas. Left: content code in mono (<code>TIP · 014</code>, <code>GUIDE · 007</code>, <code>OFFER · 012</code>). Right: a status chip with a dot. Closed by a dashed rule, like a till receipt. Number posts sequentially per pillar.</p></div>
    <div class="g-el"><h3>Status chip</h3><p>Pill with a coloured dot: teal on Paper, gold on Vault, Vault on Gold. Two or three words. It tells the scroller what kind of post this is before they read it.</p></div>
    <div class="g-el"><h3>Karma Ring</h3><p>The gold ring (what goes around comes around), always cropped off the bottom-right corner at 38% of its size. White on Gold posts, 45% opacity on Paper. Dropped on carousel steps and announcements so content can breathe.</p></div>
    <div class="g-el"><h3>Settlement footer</h3><p>Wordmark left, URL or carousel dots right. Same position on every size. The wordmark here is a type-set placeholder: replace <code>.kc-mark</code> with your logo SVG at the same height (34 / 48 / 52 px).</p></div>
  </div>
  <h3>Signature moves</h3>
  <ul class="g-list">
    <li><strong>The gold highlight.</strong> One phrase per headline, the promise (“under 1%”, “Get approved”). Marker underline on Paper, gold text on Vault.</li>
    <li><strong>The Declined strike.</strong> Coral line through “Declined”, followed by the positive word. Use on promotions and covers, at most once a month.</li>
    <li><strong>Numbers as heroes.</strong> Tip and step numbers set in Display size. A merchant should be able to say “tip 14” in a DM.</li>
  </ul>
`)}
${section("pillars", "04 · Content pillars", "What to post, in which layout", `
  <div class="g-table"><table>
    <thead><tr><th>Pillar</th><th>Layout</th><th>Mode</th><th>Cadence</th><th>Job</th></tr></thead>
    <tbody>${pillars.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>
  <p class="g-note">Voice for high-risk merchants: reassuring and expert. Name the fear (“declined”, “frozen funds”, “reserve”), then the fix. No hype, no guarantees, no exclamation marks.</p>
`)}
${section("templates", "05 · Templates", "Eight layouts × three sizes", templates.map((t) => `
  <article class="g-tpl" id="tpl-${t.key}">
    <div class="g-tplhead"><h3>${t.name}</h3><p class="g-tags"><span>${t.pillar}</span><span>${t.mode}</span></p></div>
    <p class="g-when">${t.when}</p>
    <div class="g-frames">${frame(t.key, "L")}${frame(t.key, "P")}${frame(t.key, "S")}</div>
    <div class="g-spec">
      <div><h4>Text hierarchy</h4><ol>${t.hierarchy.map((h) => `<li>${h}</li>`).join("")}</ol></div>
      <div><h4>Copy limits</h4><p>${t.limits}</p><h4>Image placement</h4><p>${t.image}</p></div>
    </div>
  </article>`).join(""))}
${section("imagery", "06 · Imagery", "Photo direction", `
  <div class="g-dodont">
    <div><h3>Use</h3><ul class="g-list"><li>Real merchants at work: counters, warehouses, studios, clinics.</li><li>Card terminals and checkout screens in context.</li><li>Duotone treatment: photo at 100%, Vault multiply layer at 20–35%.</li><li>Faces looking toward the text side of the canvas.</li></ul></div>
    <div><h3>Avoid</h3><ul class="g-list"><li>Handshakes, piles of cash, stock “business people”.</li><li>Product imagery for restricted categories (firearms, CBD, adult, gambling). Meta may limit or reject the post.</li><li>Text baked into photos. All text stays live in the template.</li><li>Logos of card networks unless you follow their brand rules.</li></ul></div>
  </div>
`)}
${section("compliance", "07 · Compliance", "Rules for a high-risk processor", `
  <ul class="g-list">
    <li><strong>No guaranteed approvals.</strong> Say “open to all industries” or “apply and hear back in 24–48 hours”, never “guaranteed approval”.</li>
    <li><strong>Legal line on every offer.</strong> “Approval subject to underwriting. Rates and terms vary by industry and processing history.” Add end dates in the caption.</li>
    <li><strong>Check every claim against the website.</strong> “No setup fees” and approval-rate figures must match current terms before posting.</li>
    <li><strong>Testimonials need written permission</strong> and must be the merchant's own words. The sample tag on the template is there to stop a placeholder going live.</li>
    <li><strong>Boosted posts</strong> about financial services fall under Meta's special ad categories in some regions, which limits targeting. Plan audiences with that in mind.</li>
  </ul>
`)}
${section("checklist", "08 · Production", "Pre-post checklist", `
  <ol class="g-check">
    <li>Right layout for the pillar, right colour mode, and it doesn't repeat the previous post's mode.</li>
    <li>Receipt code updated and sequential (<code>TIP · 015</code> follows <code>014</code>).</li>
    <li>One highlight in the headline. Copy within the character limits.</li>
    <li>Nothing readable in Story safe zones (top 220 px, bottom 300 px).</li>
    <li>Legal line present on promotions; sample tag removed from real testimonials.</li>
    <li>Export PNG at native size: 1200×630, 1080×1350, 1080×1920.</li>
    <li>Caption: hook in the first 125 characters, a CTA, the URL, 3–5 hashtags at most.</li>
  </ol>
  <p class="g-note">Files: <code>exports/png/</code> holds the rendered samples, <code>exports/express/</code> one Adobe Express import file per size, and <code>src/templates.mjs</code> the sample copy you edit to make new posts. Run <code>npm run build</code> to regenerate everything.</p>
`)}
</main>
<footer class="g-foot g-wrap"><span class="kc-mark"><i></i>Karma<b>Card Payments</b></span><span>Social design kit · karmacardpayments.com</span></footer>`;

const head = `<title>Karma Card Social Kit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS_URL}">
<style>${kitCss}
${GUIDE_CSS}</style>`;

writeFileSync(join(root, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${body}</body></html>`);
const artifactOut = process.argv[2];
if (artifactOut) writeFileSync(artifactOut, `${head}\n${body}`);

// ---- PDF ---------------------------------------------------------------
const browser = await launch();
const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await pg.emulateMedia({ media: "print", colorScheme: "light" });
await pg.goto("file://" + join(root, "index.html"));
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: join(root, "exports/KarmaCard-Social-Design-Kit.pdf"), width: "1280px", height: "1656px", printBackground: true, margin: { top: "48px", bottom: "48px" } });
await browser.close();
console.log("built guide + PDF");
