// Styles for the style-guide page that presents the kit (not the posts).
export const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600&family=Figtree:wght@400;500;600;700&display=swap";

export const GUIDE_CSS = String.raw`
/* Layout: one 1120px reading column; template previews sit in a wrapping row of real canvases scaled with zoom. */
:root {
  --g-bg: #F7F8FB; --g-fg: #12204A; --g-sub: #56618A; --g-line: #DDE1EC;
  --g-card: #FFFFFF; --g-accent: #12806F; --g-hero: #12204A; --g-hero-fg: #FFFFFF; --g-gold: #E8B44A;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --g-bg: #0B1330; --g-fg: #E9ECF5; --g-sub: #A3ACCB; --g-line: #26335F;
  --g-card: #121D44; --g-accent: #4CC3AE; --g-hero: #060C22; --g-hero-fg: #FFFFFF; --g-gold: #E8B44A; color-scheme: dark; } }
:root[data-theme="dark"] {
  --g-bg: #0B1330; --g-fg: #E9ECF5; --g-sub: #A3ACCB; --g-line: #26335F;
  --g-card: #121D44; --g-accent: #4CC3AE; --g-hero: #060C22; --g-hero-fg: #FFFFFF; --g-gold: #E8B44A; color-scheme: dark; }

body { background: var(--g-bg); color: var(--g-fg); font-family: var(--kc-body); font-size: 16px; line-height: 1.55; margin: 0; }
.g-wrap { max-width: 1120px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); box-sizing: border-box; }
code { font-family: var(--kc-mono); font-size: .88em; background: color-mix(in srgb, var(--g-accent) 12%, transparent); padding: .1em .35em; border-radius: 4px; }
h1, h2, h3, h4 { font-family: var(--kc-display); letter-spacing: -.02em; text-wrap: balance; margin: 0; }
h3 { font-size: 22px; font-weight: 700; }
h4 { font-family: var(--kc-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--g-sub); font-weight: 600; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--g-gold); outline-offset: 2px; }

.g-hero { background: var(--g-hero); color: var(--g-hero-fg); padding-block: 72px 56px; position: relative; overflow: hidden; }
.g-hero::after { content: ""; position: absolute; width: 380px; height: 380px; right: -150px; bottom: -210px; border-radius: 50%; border: 24px solid var(--g-gold); opacity: .9; }
.g-hero .g-wrap { position: relative; z-index: 1; display: grid; gap: 22px; }
.g-hero h1 { font-size: clamp(40px, 7vw, 84px); font-weight: 800; line-height: .95; letter-spacing: -.035em; max-width: 12ch; }
.g-hero h1 span { color: var(--g-gold); }
.g-lede { font-size: clamp(17px, 2vw, 20px); color: #C4CBE3; max-width: 60ch; margin: 0; }
.g-kicker { font-family: var(--kc-mono); font-size: 12px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--g-accent); margin: 0; }
.g-hero .g-kicker { color: var(--g-gold); }
.g-toc { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 12px; border-top: 2px dashed rgba(255,255,255,.2); }
.g-toc a { font-family: var(--kc-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; text-decoration: none; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,.08); }
.g-toc a:hover { background: rgba(232,180,74,.25); }

.g-sec { padding-block: 64px 8px; display: grid; gap: 20px; }
.g-head { display: grid; gap: 6px; padding-bottom: 14px; border-bottom: 2px dashed var(--g-line); }
.g-head h2 { font-size: clamp(30px, 4vw, 44px); font-weight: 800; line-height: 1; }
.g-sec > p, .g-note { max-width: 68ch; margin: 0; }
.g-note { color: var(--g-sub); font-size: 15px; }

.g-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.g-sw { display: grid; grid-template-columns: 84px 1fr; gap: 14px; align-items: start; }
.g-chip { height: 84px; border-radius: 14px; display: flex; align-items: flex-end; padding: 8px; box-shadow: inset 0 0 0 1px rgba(18,32,74,.12); }
.g-chip span { font-family: var(--kc-mono); font-size: 11px; font-weight: 600; }
.ink-light span { color: #fff; } .ink-dark span { color: #12204A; }
.g-swtext { display: grid; gap: 2px; min-width: 0; }
.g-swtext p { margin: 4px 0 0; font-size: 14px; color: var(--g-sub); line-height: 1.4; }
.g-swtext code { justify-self: start; }

.g-modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.g-mode { border-radius: 16px; padding: 20px; display: grid; gap: 4px; min-height: 120px; align-content: end; box-shadow: inset 0 0 0 1px rgba(18,32,74,.1); }
.g-mode strong { font-family: var(--kc-display); font-size: 28px; letter-spacing: -.02em; }
.g-mode span { font-size: 14px; opacity: .85; }
.g-mode em { font-style: normal; font-family: var(--kc-mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; }

.g-table { overflow-x: auto; border: 1px solid var(--g-line); border-radius: 12px; background: var(--g-card); }
table { border-collapse: collapse; width: 100%; font-size: 14px; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--g-line); vertical-align: top; }
th { font-family: var(--kc-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--g-sub); font-weight: 600; white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.g-specimen { display: grid; gap: 10px; padding: 28px; border-radius: 16px; background: var(--g-card); border: 1px solid var(--g-line); }

.g-zones { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-end; }
.g-zone { position: relative; margin: 0; background: var(--g-card); border: 1px solid var(--g-line); border-radius: 6px; max-width: 100%; }
.g-zone:nth-child(1) { width: 300px; } .g-zone:nth-child(2) { width: 180px; } .g-zone:nth-child(3) { width: 150px; }
.g-zone .z-top, .g-zone .z-bot { position: absolute; left: 0; right: 0; background: repeating-linear-gradient(135deg, color-mix(in srgb, #D9583F 22%, transparent) 0 6px, transparent 6px 12px); }
.g-zone .z-top { top: 0; } .g-zone .z-bot { bottom: 0; }
.g-zone .z-safe { position: absolute; border: 1.5px dashed var(--g-accent); border-radius: 3px; display: flex; align-items: center; justify-content: center; }
.g-zone .z-safe span, .g-zone figcaption { font-family: var(--kc-mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--g-sub); }
.g-zone figcaption { position: absolute; top: calc(100% + 6px); left: 0; white-space: nowrap; }
.g-zones { padding-bottom: 24px; }

.g-els { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.g-el { background: var(--g-card); border: 1px solid var(--g-line); border-radius: 14px; padding: 20px; display: grid; gap: 8px; align-content: start; }
.g-el p { margin: 0; font-size: 15px; color: var(--g-sub); }
.g-list { margin: 0; padding-left: 1.2em; display: grid; gap: 8px; max-width: 72ch; }
.g-check { margin: 0; padding-left: 1.4em; display: grid; gap: 8px; max-width: 72ch; }
.g-dodont { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.g-dodont > div { display: grid; gap: 10px; align-content: start; }

.g-tpl { display: grid; gap: 16px; padding-block: 28px; border-bottom: 1px solid var(--g-line); break-inside: avoid; }
.g-tplhead { display: flex; flex-wrap: wrap; gap: 12px; align-items: baseline; justify-content: space-between; }
.g-tplhead h3 { font-size: 28px; font-weight: 800; }
.g-tags { display: flex; gap: 6px; margin: 0; }
.g-tags span { font-family: var(--kc-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--g-line); color: var(--g-sub); }
.g-when { margin: 0; max-width: 70ch; }
.g-frames { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
.g-frame { margin: 0; display: grid; gap: 6px; max-width: 100%; }
.g-frame figcaption { font-family: var(--kc-mono); font-size: 11px; letter-spacing: .1em; color: var(--g-sub); }
.g-canvas { border-radius: 6px; overflow: hidden; box-shadow: 0 1px 2px rgba(10,18,48,.12), 0 8px 24px -12px rgba(10,18,48,.35); width: max-content; max-width: 100%; }
.g-L .g-canvas { zoom: .36; } .g-P .g-canvas { zoom: .3; } .g-S .g-canvas { zoom: .25; }
.g-spec { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.g-spec > div { display: grid; gap: 8px; align-content: start; }
.g-spec ol { margin: 0; padding-left: 1.3em; display: grid; gap: 4px; font-size: 15px; }
.g-spec p { margin: 0 0 8px; font-size: 15px; color: var(--g-sub); }

.g-foot { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding-block: 48px; font-family: var(--kc-mono); font-size: 12px; color: var(--g-sub); --mark: 28px; }
.g-foot .kc-mark { color: var(--g-fg); }

@media (max-width: 720px) {
  .g-hero::after { width: 200px; height: 200px; right: -90px; bottom: -120px; border-width: 14px; }
  .g-L .g-canvas { zoom: .28; } .g-P .g-canvas { zoom: .2; } .g-S .g-canvas { zoom: .17; }
  .g-sec { padding-block: 44px 4px; }
}
@media print {
  .g-toc { display: none; }
  .g-table, .g-el, .g-specimen, .g-zones, .g-modes, .g-sw, .g-head, .g-spec, .g-dodont > div { break-inside: avoid; }
  .g-head, h3 { break-after: avoid; }
  .g-sec { break-before: auto; }
  #templates, #imagery { break-before: page; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;
