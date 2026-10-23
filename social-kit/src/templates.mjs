// Post templates for the Karma Card Payments social kit.
// Each template is a function (size, content) -> HTML string for one canvas.
// Sample content lives in SAMPLES so a new post is just a new content object.

export const SIZES = {
  L: { w: 1200, h: 630, name: "Facebook landscape", use: "FB feed, link shares, events" },
  P: { w: 1080, h: 1350, name: "Portrait 4:5", use: "IG + FB feed, carousels" },
  S: { w: 1080, h: 1920, name: "Story 9:16", use: "IG + FB Stories, Reel covers" },
};

const ring = `<div class="kc-ring" aria-hidden="true"></div><div class="kc-ring-in" aria-hidden="true"></div>`;

const strip = (id, chip) =>
  `<header class="kc-strip"><span class="kc-id">${id}</span><span class="kc-chip"><i class="kc-dot"></i>${chip}</span></header>`;

const foot = (right = "karmacardpayments.com") =>
  `<footer class="kc-foot"><span class="kc-mark"><i></i>Karma<b>Card Payments</b></span><span>${right}</span></footer>`;

const post = (size, tpl, mode, inner, { ringOn = true } = {}) => {
  const s = SIZES[size];
  return `<section class="kc-post slide size-${size} ${tpl} mode-${mode}" data-canvas-width="${s.w}" data-canvas-height="${s.h}">${ringOn ? ring : ""}${inner}</section>`;
};

const dots = (n, on) =>
  `<span class="kc-dots">${Array.from({ length: n }, (_, i) => `<i class="${i === on ? "on" : ""}"></i>`).join("")}</span>`;

export const TEMPLATES = {
  tip: (size, c) =>
    post(size, "t-tip", "paper", `
      ${strip(`Tip · ${c.no}`, c.pillar)}
      <div class="kc-body">
        <div class="kc-num">${c.no}</div>
        <p class="kc-eyebrow">${c.eyebrow}</p>
        <h2 class="kc-h1">${c.headline}</h2>
        <p class="kc-text">${c.body}</p>
      </div>
      ${foot("Save this for later ↓")}`),

  cover: (size, c) =>
    post(size, "t-cover", "vault", `
      ${strip(`Guide · ${c.no}`, `${c.slides} steps`)}
      <div class="kc-body">
        <p class="kc-eyebrow">${c.eyebrow}</p>
        <h2 class="kc-display">${c.headline}</h2>
        <p class="kc-text">${c.body}</p>
        <span class="kc-swipe">Swipe to start →</span>
      </div>
      ${foot(dots(c.slides + 2, 0))}`),

  step: (size, c) =>
    post(size, "t-step", "paper", `
      ${strip(`Guide · ${c.no}`, `Step ${c.step} of ${c.slides}`)}
      <div class="kc-body">
        <div class="kc-left">
          <div class="kc-stepno"><strong>${String(c.step).padStart(2, "0")}</strong>Step</div>
          <h2 class="kc-h1">${c.headline}</h2>
          <p class="kc-text">${c.body}</p>
        </div>
        <ul class="kc-check">${c.checks.map((x) => `<li><b>✓</b>${x}</li>`).join("")}</ul>
      </div>
      ${foot(dots(c.slides + 2, c.step))}`, { ringOn: false }),

  cta: (size, c) =>
    post(size, "t-cta", "vault", `
      ${strip(`Guide · ${c.no}`, "Next step")}
      <div class="kc-body">
        <p class="kc-eyebrow">${c.eyebrow}</p>
        <h2 class="kc-display">${c.headline}</h2>
        <p class="kc-text">${c.body}</p>
        <span class="kc-cta">${c.button} →</span>
      </div>
      ${foot(dots(c.slides + 2, c.slides + 1))}`),

  quote: (size, c) =>
    post(size, "t-quote", "gold", `
      ${strip(`Note · ${c.no}`, c.pillar)}
      <div class="kc-body">
        <div class="kc-qmark" aria-hidden="true">“</div>
        <blockquote><p class="kc-h1">${c.quote}</p></blockquote>
        <p class="kc-attr"><i class="kc-rule"></i>${c.attribution}</p>
      </div>
      ${foot()}`),

  announce: (size, c) =>
    post(size, "t-announce", "vault", `
      ${strip(`News · ${c.no}`, c.chip)}
      <div class="kc-body">
        <div class="kc-copy">
          <p class="kc-eyebrow">${c.eyebrow}</p>
          <h2 class="kc-display">${c.headline}</h2>
          <p class="kc-text">${c.body}</p>
          <div class="kc-meta">${c.meta.map((m) => `<span>${m}</span>`).join("")}</div>
        </div>
        <div class="kc-photo"><span>${c.photo}</span></div>
      </div>
      ${foot()}`, { ringOn: false }),

  testimonial: (size, c) =>
    post(size, "t-testimonial", "paper", `
      ${strip(`Review · ${c.no}`, "Merchant story")}
      <div class="kc-body">
        <div class="kc-copy">
          <span class="kc-tag">${c.tag}</span>
          <div class="kc-stars" aria-label="5 out of 5">★★★★★</div>
          <p class="kc-h2">“${c.quote}”</p>
          ${size === "L" ? "" : who(c)}
        </div>
        ${size === "L" ? `<div class="kc-side">${who(c, true)}</div>` : ""}
      </div>
      ${foot()}`),

  promo: (size, c) =>
    post(size, "t-promo", "vault", `
      ${strip(`Offer · ${c.no}`, c.chip)}
      <div class="kc-body">
        <div class="kc-copy">
          <p class="kc-eyebrow">${c.eyebrow}</p>
          <h2 class="kc-display">${c.headline}</h2>
          <span class="kc-cta">${c.button} →</span>
        </div>
        <div class="kc-offer">
          <span class="kc-big">${c.offer}</span>
          <p class="kc-micro">${c.offerNote}</p>
        </div>
      </div>
      <p class="kc-legal">${c.legal}</p>
      ${foot()}`),
};

function who(c, stacked = false) {
  const photo = `<div class="kc-photo round"><span>${stacked ? "Photo<br>1:1" : "1:1"}</span></div>`;
  return stacked
    ? `<div class="kc-who" style="flex-direction:column;align-items:flex-start">${photo.replace('class="kc-photo round"', 'class="kc-photo round" style="width:100%"')}<div><strong>${c.name}</strong><span>${c.biz}</span></div></div>`
    : `<div class="kc-who">${photo}<div><strong>${c.name}</strong><span>${c.biz}</span></div></div>`;
}

// ---- Sample content (real Karma Card Payments positioning) ---------------
const guide = {
  no: "007",
  slides: 4,
  eyebrow: "High-risk approval guide",
};

export const SAMPLES = {
  tip: {
    no: "014",
    pillar: "Merchant tip",
    eyebrow: "Chargeback health",
    headline: 'Keep chargebacks <span class="kc-hl">under 1%</span> of monthly sales.',
    body: "Processors start watching accounts that get close. Clear billing descriptors and fast refunds keep you well below the line.",
  },
  cover: {
    ...guide,
    headline: 'Declined before? <span class="kc-hl">Get approved</span> the right way.',
    body: "Four things underwriters check first, and how to have them ready.",
  },
  step: {
    ...guide,
    step: 1,
    headline: "Gather your processing history.",
    body: "Underwriters want proof of stable volume and low disputes.",
    checks: ["3–6 months of statements", "Chargeback & refund ratios", "Current processor's name"],
  },
  cta: {
    ...guide,
    eyebrow: "Ready when you are",
    headline: 'Open to <span class="kc-hl">all industries.</span>',
    body: "Send your application and hear back in 24–48 hours.",
    button: "Apply at karmacardpayments.com",
  },
  quote: {
    no: "021",
    pillar: "From our team",
    quote: "A decline elsewhere isn’t the end of the conversation. It’s where ours starts.",
    attribution: "The Karma Card team",
  },
  announce: {
    no: "003",
    chip: "Now onboarding",
    eyebrow: "New industry page",
    headline: "Telemedicine merchant accounts are open.",
    body: "Card, ACH and online checkout under one account built for healthcare risk profiles.",
    meta: ["Card + ACH", "Online checkout", "24–48 hr response"],
    photo: "Photo · provider or clinic · duotone",
  },
  testimonial: {
    no: "009",
    tag: "Sample · replace with a real, approved review",
    quote: "Two processors turned us down. Karma Card had us taking payments again inside a week.",
    name: "Merchant first name + initial",
    biz: "Industry · City, State",
  },
  promo: {
    no: "012",
    chip: "Limited time",
    eyebrow: "Switch processors",
    headline: 'High-risk? <span class="kc-strike">Declined<i class="kc-strike-line"></i></span> <span class="kc-hl">Covered.</span>',
    button: "Start your application",
    offer: "$0 setup",
    offerNote: "No setup fees on new high-risk merchant accounts.",
    legal: "Approval subject to underwriting. Rates and terms vary by industry and processing history.",
  },
};

export const ORDER = [
  ["tip", "Educational tip"],
  ["cover", "Carousel · cover"],
  ["step", "Carousel · step"],
  ["cta", "Carousel · closing CTA"],
  ["quote", "Quote"],
  ["announce", "Announcement"],
  ["testimonial", "Testimonial"],
  ["promo", "Promotion"],
];

export const render = (tpl, size, content = SAMPLES[tpl]) => TEMPLATES[tpl](size, content);
