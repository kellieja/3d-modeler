# Flux Replicas

Two interactive canvas experiments, each a single self-contained HTML file with no build step, no dependencies and no external requests.

**Live site:** https://kellieja.github.io/3d-modeler/

| Replica | Live | What it does |
| --- | --- | --- |
| **Reel Flux** | [Open](https://kellieja.github.io/3d-modeler/reel-flux/) | An endless horizontal reel of cards. Fling it and the cards ripple in a sine wave that grows with your speed, then settle flat as it slows. |
| **3D Spiral Flux Gallery** | [Open](https://kellieja.github.io/3d-modeler/spiral-gallery/) | Sixteen cards wrapped around a 3D helix. Travel along it, snap to cards, and open any card full-size. Cards at the edges get a neon fringe and smear. |

## Controls

**Reel Flux**
- Drag (mouse or touch) or scroll to move the reel
- Click the reel, then use **←** / **→** to push it
- The ripple is turned off when your system's "reduce motion" setting is on

**3D Spiral Flux Gallery**
- Drag or scroll to travel the spiral
- **←** / **→** (or **↑** / **↓**) step one card at a time
- **Enter** or clicking the front card opens it full-size, **Esc** closes it
- **Space** or the **Pause** button toggles auto-rotation, which resumes after a few seconds idle and is off when "reduce motion" is on

## Project layout

```
index.html                  Landing page linking to both replicas
reel-flux/index.html        Reel Flux
spiral-gallery/index.html   3D Spiral Flux Gallery
.nojekyll                   Tells GitHub Pages to serve the files as-is
```

## Run locally

Open any `index.html` directly in a browser, or serve the folder so the links between pages work:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customising

Each page keeps its tunable settings in a config object near the top of its script:

- **Reel Flux:** `CONFIG` (card size, gap, friction, wave frequency and amplitude). The card artwork comes from the `palettes` list, which is turned into inline SVG gradient landscapes.
- **Spiral Gallery:** `config` (cards per turn, radius, turn height, auto-rotate speed and idle delay). Card titles and colours are in `titles` and `palettes`. To use real photos, replace `makePlaceholder()`.

## Publishing

The site is served by GitHub Pages from the root of the default branch (**Settings → Pages → Deploy from a branch → `/ (root)`**). Every push to that branch updates the live pages.
