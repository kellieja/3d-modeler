# Karma Card Payments · Social Design Kit

Reusable Facebook and Instagram post layouts for karmacardpayments.com, written for high-risk merchants. There are eight layouts, each in three sizes, and they all follow one set of rules for type, spacing, imagery and branding.

Open `index.html` for the full style guide, or `exports/KarmaCard-Social-Design-Kit.pdf` for the printable version.

## What's in the kit

| Layout | Content pillar | Colour mode |
| --- | --- | --- |
| Educational tip | Tips | Paper |
| Carousel cover | Tutorials | Vault |
| Carousel step | Tutorials | Paper |
| Carousel closing CTA | Tutorials | Vault |
| Quote | Quotes | Gold |
| Announcement | News / promotions | Vault |
| Testimonial | Social proof | Paper |
| Promotion | Promotions | Vault |

| Size | Pixels | Use |
| --- | --- | --- |
| L | 1200×630 | Facebook feed, link shares, events |
| P | 1080×1350 | Instagram + Facebook feed, carousels |
| S | 1080×1920 | Stories, Reel covers (top 220 px and bottom 300 px kept clear) |

Every post has the same four brand elements: the **receipt strip** (content code + status chip), the **message**, the **Karma Ring** cropped off the bottom-right corner, and the **settlement footer** (wordmark + URL or carousel dots).

## Folders

```
social-kit/
├── index.html                  Style guide (colour, type, grid, elements, templates, imagery, compliance)
├── src/
│   ├── kit.css                 Brand tokens + every layout. Change a colour or font here.
│   ├── templates.mjs           Layout functions + the sample copy. Edit SAMPLES to make new posts.
│   ├── build-posts.mjs         Renders the canvases and the PNGs
│   ├── build-express.mjs       Flattens the canvases into Adobe Express import files
│   ├── build-guide.mjs         Builds index.html and the PDF
│   └── guide-style.mjs         Styles for the guide page only
└── exports/
    ├── png/                    24 rendered posts (8 layouts × 3 sizes), at native resolution
    ├── canvas/                 Source canvases, one HTML file per size
    ├── express/                Adobe Express import files (absolute positions, Adobe Fonts)
    └── KarmaCard-Social-Design-Kit.pdf
```

## Adobe Express documents

Each document holds all eight layouts for one size. Duplicate a page, then edit the text in place.

- [Facebook landscape · 1200×630](https://new.express.adobe.com/id/urn:aaid:sc:VA6C2:ce8dd355-8e8b-4138-a4a6-af574d7dba72)
- [Portrait feed + carousel · 1080×1350](https://new.express.adobe.com/id/urn:aaid:sc:VA6C2:fe2f6bc2-3e85-4589-bf79-cf60079a7700)
- [Story · 1080×1920](https://new.express.adobe.com/id/urn:aaid:sc:VA6C2:0b369ac5-f3e1-461a-b2fc-395bc4b5c42b)

## Making a new post

1. Copy an entry in `SAMPLES` in `src/templates.mjs` and change the copy. Stay inside the character limits listed in the style guide.
2. Run `npm run build` (Node 18+ and Playwright's Chromium are required).
3. Pick up the PNG from `exports/png/`, or import the matching `exports/express/` file into Adobe Express to edit it there.

## Fonts

- Display: **Bricolage Grotesque** (700, 800)
- Body: **Figtree** (500, 600, 700)
- Labels: **IBM Plex Mono** (500, 600)

All three are free on Google Fonts and Adobe Fonts, so the PNGs and the Express files use the same faces.

## Before you post

- The colours and fonts are a proposed system: the live site couldn't be read while this kit was being built. If your brand already has hex codes or a logo, swap the tokens at the top of `src/kit.css` and replace the type-set wordmark (`.kc-mark`) with your logo.
- Check that "No setup fees" and the "24–48 hour" response time match your current terms before you use the promotion and CTA samples.
- The testimonial sample is placeholder copy and is tagged as such. Only publish real reviews, with the merchant's written permission.
